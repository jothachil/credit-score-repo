"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import TextField from "../components/TextField";

// PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function BasicDetails() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pan, setPan] = useState("");
  const [panTouched, setPanTouched] = useState(false);

  const panValid = PAN_RE.test(pan);
  // Complain once the field is complete or the user has left it — not on
  // every keystroke while they're still typing.
  const panError =
    pan && !panValid && (panTouched || pan.length === 10)
      ? "Enter a valid PAN, e.g. ABCDE1234F"
      : "";
  const canContinue = firstName.trim() && lastName.trim() && panValid;

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

      {/* CTA — pinned to the bottom of the screen */}
      <div className="sticky bottom-0 mt-auto flex flex-col border-t border-border-primary bg-background-primary px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
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
