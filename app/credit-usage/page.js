"use client";

import { IconChevronRight, IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImpactBreakdownSheet from "../components/ImpactBreakdownSheet";
import NavBar from "../components/NavBar";
import { mock } from "../data/mock";

const COPY = mock.creditUsageDetail;

// Utilization only applies to revolving accounts — loans have no limit.
const CARDS = [...mock.loans.active, ...mock.loans.closed].filter(
  (a) => a.type === "card",
);

// Amounts in the mock are display strings ("₹51,132"); parse them back for
// the math, format again for the header row.
function parseINR(s) {
  return Number(s.replace(/[₹,]/g, ""));
}
function formatINR(n) {
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
function usedPct(account) {
  const used = parseINR(account.limitUsedAmount);
  const limit = parseINR(account.creditLimit);
  return limit > 0 ? (used / limit) * 100 : 0;
}

const TOTAL_USED = CARDS.reduce((n, a) => n + parseINR(a.limitUsedAmount), 0);
const TOTAL_LIMIT = CARDS.reduce((n, a) => n + parseINR(a.creditLimit), 0);
const TOTAL_PCT = (TOTAL_USED / TOTAL_LIMIT) * 100;

// The badge and breakdown sheet reuse the credit-utilization impact data.
const IMPACT = mock.impacts.find((i) => i.id === "credit-utilization");

// Card row: logo tile + bank on the left, used % + chevron on the right.
function CardRow({ account, last, onClick }) {
  const Icon = account.icon;
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
        <span className="text-[14px] leading-5 font-semibold text-content-primary">
          {account.bank}
        </span>
      </span>
      <span className="flex items-center gap-1">
        <span className="flex flex-col items-end">
          <span className="text-[15px] leading-5 font-bold text-content-primary">
            {usedPct(account).toFixed(2)}%
          </span>
          <span className="text-[12px] leading-4 text-content-secondary">
            Credit used
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

export default function CreditUsage() {
  const router = useRouter();
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar backHref="/score" border={false} />

      {/* Hero — factor summary */}
      <section className="flex flex-col gap-6 border-b border-border-primary bg-white px-4 pt-2 pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl leading-8 font-bold text-content-primary">
            {COPY.title}
          </h1>
          <p className="text-[15px] leading-6 font-medium text-content-primary">
            {COPY.factorLabel}
          </p>
          <p className="text-sm leading-6 text-content-secondary">
            {COPY.description}
          </p>
        </div>

        {/* Utilized vs max limit */}
        <div className="flex flex-col gap-3">
          <div className="h-8 w-full overflow-hidden rounded-lg bg-background-secondary">
            <div
              className="h-full rounded-l-lg bg-background-postive"
              style={{ width: `${Math.max(TOTAL_PCT, 1)}%` }}
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[17px] leading-6 font-bold text-content-primary">
                {formatINR(TOTAL_USED)}
              </span>
              <span className="text-sm leading-5 text-content-secondary">
                {COPY.utilizedLabel}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[17px] leading-6 font-bold text-content-primary">
                {formatINR(TOTAL_LIMIT)}
              </span>
              <span className="text-sm leading-5 text-content-secondary">
                {COPY.maxLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className=" text-[10px] leading-4 font-medium tracking-[1px] text-content-secondary uppercase">
            {COPY.pctLabel}
          </p>
          <div className="flex flex-col items-start gap-2">
            <p className="text-2xl leading-9 font-bold text-content-primary">
              {TOTAL_PCT.toFixed(2)}%
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-background-postive px-3 py-1 text-[14px] leading-5 font-semibold text-content-inverse-primary">
              {IMPACT.rating}
              <button
                type="button"
                aria-label="How credit utilization is classified"
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
      <section className="mt-6 flex flex-col gap-2 px-4 pb-8">
        <h2 className="text-sm leading-6 font-semibold text-content-secondary">
          Credit cards
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
          {CARDS.map((account, i) => (
            <CardRow
              key={account.id}
              account={account}
              last={i === CARDS.length - 1}
              onClick={() => router.push(`/card?id=${account.id}`)}
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
