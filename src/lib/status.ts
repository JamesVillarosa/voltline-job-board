// Shared by server and client code, so no DB imports here.
export const STATUSES = ["Scheduled", "In Progress", "On Hold", "Completed", "Cancelled"] as const;
export type Status = (typeof STATUSES)[number];
export const isStatus = (s: unknown): s is Status => STATUSES.includes(s as Status);

// text: label colour. dot: marker in chips, the split bar and the timeline. Glyphs live in components.tsx.
export const STATUS_STYLE: Record<Status, { text: string; dot: string }> = {
  Scheduled: { text: "text-violet-700", dot: "bg-violet-500" },
  "In Progress": { text: "text-brand-deep", dot: "bg-brand" },
  "On Hold": { text: "text-amber-700", dot: "bg-amber-500" },
  Completed: { text: "text-emerald-700", dot: "bg-emerald-500" },
  Cancelled: { text: "text-slate-500", dot: "bg-slate-400" },
};

// Who can sign a note. shortcut: fixed list, no login; swap for real accounts when the app gets sign-in.
export const TEAM = ["Office", "Ava", "Kai", "Noah", "Zoe"] as const;
