"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Top navigation bar — back arrow + optional title.
 *
 *   <NavBar title="Short Title" backHref="/somewhere" />
 *
 * Pass `backHref` to navigate to a specific route, or omit it to go back in
 * history. Sticks to the top of the mobile frame. Set `border={false}` to drop
 * the bottom divider (e.g. when the bar sits directly above tabs that already
 * carry one). Set `transparent` to remove the bar background, or `inverse` for
 * a transparent bar with white controls over a dark surface (e.g. the score
 * hero). Omit `title` for a back-only bar.
 */
export default function NavBar({
  title,
  backHref,
  border = true,
  transparent = false,
  inverse = false,
}) {
  const router = useRouter();

  const backClassName = `-m-2 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
    inverse
      ? "text-content-inverse-primary hover:bg-white/10 focus-visible:outline-white"
      : "text-content-primary hover:bg-background-secondary focus-visible:outline-border-selected"
  }`;

  return (
    <header
      className={`sticky top-0 z-10 flex items-center gap-4 px-5 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 ${
        inverse || transparent ? "" : "bg-background-primary"
      } ${border ? "border-b border-border-primary" : ""}`}
    >
      {backHref ? (
        <Link href={backHref} aria-label="Back" className={backClassName}>
          <IconArrowLeft size={24} stroke={2} />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className={backClassName}
        >
          <IconArrowLeft size={24} stroke={2} />
        </button>
      )}
      {title ? (
        <h1
          className={`text-[18px] leading-6 font-bold ${
            inverse ? "text-content-inverse-primary" : "text-content-primary"
          }`}
        >
          {title}
        </h1>
      ) : null}
    </header>
  );
}
