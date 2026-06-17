"use client";

import { IconCreditCard, IconHome } from "@tabler/icons-react";
import { useState } from "react";
import LoanRow from "../components/LoanRow";
import NavBar from "../components/NavBar";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../components/TabsField";

const ACTIVE_LOANS = [
  {
    id: "payu-1",
    icon: IconCreditCard,
    name: "PayU Finance Private Ltd",
    detail: "₹64,000 · Card EMI",
    status: "Active",
    tone: "positive",
  },
  {
    id: "payu-2",
    icon: IconCreditCard,
    name: "PayU Finance Private Ltd",
    detail: "₹64,000 · Card EMI",
    status: "Active",
    tone: "positive",
  },
];

const CLOSED_LOANS = [
  {
    id: "jun-statement",
    icon: IconHome,
    name: "Jun statement",
    detail: "₹64,000 · House Loan",
    status: "Closed",
    tone: "negative",
  },
];

function LoanList({ loans }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary py-1">
      {loans.map((loan, i) => (
        <LoanRow key={loan.id} {...loan} last={i === loans.length - 1} />
      ))}
    </div>
  );
}

export default function Loans() {
  const [tab, setTab] = useState("active");

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar title="Loans & Credit lines" backHref="/score" border={false} />

      <Tabs value={tab} onValueChange={setTab} className="flex flex-1 flex-col">
        {/* Sticky beneath the NavBar (top-14 = NavBar height) */}
        <div className="sticky top-14 z-10 bg-background-primary">
          <TabsList>
            <TabsTab value="active" className="flex-1 text-center">
              Active
            </TabsTab>
            <TabsTab value="closed" className="flex-1 text-center">
              Closed
            </TabsTab>
          </TabsList>
        </div>

        <TabsPanel value="active" className="px-4">
          <LoanList loans={ACTIVE_LOANS} />
        </TabsPanel>
        <TabsPanel value="closed" className="px-4">
          <LoanList loans={CLOSED_LOANS} />
        </TabsPanel>
      </Tabs>
    </div>
  );
}
