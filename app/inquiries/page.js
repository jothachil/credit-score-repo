"use client";

import { IconBuildingBank, IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import ImpactBreakdownSheet from "../components/ImpactBreakdownSheet";
import NavBar from "../components/NavBar";
import { mock } from "../data/mock";

const COPY = mock.inquiriesDetail;

const RECENT = mock.inquiries.filter((i) => i.recent);
const OLDER = mock.inquiries.filter((i) => !i.recent);

// The badge and breakdown sheet reuse the recent-inquiries impact data.
const IMPACT = mock.impacts.find((i) => i.id === "recent-inquiries");

// Inquiry row: lender + date on the left, enquiry amount on the right.
// Inquiries have no detail screen, so rows are static (no chevron).
function InquiryRow({ inquiry, last }) {
  return (
    <div
      className={`flex w-full items-center justify-between gap-3 px-4 py-3 ${
        last ? "" : "border-b border-border-primary"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border-primary bg-background-secondary text-content-primary">
          <IconBuildingBank size={22} stroke={1.5} />
        </span>
        <span className="flex flex-col">
          <span className="text-[14px] leading-5 font-semibold text-content-primary">
            {inquiry.lender}
          </span>
          <span className="text-[14px] leading-5 text-content-secondary">
            {inquiry.date}
          </span>
        </span>
      </span>
      <span className="flex flex-col items-end">
        <span className="text-[15px] leading-5 font-bold text-content-primary">
          {inquiry.amount}
        </span>
        <span className="text-[12px] leading-4 text-content-secondary">
          Amount
        </span>
      </span>
    </div>
  );
}

function InquirySection({ title, items }) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-2 px-4 pb-6">
      <h2 className="text-sm leading-6 font-semibold text-content-secondary">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
        {items.map((inquiry, i) => (
          <InquiryRow
            key={inquiry.id}
            inquiry={inquiry}
            last={i === items.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

export default function RecentInquiries() {
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
            {COPY.countLabel}
          </p>
          <div className="flex flex-col items-start gap-2">
            <p className="text-2xl leading-9 font-bold text-content-primary">
              {RECENT.length}
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-background-postive px-3 py-1 text-[14px] leading-5 font-semibold text-content-inverse-primary">
              {IMPACT.rating}
              <button
                type="button"
                aria-label="How recent inquiries are classified"
                onClick={() => setBreakdownOpen(true)}
                className="flex cursor-pointer items-center"
              >
                <IconInfoCircle size={16} stroke={2} />
              </button>
            </span>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col pb-2">
        <InquirySection title={COPY.recentTitle} items={RECENT} />
        <InquirySection title={COPY.olderTitle} items={OLDER} />
      </div>

      <ImpactBreakdownSheet
        impact={breakdownOpen ? IMPACT : null}
        onOpenChange={setBreakdownOpen}
      />
    </div>
  );
}
