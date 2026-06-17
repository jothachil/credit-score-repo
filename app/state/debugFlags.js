import { atomWithStorage } from "jotai/utils";

// Define reusable debug toggles here. Each atom persists to localStorage so a
// flag survives reloads while you iterate on a flow.
export const debugFlagAtoms = {
  refreshAvailable: atomWithStorage("debug.refreshAvailable", false),
};

// Surfaced as switches in the debug panel's "flags" tab.
export const debugFlags = [
  {
    id: "refresh_available",
    label: "Refresh available",
    atom: debugFlagAtoms.refreshAvailable,
  },
];
