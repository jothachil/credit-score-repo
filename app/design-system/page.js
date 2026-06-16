import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { sections } from "./sections";

export default function DesignSystemIndex() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-1">
        <p className="text-xss font-semibold uppercase tracking-wide text-content-brand">
          Design system
        </p>
        <h1 className="text-2xl font-bold">Components & tokens</h1>
        <p className="text-xs text-content-secondary">
          A living reference of the starter's typography, colors, and
          components.
        </p>
      </header>

      <nav className="flex flex-col gap-2" aria-label="Design system sections">
        {sections.map((section) => (
          <Link
            key={section.slug}
            href={`/design-system/${section.slug}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-border-primary px-4 py-3 transition-colors hover:border-content-tertiary"
          >
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-content-primary">
                {section.title}
              </span>
              <span className="text-xs text-content-secondary">
                {section.description}
              </span>
            </span>
            <IconChevronRight
              size={18}
              className="shrink-0 text-content-tertiary"
            />
          </Link>
        ))}
      </nav>
    </div>
  );
}
