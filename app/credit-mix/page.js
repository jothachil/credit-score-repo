"use client";

import { IconChevronRight, IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImpactBreakdownSheet from "../components/ImpactBreakdownSheet";
import NavBar from "../components/NavBar";
import { mock } from "../data/mock";

const COPY = mock.creditMixDetail;

// Mix considers active accounts. Every tradeline in this report is unsecured
// (cards + consumer/personal loans); a `secured: true` flag on an account
// record would move it to the secured bucket.
const ALL = mock.loans.active;
const SECURED_PCT = Math.round(
  (ALL.filter((a) => a.secured).length / ALL.length) * 100,
);

// The badge and breakdown sheet reuse the credit-mix impact data. Unlike the
// other factors this one rates Poor, so the badge tone follows the rating.
const IMPACT = mock.impacts.find((i) => i.id === "credit-mix");
const RATING_BADGE = {
  Excellent: "bg-background-postive",
  "Very Good": "bg-background-postive",
  Good: "bg-background-warning",
  Fair: "bg-background-warning",
  Poor: "bg-background-negative",
};

// Account row: logo tile + bank + product on the left, secured/unsecured
// category + chevron on the right.
function AccountRow({ account, last, onClick }) {
  const Icon = account.icon;
  const product = account.detail.split("·")[1]?.trim();
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
          <span className="text-[14px] leading-5 text-content-secondary">
            {product}
          </span>
        </span>
      </span>
      <span className="flex items-center gap-1">
        <span className="text-[14px] leading-5 text-content-secondary">
          {account.secured ? "Secured" : "Unsecured"}
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

export default function CreditMix() {
  const router = useRouter();
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const openAccount = (account) =>
    router.push(`/${account.type}?id=${account.id}`);

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
            {COPY.shareLabel}
          </p>
          <div className="flex flex-col items-start gap-2">
            <p className="text-2xl leading-9 font-bold text-content-primary">
              {SECURED_PCT}%
            </p>
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[14px] leading-5 font-semibold text-content-inverse-primary ${
                RATING_BADGE[IMPACT.rating] ?? "bg-background-postive"
              }`}
            >
              {IMPACT.rating}
              <button
                type="button"
                aria-label="How credit mix is classified"
                onClick={() => setBreakdownOpen(true)}
                className="flex cursor-pointer items-center"
              >
                <IconInfoCircle size={16} stroke={2} />
              </button>
            </span>
          </div>
        </div>
      </section>

      {/* All active accounts in one list, each labelled by category */}
      <section className="pt-4 flex flex-col px-4 pb-8">
        <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
          {ALL.map((account, i) => (
            <AccountRow
              key={account.id}
              account={account}
              last={i === ALL.length - 1}
              onClick={() => openAccount(account)}
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
