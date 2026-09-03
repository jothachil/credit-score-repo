import { IconChevronRight } from "@tabler/icons-react";

/**
 * A tappable loan / credit-line row: logo tile, name + detail + status, and a
 * chevron marking it as a way into the account's detail page.
 *
 *   <LoanRow icon={IconCreditCard} name="…" detail="…" status="Active"
 *            tone="positive" />
 *
 * `tone` colors the status line ("negative" → red, else green). `large` bumps
 * the name to 16px; `last` drops the bottom divider for the final row.
 */
export default function LoanRow({
  icon: Icon,
  name,
  detail,
  status,
  tone,
  large,
  last,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-background-secondary ${
        last ? "" : "border-b border-border-primary"
      }`}
    >
      <span className="flex min-w-0 items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border-primary bg-background-secondary text-content-primary">
          <Icon size={22} stroke={1.5} />
        </span>
        <span className="flex flex-col">
          <span
            className={`font-semibold text-content-primary ${
              large ? "text-sm leading-6" : "text-[14px] leading-5"
            }`}
          >
            {name}
          </span>
          <span className="text-[14px] leading-5 text-content-secondary">
            {detail}
          </span>
          <span
            className={`text-[12px] leading-4 font-semibold ${
              tone === "negative"
                ? "text-content-negative"
                : "text-content-postive"
            }`}
          >
            {status}
          </span>
        </span>
      </span>
      {/* Same circular chevron affordance as the score page's action rows
          (FAQ / View full report), so every row that opens a page reads the
          same way. */}
      <span className="flex shrink-0 items-center justify-center rounded-full bg-background-secondary p-1">
        <IconChevronRight
          size={20}
          stroke={2}
          className="text-content-primary"
        />
      </span>
    </button>
  );
}
