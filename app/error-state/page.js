"use client";

import { useRouter } from "next/navigation";
import Button from "../components/Button";

const ERROR_CODE = "12356_COL/ABC/102_1706003384";

export default function SomethingWentWrong() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col bg-background-primary">
      {/* Illustration + copy, centered in the available space */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
        <img
          src="/something-went-wrong.png"
          alt="A dizzy retro computer"
          className="size-[274px] object-contain"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-xl leading-8 font-bold text-content-primary">
            Something went wrong
          </h1>
          <p className="text-sm leading-6 text-content-secondary">
            Please try again or check back later. Maybe give your phone a nice
            slap? Hey, it works on the TV remote.
          </p>
        </div>
      </div>

      {/* Error code + CTA, pinned to the bottom */}
      <div className="flex flex-col items-center gap-4 border-t border-border-primary px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <p className="text-xss text-content-secondary">
          Error Code : {ERROR_CODE}
        </p>
        <Button variant="primary" onClick={() => router.back()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
