"use client";

import { useState } from "react";
import Checkbox from "../../components/Checkbox";
import SectionShell from "../SectionShell";

export default function CheckboxSection() {
  const [checked, setChecked] = useState(true);

  return (
    <SectionShell title="Checkbox" description="Box in a 24px touch target">
      <div className="flex flex-col gap-4">
        <Checkbox checked={checked} onCheckedChange={setChecked}>
          Toggle me
        </Checkbox>
        <Checkbox defaultChecked>Checked by default</Checkbox>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox disabled defaultChecked>
          Disabled checked
        </Checkbox>
        <Checkbox disabled>Disabled unchecked</Checkbox>

        <div className="flex items-center gap-3 pt-2">
          <Checkbox aria-label="Bare checked" defaultChecked />
          <Checkbox aria-label="Bare unchecked" />
          <Checkbox
            aria-label="Bare disabled checked"
            disabled
            defaultChecked
          />
          <Checkbox aria-label="Bare disabled" disabled />
        </div>
      </div>
    </SectionShell>
  );
}
