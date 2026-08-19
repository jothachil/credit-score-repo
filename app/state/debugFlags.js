import { atomWithStorage } from "jotai/utils";

// Define reusable debug toggles here. Each atom persists to localStorage so a
// flag survives reloads while you iterate on a flow.
export const debugFlagAtoms = {
  refreshAvailable: atomWithStorage("debug.refreshAvailable", false),
  // Last refresh was <15 days ago → the refresh sheet leads with a
  // "score won't change much yet" warning before the paid offer.
  recentRefresh: atomWithStorage("debug.recentRefresh", false),
  // Report was fetched <2 days ago → nothing can have changed yet, so the
  // refresh sheet hard-blocks with a "try again in a few days" note instead
  // of pitching the paid refresh. Takes precedence over recentRefresh.
  recentFetch: atomWithStorage("debug.recentFetch", false),
  // The predict API errors out → every scenario fails after its loading
  // snackbar, leaving the gauge untouched and offering a retry.
  predictFails: atomWithStorage("debug.predictFails", false),
};

// Surfaced as switches in the debug panel's "flags" tab.
export const debugFlags = [
  {
    id: "refresh_available",
    label: "Refresh available",
    atom: debugFlagAtoms.refreshAvailable,
  },
  {
    id: "recent_refresh",
    label: "Refreshed < 15 days ago",
    atom: debugFlagAtoms.recentRefresh,
  },
  {
    id: "recent_fetch",
    label: "Fetched < 2 days ago",
    atom: debugFlagAtoms.recentFetch,
  },
  {
    id: "predict_fails",
    label: "Predict API fails",
    atom: debugFlagAtoms.predictFails,
  },
];
