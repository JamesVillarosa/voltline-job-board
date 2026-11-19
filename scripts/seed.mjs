// Schema + 20 fictional sample jobs. Shared by the migrate script and the nightly demo reset.
// [customer, suburb, job type, status, value, tech, booked (days from today)].
// Dates line up with status: done jobs in the past, live jobs today, four Scheduled jobs left overdue on purpose.
const jobs = [
  ["Hannah Whitlock", "Elm Park", "Switchboard upgrade", "Scheduled", 2850, "Noah", -12],
  ["Copperleaf Bakehouse", "Millbrook", "Commercial fit-out", "In Progress", 18400, "Kai", -3],
  ["Sam & Lena Okafor", "Willow Bend", "EV charger install", "Completed", 1950, "Noah", -9],
  ["Gareth Pryce", "Fernhill", "Safety inspection", "Completed", 249, "Zoe", -6],
  ["Kingsmere Primary School", "Kingsmere", "LED lighting upgrade", "Scheduled", 7200, "Kai", -8],
  ["Isla Brennan", "Ashby Vale", "Ceiling fan install", "On Hold", 680, "Zoe", -5],
  ["Marcus Delaney", "Cedar Heights", "Split system install", "In Progress", 3400, "Ava", 0],
  ["Northgate Physio", "Northgate", "Emergency callout", "Completed", 420, "Ava", -2],
  ["Margaret Kell", "Brookside", "Smoke alarm compliance", "Scheduled", 365, "Zoe", -4],
  ["Larkspur Estate Winery", "Larkspur", "Sub-mains & shed wiring", "In Progress", 5650, "Kai", -1],
  ["Olivia Strand", "Oakridge", "Switchboard upgrade", "Scheduled", 3100, "Noah", -2],
  ["Ridgefield Aquatic Centre", "Ridgefield", "Commercial switchboard", "On Hold", 9800, "Kai", 6],
  ["Theo Marsh", "Harbour View", "Bathroom renovation wiring", "Completed", 2240, "Ava", -11],
  ["Priya Desai", "Northgate", "Power point install", "Scheduled", 310, "Zoe", 1],
  ["Jon & Ruth Abernathy", "Willow Bend", "Security lighting", "Cancelled", 890, "Noah", -7],
  ["Millbrook Fresh Market", "Millbrook", "Emergency callout", "In Progress", 1150, "Ava", 0],
  ["Declan Shaw", "Fernhill", "Underground locating", "Completed", 540, "Kai", -13],
  ["Ruby Calloway", "Elm Park", "Rangehood & cooktop install", "Scheduled", 760, "Zoe", 3],
  ["Ironbark Auto Repairs", "Ashby Vale", "3-phase power upgrade", "On Hold", 6300, "Noah", 9],
  ["Felix Navarro", "Cedar Heights", "Ducted heating service", "Scheduled", 495, "Ava", 5],
];
// ACMA's reserved fictitious mobile numbers, so a demo tap never rings a real person.
const PHONES = ["0491 570 006", "0491 570 156", "0491 570 157", "0491 570 158", "0491 570 159", "0491 570 110", "0491 570 313", "0491 570 737"];


// [job index, author, note, hours ago]: a few realistic notes so job pages aren't all empty.
const NOTES = [
  [1, "Kai", "Rough-in done for the oven circuits. Waiting on the shopfitter before we fit off the bench GPOs.", 20],
  [1, "Office", "Customer asked for an extra 3-phase outlet for the dough mixer. Quote sent.", 6],
  [5, "Zoe", "Customer wants to choose a different fan model. On hold until they confirm.", 50],
  [6, "Ava", "Indoor unit mounted, running the line set this afternoon.", 3],
  [9, "Kai", "Trench for the sub-main dug and inspected. Cable goes in tomorrow.", 26],
  [11, "Office", "Waiting on the council permit before the switchboard can be replaced.", 70],
  [18, "Noah", "Supply authority needs to upgrade the pit first. Booked them, no date yet.", 40],
  [0, "Office", "Customer didn't answer on the booked day. Left a voicemail to rebook.", 200],
];

// reset: drop and rebuild, so a public demo goes back to a clean board with dates relative to today.
export async function migrate(sql, { reset = false } = {}) {
  if (reset) await sql`drop table if exists job_events, jobs`;
  await sql`
    create table if not exists jobs (
      id serial primary key,
      job_number text not null unique,
      customer text not null,
      suburb text not null,
      job_type text not null,
      status text not null check (status in ('Scheduled','In Progress','On Hold','Completed','Cancelled')),
      value numeric(10,2) not null check (value >= 0),
      technician text,
      phone text,
      scheduled_for date,
      created_at timestamptz not null default now()
    )`;
  await sql`
    create table if not exists job_events (
      id serial primary key,
      job_id int not null references jobs(id) on delete cascade,
      kind text not null check (kind in ('note','status')),
      body text not null,
      author text,
      deleted_at timestamptz,
      created_at timestamptz not null default now()
    )`;
  // Columns added after the first deploy.
  await sql`alter table jobs add column if not exists phone text`;
  await sql`alter table job_events add column if not exists author text`;
  await sql`alter table job_events add column if not exists deleted_at timestamptz`;
  await sql`create index if not exists job_events_job_id_idx on job_events(job_id, created_at desc)`;

  const [{ count }] = await sql`select count(*)::int from jobs`;
  if (count === 0) {
    // Local business day, not UTC, so "today" matches what the team sees.
    const today = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" }));
    const DAY = 86400000;
    const rows = jobs.map(([customer, suburb, job_type, status, value, technician, days], i) => {
      const booked = +today + days * DAY;
      return {
        job_number: `VLT-${2041 + i}`,
        customer, suburb, job_type, status, value, technician,
        phone: PHONES[i % PHONES.length],
        scheduled_for: new Date(booked).toISOString().slice(0, 10),
        // Booked in a week ahead, or a few days ago for future work: never created after the booked day.
        created_at: new Date(Math.min(booked - 7 * DAY, Date.now() - 3 * DAY)),
      };
    });
    const inserted = await sql`insert into jobs ${sql(rows)} returning id, status, scheduled_for, created_at`;
    // History: created as Scheduled, then moved to its current status on the booked day (never in the future).
    const history = inserted.flatMap((j) => [
      { job_id: j.id, kind: "status", body: "Job created as Scheduled", author: "Office", created_at: j.created_at },
      ...(j.status === "Scheduled"
        ? []
        : [{ job_id: j.id, kind: "status", body: `Scheduled → ${j.status}`, author: "Office", created_at: new Date(Math.min(+j.scheduled_for, Date.now() - 3600000)) }]),
    ]);
    await sql`insert into job_events ${sql(history)}`;
    const notes = NOTES.map(([i, author, body, hours]) => ({ job_id: inserted[i].id, kind: "note", body, author, created_at: new Date(Date.now() - hours * 3600000) }));
    await sql`insert into job_events ${sql(notes)}`;
    return `Seeded ${rows.length} jobs`;
  }
  return `Schema ok, ${count} jobs present`;
}
