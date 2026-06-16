"use client";

import { useState } from "react";
import BottomSheet from "../../components/BottomSheet";
import Button from "../../components/Button";
import SectionShell from "../SectionShell";

export default function BottomSheetSection() {
  const [open, setOpen] = useState(false);

  return (
    <SectionShell title="Bottom sheet" description="Swipe-down drawer sheet">
      <div className="flex flex-col gap-3">
        {/* Controlled */}
        <Button onClick={() => setOpen(true)}>Open (controlled)</Button>
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          title="Sheet title"
          description="Drag the handle down or tap outside to dismiss."
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs text-content-secondary">
              Replace with any body content.
            </p>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </BottomSheet>

        {/* Trigger + hidden title (bare body, matches Figma) */}
        <BottomSheet
          trigger={<Button variant="secondary">Open (with trigger)</Button>}
          title="Options"
          titleHidden
        >
          <p className="py-8 text-center text-xs text-content-inactive">
            Replace with {"{Body Component}"}
          </p>
        </BottomSheet>
      </div>
    </SectionShell>
  );
}
