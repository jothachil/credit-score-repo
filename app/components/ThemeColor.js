"use client";

import { useEffect } from "react";

/**
 * Sets the document <meta name="theme-color"> for the duration this is mounted,
 * restoring the previous value on unmount. Lets a screen tint the native status
 * bar to match its top edge (e.g. the dark hero on the score page) inside a
 * WebView, since per-route viewport metadata can't run in a client component.
 *
 *   <ThemeColor color="#000000" />
 */
export default function ThemeColor({ color }) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const previous = meta.getAttribute("content");
    meta.setAttribute("content", color);
    return () => {
      if (previous != null) meta.setAttribute("content", previous);
    };
  }, [color]);

  return null;
}
