import { RadioCard, RadioGroup } from "../../components/RadioField";
import SectionShell from "../SectionShell";

export default function RadioSection() {
  return (
    <SectionShell title="Radio" description="Card-style radio group">
      <div className="flex flex-col gap-8">
        <RadioGroup defaultValue="monthly">
          <RadioCard value="monthly">Monthly</RadioCard>
          <RadioCard value="yearly">Yearly</RadioCard>
          <RadioCard value="lifetime" disabled>
            Lifetime
          </RadioCard>
        </RadioGroup>

        {/* Compact — no dot, centred label; for short values sitting 3-up */}
        <RadioGroup defaultValue="30">
          <RadioCard value="30" compact>
            30 days
          </RadioCard>
          <RadioCard value="60" compact>
            60 days
          </RadioCard>
          <RadioCard value="90" compact>
            90 days
          </RadioCard>
        </RadioGroup>
      </div>
    </SectionShell>
  );
}
