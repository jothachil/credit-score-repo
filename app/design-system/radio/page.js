import { RadioCard, RadioGroup } from "../../components/RadioField";
import SectionShell from "../SectionShell";

export default function RadioSection() {
  return (
    <SectionShell title="Radio" description="Card-style radio group">
      <RadioGroup defaultValue="monthly">
        <RadioCard value="monthly">Monthly</RadioCard>
        <RadioCard value="yearly">Yearly</RadioCard>
        <RadioCard value="lifetime" disabled>
          Lifetime
        </RadioCard>
      </RadioGroup>
    </SectionShell>
  );
}
