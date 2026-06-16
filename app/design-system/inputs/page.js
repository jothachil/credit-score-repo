"use client";

import { useState } from "react";
import OTPField from "../../components/OTPField";
import TextField from "../../components/TextField";
import SectionShell from "../SectionShell";

export default function InputsSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const emailError =
    email.length > 0 && !email.includes("@") ? "Enter a valid email" : "";
  const otpStatus = otp.length === 6 ? "verified" : null;

  return (
    <SectionShell title="Inputs" description="Text field and OTP field">
      <div className="flex flex-col gap-3">
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
      </div>
    </SectionShell>
  );
}
