"use client";

import { useState } from "react";
import Button from "./components/Button";
import OTPField from "./components/OTPField";
import { RadioCard, RadioGroup } from "./components/RadioField";
import { Tabs, TabsList, TabsPanel, TabsTab } from "./components/TabsField";
import TextField from "./components/TextField";

const typeSamples = [
  { className: "text-display-1 font-black", label: "display-1 / 64" },
  { className: "text-3xl font-bold", label: "3xl / 48" },
  { className: "text-2xl font-bold", label: "2xl / 32" },
  { className: "text-xl font-semibold", label: "xl / 24" },
  { className: "text-lg font-medium", label: "lg / 18" },
  { className: "text-sm", label: "sm / 16" },
  { className: "text-xs text-content-secondary", label: "xs / 14" },
  { className: "text-xss text-content-tertiary", label: "xss / 12" },
];

const swatches = [
  { name: "content/primary", className: "bg-content-primary" },
  { name: "content/secondary", className: "bg-content-secondary" },
  { name: "content/tertiary", className: "bg-content-tertiary" },
  { name: "content/brand", className: "bg-content-brand" },
  { name: "content/negative", className: "bg-content-negative" },
  { name: "background/primary", className: "bg-background-primary" },
  { name: "background/secondary", className: "bg-background-secondary" },
  { name: "background/brand", className: "bg-background-brand" },
  { name: "background/postive", className: "bg-background-postive" },
  { name: "background/warning", className: "bg-background-warning" },
  { name: "border/primary", className: "bg-border-primary" },
  { name: "border/selected", className: "bg-border-selected" },
];

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [plan, setPlan] = useState("monthly");

  const emailError =
    email.length > 0 && !email.includes("@") ? "Enter a valid email" : "";
  const otpStatus = otp.length === 6 ? "verified" : null;

  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-8">
      <header className="flex flex-col gap-1">
        <p className="text-xss font-semibold uppercase tracking-wide text-content-brand">
          Prototype starter
        </p>
        <h1 className="text-2xl font-bold">Lufga + Tailwind v4</h1>
        <p className="text-xs text-content-secondary">
          Fonts, colors, and the debug panel are wired up. Edit{" "}
          <code className="font-mono text-content-primary">app/page.js</code> to
          begin.
        </p>
      </header>

      {/* Typography scale */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xss font-semibold uppercase tracking-wide text-content-tertiary">
          Type scale
        </h2>
        <div className="flex flex-col gap-2">
          {typeSamples.map((s) => (
            <div
              key={s.label}
              className="flex items-baseline justify-between gap-4"
            >
              <span className={`${s.className} truncate`}>Ag</span>
              <span className="shrink-0 font-mono text-xss text-content-tertiary">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xss font-semibold uppercase tracking-wide text-content-tertiary">
          Colors
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {swatches.map((c) => (
            <div key={c.name} className="flex flex-col gap-1">
              <div
                className={`${c.className} h-12 w-full rounded-xl border border-border-primary`}
              />
              <span className="font-mono text-xss text-content-secondary">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Inputs */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xss font-semibold uppercase tracking-wide text-content-tertiary">
          Inputs
        </h2>
        <TextField label="Full name" value={name} onChange={setName} />
        <TextField
          label="Email"
          value={email}
          onChange={setEmail}
          error={emailError}
          inputMode="email"
        />
        <OTPField
          value={otp}
          onChange={setOtp}
          status={otpStatus}
          className="pt-1"
        />
      </section>

      {/* Tabs */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xss font-semibold uppercase tracking-wide text-content-tertiary">
          Tabs
        </h2>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTab value="overview">Overview</TabsTab>
            <TabsTab value="activity">Activity</TabsTab>
            <TabsTab value="account">Account</TabsTab>
          </TabsList>
          <TabsPanel
            value="overview"
            className="text-xs text-content-secondary"
          >
            Overview content
          </TabsPanel>
          <TabsPanel
            value="activity"
            className="text-xs text-content-secondary"
          >
            Activity content
          </TabsPanel>
          <TabsPanel value="account" className="text-xs text-content-secondary">
            Account content
          </TabsPanel>
        </Tabs>
      </section>

      {/* Radio */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xss font-semibold uppercase tracking-wide text-content-tertiary">
          Radio
        </h2>
        <RadioGroup value={plan} onValueChange={setPlan}>
          <RadioCard value="monthly">Monthly</RadioCard>
          <RadioCard value="yearly">Yearly</RadioCard>
          <RadioCard value="lifetime" disabled>
            Lifetime
          </RadioCard>
        </RadioGroup>
      </section>

      {/* Buttons */}
      <section className="mt-auto flex flex-col gap-3">
        <h2 className="text-xss font-semibold uppercase tracking-wide text-content-tertiary">
          Button
        </h2>
        <Button>Primary action</Button>
        <Button disabled>Primary disabled</Button>
        <Button variant="secondary">Secondary action</Button>
        <Button variant="secondary" disabled>
          Secondary disabled
        </Button>
      </section>
    </div>
  );
}
