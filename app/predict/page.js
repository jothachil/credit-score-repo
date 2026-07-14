"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import NavBar from "../components/NavBar";
import { mock } from "../data/mock";

// Tone → the choice card's bottom glow, using the light semantic tokens so
// the cards stay on-brand in light mode.
const CHOICE_TONE = {
  negative: { glow: "from-background-light-negative" },
  positive: { glow: "from-background-light-postive" },
  warning: { glow: "from-background-light-warning" },
  brand: { glow: "from-background-light-brand" },
};

function ChoiceCard({ choice, active, onClick }) {
  const tone = CHOICE_TONE[choice.tone] ?? CHOICE_TONE.brand;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex aspect-square cursor-pointer flex-col items-center justify-between overflow-hidden rounded-2xl border bg-background-primary p-4 pt-5 text-center transition-all duration-300 ${
        active
          ? "border-border-selected ring-1 ring-border-selected"
          : "border-border-primary"
      }`}
    >
      {/* Ambient glow behind the icon — tinted to the choice's tone */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent ${tone.glow}`}
      />
      <span className="relative text-[15px] leading-5 font-semibold text-content-primary">
        {choice.label}
      </span>
      {/* Illustration named after the choice id in /public */}
      {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
      <img
        src={`/${choice.id}.png`}
        alt=""
        className="relative w-32 object-contain"
      />
    </button>
  );
}

export default function PredictScore() {
  const router = useRouter();
  const [activeId, setActiveId] = useState(null);

  // Choices with a built detail screen navigate there; the rest just toggle
  // their selected state for now.
  function choose(choice) {
    if (choice.id === "miss-payment") {
      router.push("/predict/miss-payment");
      return;
    }
    setActiveId(activeId === choice.id ? null : choice.id);
  }

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar backHref="/score" border={false} />
      <div className="flex flex-col items-center gap-3 text-center bg-white py-4 pb-8">
        {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
        <img src="/magic-glass-1.png" alt="" className="w-40 object-contain" />
        <h1 className="px-8 text-xl leading-7 font-bold text-content-primary">
          {mock.predictor.heading}
        </h1>
      </div>

      {/* Choice grid */}
      <section className="flex flex-col gap-4 p-4 pb-8 ">
        {/* Header — predict-score illustration + heading */}

        <div className="grid grid-cols-2 gap-3">
          {mock.predictor.choices.map((choice) => (
            <ChoiceCard
              key={choice.id}
              choice={choice}
              active={activeId === choice.id}
              onClick={() => choose(choice)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
