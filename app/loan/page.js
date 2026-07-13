"use client";

import {
  IconBuildingBank,
  IconCircle,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../components/TabsField";
import { mock } from "../data/mock";

const PAYMENT_MONTHS = mock.paymentMonths;
const LEGEND = mock.paymentLegend;
const PAYMENT_YEARS = mock.paymentYears;

// Active reads green; anything else (e.g. Closed) reads muted/neutral.
function statusBadgeClass(status) {
  return status === "Active"
    ? "bg-background-light-postive text-content-postive"
    : "bg-background-secondary text-content-secondary";
}

// Renders the status marker for a month / legend entry.
function StatusMarker({ status, size = 24 }) {
  if (status === "on-time") {
    return (
      <IconCircleCheckFilled size={size} className="text-content-postive" />
    );
  }
  if (status === "delayed") {
    return <IconCircleXFilled size={size} className="text-content-warning" />;
  }
  if (status === "overdue") {
    return <IconCircleXFilled size={size} className="text-content-negative" />;
  }
  // not-reported
  return (
    <IconCircle size={size} stroke={2} className="text-content-tertiary" />
  );
}

function LoanDetailContent() {
  const router = useRouter();
  const id = useSearchParams().get("id");
  const LOAN = mock.findAccount(id) ?? mock.loan;

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar backHref="/loans" border={false} transparent />

      <div className="flex flex-col gap-6 px-4 pt-2 pb-8">
        {/* Identity */}
        <div className="flex flex-col gap-3 px-1 py-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl leading-7 font-bold text-content-primary">
              {LOAN.name}
            </h1>
            <span
              className={`mt-0.5 shrink-0 rounded-full px-3 py-1 text-[12px] leading-4 font-semibold tracking-[0.5px] uppercase ${statusBadgeClass(LOAN.status)}`}
            >
              {LOAN.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <IconBuildingBank
              size={20}
              stroke={2}
              className="text-content-primary"
            />
            <span className="text-[14px] leading-5 font-semibold tracking-[0.5px] text-content-primary uppercase">
              {LOAN.bank}
            </span>
          </div>
        </div>

        {/* Summary — outstanding & repayment */}
        <div className="flex flex-col rounded-2xl border border-border-primary bg-background-primary">
          <div className="flex items-stretch">
            <div className="flex flex-1 flex-col gap-1 border-r border-border-primary p-4">
              <span className="text-[12px] leading-4 font-medium tracking-[1px] text-content-secondary uppercase">
                Outstanding
              </span>
              <span className="text-xl leading-8 font-bold text-content-primary">
                {LOAN.outstanding}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-end gap-1 p-4">
              <span className="text-[12px] leading-4 font-medium tracking-[1px] text-content-secondary uppercase">
                Loan amount
              </span>
              <span className="text-xl leading-8 font-bold text-content-primary">
                {LOAN.loanAmount}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border-primary p-4">
            <div className="relative h-6">
              <span
                className="absolute top-0 w-fit rounded-md border border-border-primary bg-background-primary px-2 py-0.5 text-[12px] leading-4 font-bold whitespace-nowrap text-content-primary"
                style={{
                  left: `${LOAN.paidPct}%`,
                  transform: `translateX(-${LOAN.paidPct}%)`,
                }}
              >
                {LOAN.paidPct}% paid
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-background-secondary">
              <div
                className="h-full rounded-full bg-background-postive"
                style={{ width: `${Math.max(LOAN.paidPct, 1)}%` }}
              />
            </div>
            <span className="text-[12px] leading-4 font-medium tracking-[0.5px] text-content-secondary uppercase">
              Principal paid {LOAN.principalPaid}
            </span>
          </div>
        </div>

        {/* Payment history */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm leading-6 font-semibold text-content-secondary">
            Payment history
          </h2>
          <div className="flex flex-col rounded-2xl border border-border-primary bg-background-primary">
            <Tabs defaultValue={String(LOAN.year)} className="flex flex-col">
              <TabsList>
                {PAYMENT_YEARS.map((year) => (
                  <TabsTab
                    key={year}
                    value={String(year)}
                    className="flex-1 text-center"
                  >
                    {year}
                  </TabsTab>
                ))}
              </TabsList>

              {PAYMENT_YEARS.map((year) => (
                <TabsPanel key={year} value={String(year)} className="p-4">
                  <div className="grid grid-cols-6 gap-y-5">
                    {PAYMENT_MONTHS.map(({ month, status }) => (
                      <div
                        key={month}
                        className="flex flex-col items-center gap-2"
                      >
                        <StatusMarker status={status} />
                        <span className="text-[12px] leading-4 font-medium tracking-[0.5px] text-content-secondary uppercase">
                          {month}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsPanel>
              ))}
            </Tabs>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border-primary p-4">
              {LEGEND.map(({ id, label }) => (
                <span key={id} className="flex items-center gap-1.5">
                  <StatusMarker status={id} size={12} />
                  <span className="text-[13px] leading-5 text-content-secondary">
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <p className="px-1 pt-1 text-[13px] leading-5 text-content-secondary">
          Last updated by {LOAN.updatedBy} on {LOAN.updatedOn} to CIBIL
        </p>
        <Button variant="secondary" onClick={() => router.push("/error-state")}>
          Report an error
        </Button>
      </div>
    </div>
  );
}

export default function LoanDetail() {
  return (
    <Suspense>
      <LoanDetailContent />
    </Suspense>
  );
}
