// Creates tables and seeds 20 sample jobs if the table is empty. Safe to run on every deploy.
// Usage: node --env-file-if-exists=.env.local scripts/migrate.mjs [--reset]
import postgres from "postgres";
import { migrate } from "./seed.mjs";

const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });
console.log(await migrate(sql, { reset: process.argv.includes("--reset") }));
await sql.end();
