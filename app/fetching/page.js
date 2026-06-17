"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Each message shows for STEP_MS; after the last, we move on to the score.
const STEPS = [
  "Fetching your credit report",
  "Analysing your accounts",
  "Calculating your score",
];
const STEP_MS = 2200;

export default function Fetching() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStep(i), i * STEP_MS),
    );
    const done = setTimeout(
      () => router.replace("/score"),
      STEPS.length * STEP_MS,
    );
    return () => {
      for (const t of timers) clearTimeout(t);
      clearTimeout(done);
    };
  }, [router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center  bg-background-primary px-8 text-center">
      <DotLottieReact
        src="/Eligibility2.lottie"
        autoplay
        loop
        className="size-72"
      />

      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-lg leading-7 font-semibold text-content-primary"
          >
            {STEPS[step]}
          </motion.p>
        </AnimatePresence>
        <p className="mt-0.5 text-sm text-content-secondary">
          Hang tight, this won&apos;t take long
        </p>
      </div>
    </div>
  );
}
