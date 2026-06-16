import SectionShell from "../SectionShell";

const groups = [
  {
    title: "content/*",
    swatches: [
      { name: "content/primary", className: "bg-content-primary" },
      { name: "content/secondary", className: "bg-content-secondary" },
      { name: "content/tertiary", className: "bg-content-tertiary" },
      { name: "content/inactive", className: "bg-content-inactive" },
      {
        name: "content/inverse-primary",
        className: "bg-content-inverse-primary",
      },
      { name: "content/brand", className: "bg-content-brand" },
      { name: "content/negative", className: "bg-content-negative" },
      { name: "content/warning", className: "bg-content-warning" },
      { name: "content/postive", className: "bg-content-postive" },
    ],
  },
  {
    title: "background/*",
    swatches: [
      { name: "background/primary", className: "bg-background-primary" },
      { name: "background/secondary", className: "bg-background-secondary" },
      {
        name: "background/inverse-primary",
        className: "bg-background-inverse-primary",
      },
      {
        name: "background/inverse-secondary",
        className: "bg-background-inverse-secondary",
      },
      { name: "background/brand", className: "bg-background-brand" },
      { name: "background/warning", className: "bg-background-warning" },
      { name: "background/postive", className: "bg-background-postive" },
      {
        name: "background/light/brand",
        className: "bg-background-light-brand",
      },
      {
        name: "background/light/negative",
        className: "bg-background-light-negative",
      },
      {
        name: "background/light/warning",
        className: "bg-background-light-warning",
      },
      {
        name: "background/light/postive",
        className: "bg-background-light-postive",
      },
      { name: "background/overlay", className: "bg-background-overlay" },
      {
        name: "background/pressed/primary-button",
        className: "bg-background-pressed-primary-button",
      },
      {
        name: "background/pressed/secondary-button",
        className: "bg-background-pressed-secondary-button",
      },
    ],
  },
  {
    title: "border/*",
    swatches: [
      { name: "border/primary", className: "bg-border-primary" },
      { name: "border/selected", className: "bg-border-selected" },
      { name: "border/brand", className: "bg-border-brand" },
      { name: "border/negative", className: "bg-border-negative" },
      { name: "border/warning", className: "bg-border-warning" },
      { name: "border/postive", className: "bg-border-postive" },
      { name: "border/inverse", className: "bg-border-inverse" },
    ],
  },
];

export default function ColorsSection() {
  return (
    <SectionShell title="Colors" description="Semantic color tokens">
      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <section key={group.title} className="flex flex-col gap-3">
            <h2 className="font-mono text-xss font-semibold uppercase tracking-wide text-content-tertiary">
              {group.title}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {group.swatches.map((c) => (
                <div key={c.name} className="flex min-w-0 flex-col gap-1">
                  <div
                    className={`${c.className} h-12 w-full rounded-xl border border-border-primary`}
                  />
                  <span className="truncate font-mono text-xss text-content-secondary">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SectionShell>
  );
}
