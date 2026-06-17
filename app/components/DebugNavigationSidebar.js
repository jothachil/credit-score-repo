"use client";

import { Switch } from "@base-ui/react/switch";
import { Tabs } from "@base-ui/react/tabs";
import { useAtom } from "jotai";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { debugFlags } from "../state/debugFlags";

// Register each screen of your prototype here so you can jump straight to it.
const debugPages = [
  {
    id: "onboarding",
    path: "/",
  },
  {
    id: "score",
    path: "/score",
  },
];

const tabClassName =
  "relative z-10 flex h-8 flex-1 cursor-pointer items-center justify-center rounded-lg px-2 text-[11px] leading-4 font-semibold text-zinc-500 outline-none transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-zinc-950 data-active:text-zinc-950";

const panelClassName =
  "mt-3 outline-none focus-visible:outline-2 focus-visible:outline-zinc-950 [[hidden]]:hidden";

function DebugFlagSwitch({ flag }) {
  const [checked, setChecked] = useAtom(flag.atom);

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2">
      <span className="truncate text-[11px] leading-4 font-semibold text-zinc-700">
        {flag.label}
      </span>
      <Switch.Root
        aria-label={flag.label}
        checked={checked}
        onCheckedChange={(nextChecked) => setChecked(nextChecked)}
        className="flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-zinc-300 bg-zinc-100 p-0.5 transition-colors duration-150 ease-[ease] data-checked:border-zinc-950 data-checked:bg-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
      >
        <Switch.Thumb className="size-3.5 rounded-full bg-white shadow-sm transition-[translate] duration-150 ease-[ease] data-checked:translate-x-4" />
      </Switch.Root>
    </div>
  );
}

export default function DebugNavigationSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("pages");

  const handleResetFlow = () => {
    setActiveTab("pages");
    router.push("/");
  };

  return (
    <>
      {!visible && (
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="fixed bottom-4 left-4 z-40 hidden cursor-pointer rounded-full border border-zinc-900/10 bg-zinc-950 px-4 py-3 text-[12px] font-bold tracking-wide text-white shadow-[0_12px_36px_rgba(0,0,0,0.24)] transition-transform hover:-translate-y-0.5 md:block"
        >
          Debug
        </button>
      )}

      {visible && (
        <aside className="fixed top-4 bottom-4 left-4 z-40 hidden w-[300px] flex-col rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-950 shadow-lg md:flex">
          <div className="-mx-3 flex items-center justify-between border-b border-zinc-100 px-3 pb-3">
            <div>
              <h2 className="mt-0.5 text-[13px] leading-4 font-bold">
                Debug panel
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="cursor-pointer rounded-lg border border-zinc-200 px-2 py-1 text-[11px] leading-4 font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
            >
              Hide
            </button>
          </div>

          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="min-h-0 flex-1"
          >
            <Tabs.List className="relative isolate mt-3 flex rounded-xl border border-zinc-200 bg-zinc-50 p-1">
              <Tabs.Tab className={tabClassName} value="pages">
                pages
              </Tabs.Tab>
              <Tabs.Tab className={tabClassName} value="flags">
                flags
              </Tabs.Tab>
              <Tabs.Indicator className="absolute top-1 left-0 z-0 h-8 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-lg border border-zinc-200 bg-white shadow-sm transition-[translate,width] duration-150 ease-in-out" />
            </Tabs.List>

            <Tabs.Panel value="pages" className={panelClassName}>
              <nav className="flex flex-col gap-1" aria-label="Debug pages">
                {debugPages.map(({ id, path }) => {
                  const active = pathname === path;

                  return (
                    <Link
                      key={path}
                      href={path}
                      aria-current={active ? "page" : undefined}
                      className={`grid grid-cols-[72px_1fr_52px] items-center gap-2 rounded-lg border px-2 py-2 text-[11px] leading-4 transition-colors ${
                        active
                          ? "border-zinc-950 bg-zinc-950 text-white"
                          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="font-semibold">{id}</span>
                      <span className="truncate font-mono">{path}</span>
                      <span
                        className={`text-right font-mono uppercase ${
                          active ? "text-white/70" : "text-zinc-400"
                        }`}
                      >
                        {active ? "live" : "idle"}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </Tabs.Panel>

            <Tabs.Panel value="flags" className={panelClassName}>
              <div className="flex flex-col gap-1">
                {debugFlags.map((flag) => (
                  <DebugFlagSwitch key={flag.id} flag={flag} />
                ))}
              </div>
            </Tabs.Panel>
          </Tabs.Root>

          <div className="-mx-3 mt-3 grid grid-cols-2 gap-2 border-t border-zinc-100 px-3 pt-3">
            <Link
              href="/design-system"
              aria-current={pathname === "/design-system" ? "page" : undefined}
              className={`rounded-lg border px-3 py-2 text-center text-[11px] leading-4 font-semibold transition-colors ${
                pathname === "/design-system"
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950"
              }`}
            >
              Design system
            </Link>
            <button
              type="button"
              onClick={handleResetFlow}
              className="cursor-pointer rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] leading-4 font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950"
            >
              Reset flow
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
