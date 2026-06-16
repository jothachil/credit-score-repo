import SectionShell from "../SectionShell";

const typeSamples = [
  { className: "text-display-1 font-black", label: "display-1 / 64" },
  { className: "text-3xl font-bold", label: "3xl / 48" },
  { className: "text-2xl font-bold", label: "2xl / 32" },
  { className: "text-xl font-semibold", label: "xl / 24" },
  { className: "text-lg font-medium", label: "lg / 18" },
  { className: "text-sm", label: "sm / 16" },
  { className: "text-xs text-content-secondary", label: "xs / 14" },
  { className: "text-xss text-content-tertiary", label: "xss / 12" },
];

export default function TypographySection() {
  return (
    <SectionShell title="Typography" description="Type scale and weights">
      <div className="flex flex-col gap-2">
        {typeSamples.map((s) => (
          <div
            key={s.label}
            className="flex items-baseline justify-between gap-4"
          >
            <span className={`${s.className} truncate`}>Ag</span>
            <span className="shrink-0 font-mono text-xss text-content-tertiary">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
