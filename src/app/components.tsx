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

// Mark: a V whose right stroke is a lightning bolt. Ink arm lit from the top-left; the bolt runs cyan to brand
// blue with a soft glow and a top sheen, so it reads as charged rather than flat. Ids are fixed: one logo per page.
const MARK_ARM = "M2.5 4h10.6l6.3 17.2V36h-4.6Z";
const MARK_BOLT = "M37.5 4H26.4l-5 13.6h5.2L21 36l12.4-21.2h-5.1Z";

export function LogoMark({ className = "size-11" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="-3 -3 46 46" className={`shrink-0 ${className}`}>
      <defs>
        <linearGradient id="vl-arm" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#3a4566" />
          <stop offset="0.55" stopColor="#131a30" />
          <stop offset="1" stopColor="#070a14" />
        </linearGradient>
        <linearGradient id="vl-bolt" x1="1" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#7fd4ff" />
          <stop offset="0.45" stopColor="#3b5bff" />
          <stop offset="1" stopColor="#1a2fc4" />
        </linearGradient>
        <linearGradient id="vl-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="vl-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <path d={MARK_BOLT} fill="#3b5bff" opacity="0.45" filter="url(#vl-glow)" transform="translate(0.6 1.4)" />
      <path d={MARK_ARM} fill="url(#vl-arm)" />
      <path d={MARK_ARM} fill="url(#vl-sheen)" opacity="0.45" />
      <path d={MARK_BOLT} fill="url(#vl-bolt)" />
      <path d={MARK_BOLT} fill="url(#vl-sheen)" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-1.5">
      <LogoMark className="-ml-1 size-11" />
      <span className="flex flex-col">
        <span className="font-display text-[1.75rem] leading-[0.85] font-black uppercase [font-stretch:75%]">Voltline</span>
        <span className="mt-1 text-[0.56rem] leading-none font-bold tracking-[0.36em] text-muted uppercase">Electrical</span>
      </span>
    </span>
  );
}
