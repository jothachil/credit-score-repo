"use client";

import {
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { useState } from "react";
import NavBar from "../components/NavBar";
import { mock } from "../data/mock";

const COPY = mock.personalDetailsPage;

// Group id → icon. Presentation lives here, not in the mock.
const GROUP_ICONS = {
  email: IconMail,
  address: IconMapPin,
  phone: IconPhone,
};

// How many entries a group shows before it collapses the rest behind
// "View more". Groups at or under this length never collapse.
const COLLAPSED_COUNT = 2;

/**
 * One contact group — heading plus its timeline of entries.
 *
 * Long groups (the bureau holds four addresses for this borrower) open showing
 * only the two most recent, with the rest behind a "View more" row. Expanding
 * is deliberately one-way: the button disappears once it's been used rather
 * than turning into "View less", so the list never collapses back under
 * someone who is part-way through reading it.
 */
function DetailGroup({ id, plural, entries }) {
  const Icon = GROUP_ICONS[id];
  const [expanded, setExpanded] = useState(false);

  const hidden = expanded ? 0 : Math.max(entries.length - COLLAPSED_COUNT, 0);
  const visible = hidden > 0 ? entries.slice(0, COLLAPSED_COUNT) : entries;

  return (
    <section className="flex flex-col gap-2">
      {/* The icon moves up to the group heading — in the timeline the
          dot does the work the per-row icon used to. */}
      <h2 className="flex items-center gap-2 text-sm leading-6 font-semibold text-content-secondary">
        <Icon size={16} stroke={2} />
        {plural}
      </h2>

      <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
        {/* Newest at the top, so the rail reads backwards in time as you
            scroll — the current value first, then what it replaced. */}
        <ol className="flex flex-col p-4">
          {visible.map((entry, i) => {
            const isLatest = i === 0;
            // Against the *visible* list, so the rail ends at the last row on
            // screen instead of trailing into the collapsed remainder.
            const isLast = i === visible.length - 1;

            return (
              <li key={entry.id} className="flex gap-3">
                {/* Rail: a dot per entry, joined by a line that stretches
                    to whatever height the row's content needs. */}
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1.5 size-2.5 shrink-0 rounded-full ${
                      isLatest
                        ? "bg-background-brand"
                        : "border-2 border-border-primary bg-background-primary"
                    }`}
                  />
                  {!isLast && (
                    <span className="w-px flex-1 bg-border-primary" />
                  )}
                </div>

                <div
                  className={`flex min-w-0 flex-col gap-1 ${
                    isLast ? "" : "pb-5"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] leading-5 font-semibold text-content-primary">
                      {entry.value}
                    </span>
                    {isLatest && (
                      <span className="rounded-full bg-background-light-postive px-2 py-0.5 text-[11px] leading-4 font-semibold text-content-postive">
                        {COPY.latestBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs leading-4 text-content-secondary">
                    Reported by {COPY.reportedNote(entry)}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="w-full cursor-pointer border-t border-border-primary px-4 py-3 text-[14px] leading-5 font-bold text-content-brand"
          >
            {COPY.viewMoreLabel(hidden)}
          </button>
        )}
      </div>
    </section>
  );
}

/**
 * Every contact detail the bureau holds, grouped by kind. Lists are
 * newest-first, so the first entry in each group is the one the score page
 * shows and carries the "Latest" badge.
 */
export default function YourDetails() {
  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar title={COPY.title} backHref="/score" />

      <div className="flex flex-col gap-6 px-4 py-6">
        {/* Info card — the intro is context rather than content, so it reads
            as a tinted aside instead of body copy above the timelines. */}
        <div className="flex items-start gap-3 rounded-2xl border border-border-primary bg-background-primary p-4">
          <IconInfoCircle
            size={20}
            stroke={2}
            className="mt-0.5 shrink-0 text-content-brand"
          />
          <p className="text-[13px] leading-5 text-content-primary">
            {COPY.intro}
          </p>
        </div>

        {COPY.groups.map(({ id, plural, key }) => (
          <DetailGroup
            key={id}
            id={id}
            plural={plural}
            entries={mock.personalDetails[key]}
          />
        ))}

        <p className="text-xs leading-5 text-content-inactive">
          {COPY.footnote}
        </p>
      </div>
    </div>
  );
}
