"use client";

import { IconChevronRight, IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImpactBreakdownSheet from "../components/ImpactBreakdownSheet";
import NavBar from "../components/NavBar";
import { mock } from "../data/mock";

const COPY = mock.paymentHistoryDetail;

// Count each account's reported months (anything but not-reported) and how
// many of those were on time. In this report every reported month is on
// time, so the two match everywhere — but delayed/overdue months would
// lower `onTime` below `total`.
function paymentCounts(account) {
  const months = Object.values(account.payments.byYear).flat();
  const total = months.filter((m) => m.status !== "not-reported").length;
  const onTime = months.filter((m) => m.status === "on-time").length;
  return { onTime, total };
}

const ALL_ACCOUNTS = [...mock.loans.active, ...mock.loans.closed];
const CARDS = ALL_ACCOUNTS.filter((a) => a.type === "card");
const LOANS = ALL_ACCOUNTS.filter((a) => a.type === "loan");
const TOTAL_ON_TIME = ALL_ACCOUNTS.reduce(
  (n, a) => n + paymentCounts(a).onTime,
  0,
);

// The badge and breakdown sheet reuse the payment-history impact tile's data.
const IMPACT = mock.impacts.find((i) => i.id === "payment-history");

// Account row: logo tile + name on the left, on-time count + chevron on the
// right. Loans also show their product type (parsed off the row detail).
function AccountRow({ account, subtitle, last, onClick }) {
  const Icon = account.icon;
  const { onTime, total } = paymentCounts(account);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-background-secondary ${
        last ? "" : "border-b border-border-primary"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border-primary bg-background-secondary text-content-primary">
          <Icon size={22} stroke={1.5} />
        </span>
        <span className="flex flex-col">
          <span className="text-[14px] leading-5 font-semibold text-content-primary">
            {account.bank}
          </span>
          {subtitle && (
            <span className="text-[14px] leading-5 text-content-secondary">
              {subtitle}
            </span>
          )}
        </span>
      </span>
      <span className="flex items-center gap-1">
        <span className="flex flex-col items-end">
          {/* All months on time reads green; any misses read amber */}
          <span
            className={`text-[15px] leading-5 font-bold ${
              onTime === total ? "text-content-postive" : "text-content-warning"
            }`}
          >
            {onTime}/{total}
          </span>
          <span className="text-[12px] leading-4 text-content-secondary">
            On-time
          </span>
        </span>
        <IconChevronRight
          size={18}
          stroke={2}
          className="shrink-0 text-content-tertiary"
        />
      </span>
    </button>
  );
}

export default function PaymentHistory() {
  const router = useRouter();
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar backHref="/score" border={false} />

      {/* Hero — factor summary */}
      <section className="flex flex-col gap-6 px-4 pt-2 pb-8 bg-white border-b border-border-primary">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl leading-8 font-bold text-content-primary">
            Payment history
          </h1>
          <p className="text-[15px] leading-6 font-medium text-content-primary">
            {COPY.factorLabel}
          </p>
          <p className="text-sm leading-6 text-content-secondary">
            {COPY.description}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[15px] leading-6 text-content-secondary">
            {COPY.onTimeLabel}
          </p>
          <div className="flex flex-col items-start gap-2">
            <p className="text-2xl leading-9 font-bold text-content-primary">
              {TOTAL_ON_TIME}/{TOTAL_ON_TIME}{" "}
              <span className="text-lg font-medium text-content-secondary">
                (100%)
              </span>
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-background-postive px-3 py-1 text-[14px] leading-5 font-semibold text-content-inverse-primary">
              {IMPACT.rating}
              <button
                type="button"
                aria-label="How payment history is classified"
                onClick={() => setBreakdownOpen(true)}
                className="flex cursor-pointer items-center"
              >
                <IconInfoCircle size={16} stroke={2} />
              </button>
            </span>
          </div>
        </div>
      </section>

      {/* Credit cards */}
      <section className="flex flex-col gap-2 px-4 pb-6 mt-8">
        <h2 className="text-sm leading-6 font-semibold text-content-secondary">
          Credit cards
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
          {CARDS.map((account, i) => (
            <AccountRow
              key={account.id}
              account={account}
              last={i === CARDS.length - 1}
              onClick={() => router.push(`/card?id=${account.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Loans */}
      <section className="flex flex-col gap-2 px-4 pb-8">
        <h2 className="text-sm leading-6 font-semibold text-content-secondary">
          Loans
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
          {LOANS.map((account, i) => (
            <AccountRow
              key={account.id}
              account={account}
              subtitle={account.detail.split("·")[1]?.trim()}
              last={i === LOANS.length - 1}
              onClick={() => router.push(`/loan?id=${account.id}`)}
            />
          ))}
        </div>
      </section>

      <ImpactBreakdownSheet
        impact={breakdownOpen ? IMPACT : null}
        onOpenChange={setBreakdownOpen}
      />
    </div>
  );
}
