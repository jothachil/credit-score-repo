"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoanRow from "../components/LoanRow";
import NavBar from "../components/NavBar";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../components/TabsField";
import { mock } from "../data/mock";

const ACTIVE_LOANS = mock.loans.active;
const CLOSED_LOANS = mock.loans.closed;

function LoanList({ loans, onSelect }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary py-1">
      {loans.map((loan, i) => (
        <LoanRow
          key={loan.id}
          {...loan}
          last={i === loans.length - 1}
          onClick={() => onSelect(loan)}
        />
      ))}
    </div>
  );
}

export default function Loans() {
  const router = useRouter();
  const [tab, setTab] = useState("active");

  // Open the matching detail page for the selected account, by id.
  const openDetail = (loan) => router.push(`/${loan.type}?id=${loan.id}`);

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar title="Loans & Credit lines" backHref="/score" border={false} />

      <Tabs value={tab} onValueChange={setTab} className="flex flex-1 flex-col">
        {/* Sticky beneath the NavBar (its 3.5rem height + the top safe-area inset) */}
        <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-10 bg-background-primary">
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
          <LoanList loans={ACTIVE_LOANS} onSelect={openDetail} />
        </TabsPanel>
        <TabsPanel value="closed" className="px-4">
          <LoanList loans={CLOSED_LOANS} onSelect={openDetail} />
        </TabsPanel>
      </Tabs>
    </div>
  );
}
