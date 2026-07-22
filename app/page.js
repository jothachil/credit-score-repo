"use client";

import {
  IconArrowLeft,
  IconBox,
  IconFileText,
  IconShieldCheck,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./components/Button";
import Checkbox from "./components/Checkbox";

// Labels are split into two lines so every column is the same height.
const FEATURES = [
  { id: "insights", icon: IconFileText, lines: ["Detailed", "insights"] },
  { id: "secured", icon: IconShieldCheck, lines: ["100%", "secured"] },
  { id: "no-effect", icon: IconBox, lines: ["No effect", "on score"] },
];

export default function Onboarding() {
  const router = useRouter();
  const [consented, setConsented] = useState(true);

  return (
    <div className="flex flex-1 flex-col bg-background-primary bg-gradient-to-b from-background-postive/30 to-background-primary to-45%">
      {/* App bar */}
      <header className="flex items-center px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="-m-2 inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-content-primary outline-none transition-colors hover:bg-background-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-selected"
        >
          <IconArrowLeft size={24} stroke={2} />
        </button>
      </header>

      {/* Illustration */}
      <div className="flex items-center justify-center">
        {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
        <img
          src="/onboarding-8.png"
          alt="Credit score meter"
          className="h-auto w-full max-w-[360px] object-contain"
        />
      </div>

      {/* Heading */}
      <div className="mt-10 flex flex-col items-center gap-2 px-6 text-center">
        <h1 className="text-2xl leading-9 font-bold tracking-tight text-content-primary">
          Check your CIBIL Score
        </h1>
        <p className="text-sm text-content-secondary">
          Get detailed insights on your credit report
        </p>
      </div>

      {/* Feature highlights */}
      <div className="p-7">
        <div className="grid grid-cols-3 divide-x divide-border-primary rounded-2xl bg-background-secondary py-5">
          {FEATURES.map(({ id, icon: Icon, lines }) => (
            <div
              key={id}
              className="flex flex-col items-center gap-2 px-3 text-center"
            >
              <Icon size={26} stroke={2} className="text-content-primary" />
              <span className="text-[14px] leading-5 font-semibold text-content-primary">
                {lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Consent + CTA — pinned to the bottom of the screen */}
      <div className="sticky bottom-0 mt-auto flex flex-col gap-3 border-t border-border-primary bg-background-primary px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {/* Bureau consent — unchecking disables the CTA */}
        <label
          htmlFor="bureau-consent"
          className="flex cursor-pointer items-start gap-3"
        >
          <Checkbox
            id="bureau-consent"
            checked={consented}
            onCheckedChange={setConsented}
            className="mt-0.5"
          />
          <span className="text-[13px] leading-5 text-content-secondary">
            I agree to the{" "}
            <button
              type="button"
              className="cursor-pointer font-bold text-content-brand"
            >
              Terms and Conditions
            </button>{" "}
            of{" "}
            <button
              type="button"
              className="cursor-pointer font-bold text-content-brand"
            >
              TUCIBIL
            </button>{" "}
            and hereby provide explicit consent to share my Credit Information
            with PayU Finance India Private Limited.
          </span>
        </label>
        <Button
          variant="primary"
          disabled={!consented}
          onClick={() => router.push("/fetching")}
          className="flex items-center justify-center gap-2"
        >
          Check score now
          {/* Price strike — was paid, now free */}
          <span className="opacity-60 line-through">₹49</span>
          <span>FREE</span>
        </Button>
      </div>
    </div>
  );
}
