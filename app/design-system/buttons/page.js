import Button from "../../components/Button";
import SectionShell from "../SectionShell";

export default function ButtonsSection() {
  return (
    <SectionShell title="Buttons" description="Primary and secondary variants">
      <div className="flex flex-col gap-3">
        <Button>Primary action</Button>
        <Button disabled>Primary disabled</Button>
        <Button variant="secondary">Secondary action</Button>
        <Button variant="secondary" disabled>
          Secondary disabled
        </Button>
      </div>
    </SectionShell>
  );
}
