import { sql } from "@/lib/db";
import { migrate } from "../../../../scripts/seed.mjs";

// Nightly demo reset (Vercel Cron, see vercel.json): visitors can edit everything, so put the board back
// to its clean sample state with dates relative to today. Vercel sends `Authorization: Bearer $CRON_SECRET`.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET?.trim(); // trim: a pasted dashboard value can carry a stray space or newline
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
  // One transaction: visitors never see a half-dropped schema.
  const result = await sql.begin((tx) => migrate(tx, { reset: true }));
  return Response.json({ ok: true, result });
}
