"use client";

import { IconBell } from "@tabler/icons-react";
import Button from "../../components/Button";
import { toast } from "../../components/Toast";
import SectionShell from "../SectionShell";

export default function ToastSection() {
  return (
    <SectionShell title="Toast" description="Snackbar-style notifications">
      <div className="flex flex-col gap-3">
        <Button onClick={() => toast.add({ title: "Single-line snackbar" })}>
          Single-line
        </Button>

        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              title: "Single-line snackbar",
              data: { action: { label: "Action" } },
            })
          }
        >
          With action
        </Button>

        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              title: "Single-line snackbar",
              data: { icon: IconBell, action: { label: "Action" } },
            })
          }
        >
          With icon + action
        </Button>

        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              title:
                "This is a multi-line snackbar. It means more than one line, basically.",
            })
          }
        >
          Multi-line
        </Button>

        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              title:
                "This is a multi-line snackbar. It means more than one line, basically.",
              data: { action: { label: "Action" }, block: true },
            })
          }
        >
          Multi-line with block button
        </Button>
      </div>
    </SectionShell>
  );
}
