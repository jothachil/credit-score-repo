"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Top navigation bar — back arrow + optional title.
 *
 *   <NavBar title="Short Title" backHref="/somewhere" />
 *
 * Pass `backHref` to navigate to a specific route, or omit it to go back in
 * history. Sticks to the top of the mobile frame. The bottom divider fades in
 * once the page starts scrolling; pass `border` to keep it visible at the top
 * too, or rely on the default scroll behaviour with `border={false}`. Set
 * `transparent` to remove the bar background, or `inverse` for a transparent
 * bar with white controls over a dark surface (e.g. the score hero). Omit
 * `title` for a back-only bar.
 */
export default function NavBar({
  title,
  backHref,
  border = true,
  transparent = false,
  inverse = false,
}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  // The app scrolls on the window (the mobile frame grows with content).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Static-border bars keep it always on; the rest fade it in on scroll
  // (except inverse bars, whose dark hero has no divider to reveal).
  const showBorder = border || (scrolled && !inverse);

  const backClassName = `-m-2 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
    inverse
      ? "text-content-inverse-primary hover:bg-white/10 focus-visible:outline-white"
      : "text-content-primary hover:bg-background-secondary focus-visible:outline-border-selected"
  }`;

  return (
    <header
      className={`sticky top-0 z-10 flex items-center gap-4 px-5 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 transition-colors duration-300 ${
        // Transparent bars turn solid once scrolling begins so content
        // doesn't show through the sticky bar; inverse stays transparent.
        inverse || (transparent && !scrolled) ? "" : "bg-background-primary"
      }`}
    >
      {/* Animated bottom divider — fades in when scrolling begins */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-primary transition-opacity duration-300 ${
          showBorder ? "opacity-100" : "opacity-0"
        }`}
      />
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
