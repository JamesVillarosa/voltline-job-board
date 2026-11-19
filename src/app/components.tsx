import { STATUS_STYLE, type Status } from "@/lib/status";

// Icon + coloured label; an overdue Scheduled job shows one red "Overdue" state instead of two chips.
export function StatusBadge({ status, daysOverdue }: { status: Status; daysOverdue?: number | null }) {
  const late = daysOverdue != null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap ${late ? "text-red-700" : STATUS_STYLE[status].text}`}>
      <StatusGlyph status={late ? "Overdue" : status} />
      {late ? `Overdue · ${daysOverdue} ${daysOverdue === 1 ? "day" : "days"}` : status}
    </span>
  );
}

// One family of lifecycle glyphs: an open ring fills up as the job moves along, then closes solid.
// Overdue is the Scheduled ring with a live centre: same job, just late.
export function StatusGlyph({ status, className = "size-4" }: { status: Status | "Overdue"; className?: string }) {
  const solid = status === "Completed" || status === "Cancelled";
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={`shrink-0 ${className}`}>
      {solid ? (
        <>
          <circle cx="8" cy="8" r="7" fill="currentColor" />
          <path d={status === "Completed" ? "m5 8.3 2 2 4-4.3" : "m5.6 10.4 4.8-4.8"} fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          {status === "In Progress" && <path d="M8 4.3a3.7 3.7 0 0 1 0 7.4Z" fill="currentColor" />}
          {status === "On Hold" && <rect x="5.2" y="7.2" width="5.6" height="1.6" rx="0.8" fill="currentColor" />}
          {status === "Overdue" && <circle cx="8" cy="8" r="2.4" fill="currentColor" />}
        </>
      )}
    </svg>
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

// Mark: a voltage trace that dips into a V and spikes, ending on a live terminal. Wordmark in condensed Archivo.
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={`shrink-0 ${className}`}>
      <rect width="40" height="40" rx="10" className="fill-ink" />
      <path d="M6 15h6.5l6 14L26 9l3 6h2.5" fill="none" className="stroke-brand" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
      <path d="M6 15h6.5l6 14L26 9l3 6h2.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="33.5" cy="15" r="2.6" fill="#ffd23f" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-extrabold tracking-[-0.01em] uppercase [font-stretch:72%]">Voltline</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.28em] text-muted uppercase">
          <span aria-hidden className="h-px w-3 bg-brand" />
          Electrical
        </span>
      </span>
    </span>
  );
}
