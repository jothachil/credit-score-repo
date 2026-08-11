"use client";

import { useState } from "react";
import AmountRuler, { formatAmount } from "../../components/AmountRuler";
import SectionShell from "../SectionShell";

export default function AmountRulerSection() {
  const [amount, setAmount] = useState(2_00_000);

  return (
    <SectionShell
      title="Amount ruler"
      description="Horizontal scroll range selector"
    >
      <div className="flex flex-col gap-4">
        <p className="text-center text-2xl leading-9 font-bold text-content-primary">
          {formatAmount(amount)}
        </p>
        <AmountRuler
          min={20_000}
          max={15_00_000}
          step={10_000}
          value={amount}
          onChange={setAmount}
          label="Credit limit"
        />
        <div className="flex items-center justify-between text-[11px] leading-4 text-content-tertiary">
          <span>{formatAmount(20_000)}</span>
          <span>{formatAmount(15_00_000)}</span>
        </div>
      </div>
    </SectionShell>
  );
}
