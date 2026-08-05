"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import NavBar from "../components/NavBar";
import TextField from "../components/TextField";

// PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

// TUCIBIL consent terms, opened from the consent checkbox.
const TERMS_URL =
  "https://assets.payufin.com/docs/cibil-consent-credit-report-feature-05082026.pdf";

export default function BasicDetails() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pan, setPan] = useState("");
  const [panTouched, setPanTouched] = useState(false);
  const [consented, setConsented] = useState(true);

  const panValid = PAN_RE.test(pan);
  // Complain once the field is complete or the user has left it — not on
  // every keystroke while they're still typing.
  const panError =
    pan && !panValid && (panTouched || pan.length === 10)
      ? "Enter a valid PAN, e.g. ABCDE1234F"
      : "";
  const canContinue =
    firstName.trim() && lastName.trim() && panValid && consented;

  return (
    <div className="flex flex-1 flex-col bg-background-primary">
      <NavBar backHref="/" border={false} />

      <div className="flex flex-col gap-6 px-4 pt-2">
        {/* Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl leading-8 font-bold text-content-primary">
            Basic details
          </h1>
          <p className="text-sm leading-6 text-content-secondary">
            Enter your name and PAN as per your PAN card to fetch your credit
            report.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <TextField
            label="First name"
            value={firstName}
            onChange={setFirstName}
            helper="As per PAN"
            autoComplete="given-name"
          />
          <TextField
            label="Last name"
            value={lastName}
            onChange={setLastName}
            helper="As per PAN"
            autoComplete="family-name"
          />
          <TextField
            label="PAN"
            value={pan}
            onChange={(v) => setPan(v.toUpperCase().slice(0, 10))}
            onBlur={() => setPanTouched(true)}
            error={panError}
            autoCapitalize="characters"
            autoComplete="off"
            maxLength={10}
          />
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
            {/* Inside the label — stop the click from toggling the checkbox */}
            <a
              href={TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-bold text-content-brand underline underline-offset-2"
            >
              Terms and Conditions
            </a>{" "}
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
          disabled={!canContinue}
          onClick={() => router.push("/fetching")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
