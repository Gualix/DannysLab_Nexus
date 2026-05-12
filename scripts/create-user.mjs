#!/usr/bin/env node
/**
 * scripts/create-user.mjs
 *
 * Create a Supabase auth user (optionally with the `admin` role) using the
 * Service Role key. Reads env from .env.local (or .env) if present.
 *
 * Usage:
 *   node scripts/create-user.mjs --email user@example.com --password 'S3cret!' [--admin] [--name "Full Name"]
 *
 * Short flags also supported: -e, -p, -n, -a, -h
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// ---------- tiny .env loader (no extra deps) ----------
function loadEnvFile(file) {
  if (!existsSync(file)) return;
  const text = readFileSync(file, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnvFile(resolve(projectRoot, ".env.local"));
loadEnvFile(resolve(projectRoot, ".env"));

// ---------- args ----------
function printHelp() {
  console.log(`Usage: node scripts/create-user.mjs --email <email> --password <password> [--admin] [--name "Full Name"]

Options:
  -e, --email     Email for the new user           (required)
  -p, --password  Password for the new user        (required, min 6 chars)
  -n, --name      Full name (stored in profile)    (optional)
  -a, --admin     Grant the 'admin' role           (optional; default role is 'staff')
      --no-role   Do not assign any role           (optional)
  -h, --help      Show this help

Environment required (loaded from .env.local / .env or shell):
  SUPABASE_URL                 e.g. https://xxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY    Service-role key (NEVER commit / expose to client)
`);
}

function parseArgs(argv) {
  const out = { admin: false, role: "staff" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "-e": case "--email":    out.email = next(); break;
      case "-p": case "--password": out.password = next(); break;
      case "-n": case "--name":     out.name = next(); break;
      case "-a": case "--admin":    out.admin = true; out.role = "admin"; break;
      case "--no-role":             out.role = null; break;
      case "-h": case "--help":     out.help = true; break;
      default:
        console.error(`Unknown argument: ${a}`);
        out.help = true;
        out.exit = 1;
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
  process.exit(args.exit ?? 0);
}

const missing = [];
if (!args.email) missing.push("--email");
if (!args.password) missing.push("--password");
if (missing.length) {
  console.error(`Missing required argument(s): ${missing.join(", ")}\n`);
  printHelp();
  process.exit(1);
}
if (args.password.length < 6) {
  console.error("Password must be at least 6 characters.");
  process.exit(1);
}

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.\n" +
      "Set them in .env.local or export them in your shell.",
  );
  process.exit(1);
}

// ---------- run ----------
const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log(`Creating user ${args.email}${args.role ? ` with role '${args.role}'` : " (no role)"}…`);

const { data: created, error: createErr } = await admin.auth.admin.createUser({
  email: args.email,
  password: args.password,
  email_confirm: true,
  user_metadata: args.name ? { full_name: args.name } : undefined,
});

if (createErr) {
  console.error("Failed to create user:", createErr.message);
  process.exit(1);
}

const userId = created.user?.id;
if (!userId) {
  console.error("User created but no id returned.");
  process.exit(1);
}
console.log(`  ✓ auth user created: ${userId}`);

// Profile is auto-created by the on_auth_user_created trigger,
// but ensure the full_name is set if provided.
if (args.name) {
  const { error: profErr } = await admin
    .from("profiles")
    .update({ full_name: args.name })
    .eq("id", userId);
  if (profErr) {
    console.warn(`  ! could not update profile full_name: ${profErr.message}`);
  } else {
    console.log("  ✓ profile.full_name updated");
  }
}

if (args.role) {
  const { error: roleErr } = await admin
    .from("user_roles")
    .insert({ user_id: userId, role: args.role });
  if (roleErr) {
    console.error(`Failed to assign role '${args.role}': ${roleErr.message}`);
    process.exit(1);
  }
  console.log(`  ✓ role '${args.role}' assigned`);
}

console.log("Done.");
