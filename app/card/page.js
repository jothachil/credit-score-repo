"use client";

import {
  IconBuildingBank,
  IconCircle,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../components/TabsField";

// Mock card detail.
const CARD = {
  name: "HDFC Diners Club International",
  status: "Active",
  bank: "HDFC Bank",
  totalSpends: "₹5,070",
  creditLimit: "₹9,75,000",
  limitUsedPct: 1,
  limitUsedAmount: "₹5,070",
  year: 2026,
  updatedBy: "HDFC Bank",
  updatedOn: "17 Jun 2026",
};

// Payment history — one entry per month. `status` drives the marker.
const PAYMENT_MONTHS = [
  { month: "Jan", status: "on-time" },
  { month: "Feb", status: "on-time" },
  { month: "Mar", status: "on-time" },
  { month: "Apr", status: "on-time" },
  { month: "May", status: "on-time" },
  { month: "Jun", status: "on-time" },
  { month: "Jul", status: "not-reported" },
  { month: "Aug", status: "not-reported" },
  { month: "Sep", status: "not-reported" },
  { month: "Oct", status: "not-reported" },
  { month: "Nov", status: "not-reported" },
  { month: "Dec", status: "not-reported" },
];

const LEGEND = [
  { id: "on-time", label: "On time" },
  { id: "delayed", label: "Delayed" },
  { id: "overdue", label: "Overdue" },
  { id: "not-reported", label: "Not reported" },
];

const PAYMENT_YEARS = [2026, 2025, 2024];

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
    return (
      <IconCircle size={size} stroke={2} className="text-content-warning" />
    );
  }
  // not-reported
  return (
    <IconCircle size={size} stroke={2} className="text-content-tertiary" />
  );
}

export default function CardDetail() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar backHref="/score" border={false} transparent />

      <div className="flex flex-col gap-6 px-4 pt-2 pb-8">
        {/* Identity */}
        <div className="flex flex-col gap-3 px-1 py-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl leading-7 font-bold text-content-primary">
              {CARD.name}
            </h1>
            <span className="mt-0.5 shrink-0 rounded-full bg-background-light-postive px-3 py-1 text-[12px] leading-4 font-semibold tracking-[0.5px] text-content-postive uppercase">
              {CARD.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <IconBuildingBank
              size={20}
              stroke={2}
              className="text-content-primary"
            />
            <span className="text-[14px] leading-5 font-semibold tracking-[0.5px] text-content-primary uppercase">
              {CARD.bank}
            </span>
          </div>
        </div>

        {/* Summary — spends & utilization */}
        <div className="flex flex-col rounded-2xl border border-border-primary bg-background-primary">
          <div className="flex items-stretch">
            <div className="flex flex-1 flex-col gap-1 border-r border-border-primary p-4">
              <span className="text-[12px] leading-4 font-medium tracking-[1px] text-content-secondary uppercase">
                Total spends
              </span>
              <span className="text-xl leading-8 font-bold text-content-primary">
                {CARD.totalSpends}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-end gap-1 p-4">
              <span className="text-[12px] leading-4 font-medium tracking-[1px] text-content-secondary uppercase">
                Credit limit
              </span>
              <span className="text-xl leading-8 font-bold text-content-primary">
                {CARD.creditLimit}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border-primary p-4">
            <span
              className="w-fit rounded-md border border-border-primary px-2 py-0.5 text-[12px] leading-4 font-bold text-content-primary"
              style={{ marginLeft: `${CARD.limitUsedPct}%` }}
            >
              {CARD.limitUsedPct}%
            </span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-background-secondary">
              <div
                className="h-full rounded-full bg-background-postive"
                style={{ width: `${Math.max(CARD.limitUsedPct, 1)}%` }}
              />
            </div>
            <span className="text-[12px] leading-4 font-medium tracking-[0.5px] text-content-secondary uppercase">
              Limit used {CARD.limitUsedAmount}
            </span>
          </div>
        </div>

        {/* Payment history */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm leading-6 font-semibold text-content-secondary">
            Payment history
          </h2>
          <div className="flex flex-col rounded-2xl border border-border-primary bg-background-primary">
            <Tabs defaultValue={String(CARD.year)} className="flex flex-col">
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
          Last updated by {CARD.updatedBy} on {CARD.updatedOn} to CIBIL
        </p>
        <Button variant="secondary" onClick={() => router.push("/error-state")}>
          Report an error
        </Button>
      </div>
    </div>
  );
}
