import { atomWithStorage } from "jotai/utils";

// Define reusable debug toggles here. Each atom persists to localStorage so a
// flag survives reloads while you iterate on a flow.
export const debugFlagAtoms = {
  exampleFlag: atomWithStorage("debug.exampleFlag", false),
};

// Surfaced as switches in the debug panel's "flags" tab.
export const debugFlags = [
  {
    id: "example_flag",
    label: "Example flag",
    atom: debugFlagAtoms.exampleFlag,
  },
];
