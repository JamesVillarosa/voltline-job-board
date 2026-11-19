import { OVERDUE_ICON, STATUS_STYLE, type Status } from "@/lib/status";

// Icon + coloured label; an overdue Scheduled job shows one red "Overdue" state instead of two chips.
export function StatusBadge({ status, daysOverdue }: { status: Status; daysOverdue?: number | null }) {
  const late = daysOverdue != null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap ${late ? "text-red-700" : STATUS_STYLE[status].text}`}>
      <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
        <path d={late ? OVERDUE_ICON : STATUS_STYLE[status].icon} />
      </svg>
      {late ? `Overdue · ${daysOverdue} ${daysOverdue === 1 ? "day" : "days"}` : status}
    </span>
  );
}

// Fictional team: initials on a fixed tint per person, so the same tech reads the same everywhere.
const TINTS: Record<string, string> = { Ava: "bg-rose-100 text-rose-800", Kai: "bg-teal-100 text-teal-800", Noah: "bg-amber-100 text-amber-900", Zoe: "bg-violet-100 text-violet-800" };

export function Tech({ name, size = 28 }: { name: string | null; size?: number }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <span
        aria-hidden
        className={`grid shrink-0 place-items-center rounded-full font-bold ring-2 ring-white ${(name && TINTS[name]) || "bg-slate-100 text-slate-500"}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {name ? name[0] : "?"}
      </span>
      <span className="font-medium">{name ?? "Unassigned"}</span>
    </span>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg aria-hidden viewBox="0 0 32 32" className="size-9">
        <rect width="32" height="32" rx="9" className="fill-brand" />
        <path d="M18 5 9 18h6l-1.5 9L23 14h-6l1-9Z" fill="#fff" />
      </svg>
      <span className="font-display text-lg leading-none font-extrabold tracking-tight">
        Voltline<span className="block text-[0.62rem] font-semibold tracking-[0.2em] text-muted uppercase">Electrical</span>
      </span>
    </span>
  );
}
