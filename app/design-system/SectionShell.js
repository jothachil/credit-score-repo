import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

// Shared chrome for a design-system detail page: back link + heading.
export default function SectionShell({ title, description, children }) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-1">
        <Link
          href="/design-system"
          className="mb-2 inline-flex items-center gap-1 text-xss font-semibold text-content-secondary transition-colors hover:text-content-primary"
        >
          <IconArrowLeft size={14} stroke={2.5} />
          Design system
        </Link>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-xs text-content-secondary">{description}</p>
        )}
      </header>
      {children}
    </div>
  );
}
