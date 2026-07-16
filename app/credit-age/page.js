"use client";

import { IconChevronRight, IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImpactBreakdownSheet from "../components/ImpactBreakdownSheet";
import NavBar from "../components/NavBar";
import { mock } from "../data/mock";

const COPY = mock.creditAgeDetail;

// Credit age counts active accounts only (per the factor definition).
const CARDS = mock.loans.active.filter((a) => a.type === "card");
const LOANS = mock.loans.active.filter((a) => a.type === "loan");

// Ages are measured against the report fetch date, matching the bureau data.
const REF_DATE = new Date("2026-07-13");

function ageInMonths(account) {
  const opened = new Date(account.opened);
  let months =
    (REF_DATE.getFullYear() - opened.getFullYear()) * 12 +
    (REF_DATE.getMonth() - opened.getMonth());
  if (REF_DATE.getDate() < opened.getDate()) months -= 1;
  return Math.max(months, 0);
}

function formatAge(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}M`;
  if (m === 0) return `${y}Y`;
  return `${y}Y ${m}M`;
}

// Oldest active account drives the headline age.
const OLDEST_MONTHS = Math.max(
  ...[...CARDS, ...LOANS].map((a) => ageInMonths(a)),
);

// The badge and breakdown sheet reuse the credit-history impact data.
const IMPACT = mock.impacts.find((i) => i.id === "credit-history");

// Account row: logo tile + bank on the left, account age + chevron on the
// right. Loans also show their product type (parsed off the row detail).
function AccountRow({ account, subtitle, last, onClick }) {
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
          <span className="text-[15px] leading-5 font-bold text-content-primary">
            {formatAge(ageInMonths(account))}
          </span>
          <span className="text-[12px] leading-4 text-content-secondary">
            Credit age
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

export default function CreditAge() {
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

        <div className="flex flex-col gap-1">
          <p className="text-[10px] leading-4 font-medium tracking-[1px] text-content-secondary uppercase">
            {COPY.ageLabel}
          </p>
          <div className="flex flex-col items-start gap-2">
            <p className="text-2xl leading-9 font-bold text-content-primary">
              {formatAge(OLDEST_MONTHS)}
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-background-postive px-3 py-1 text-[14px] leading-5 font-semibold text-content-inverse-primary">
              {IMPACT.rating}
              <button
                type="button"
                aria-label="How credit age is classified"
                onClick={() => setBreakdownOpen(true)}
                className="flex cursor-pointer items-center"
              >
                <IconInfoCircle size={16} stroke={2} />
              </button>
            </span>
          </div>
        </div>
      </section>

      {/* Active credit cards */}
      <section className="mt-8 flex flex-col gap-2 px-4 pb-6">
        <h2 className="text-sm leading-6 font-semibold text-content-secondary">
          Active credit cards
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
