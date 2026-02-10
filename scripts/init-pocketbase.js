/**
 * One-time script to create PocketBase collections: inquiries and scorecard_submissions.
 * Run with PocketBase started and admin user created.
 *
 * Usage:
 *   POCKETBASE_URL=http://127.0.0.1:8090 POCKETBASE_ADMIN_EMAIL=admin@example.com POCKETBASE_ADMIN_PASSWORD=secret node scripts/init-pocketbase.js
 */

const POCKETBASE_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090"
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD")
  process.exit(1)
}

const base = POCKETBASE_URL.replace(/\/$/, "")

async function auth() {
  // PocketBase 0.36+ uses _superusers auth collection (no longer /api/admins/*)
  const res = await fetch(`${base}/api/collections/_superusers/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Auth failed: ${res.status}`)
  }
  const data = await res.json()
  return data.token ?? data.data?.token
}

async function createCollection(token, body) {
  const res = await fetch(`${base}/api/collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const nested = err.data?.name?.message || err.data?.message
    const msg = err.message || nested || `Create collection failed: ${res.status}`
    if (res.status !== 400 || !nested) console.error("PocketBase response:", res.status, JSON.stringify(err, null, 2))
    throw new Error(nested || msg)
  }
  return res.json()
}

async function main() {
  const token = await auth()
  console.log("Authenticated.")

  const inquiriesSchema = {
    name: "inquiries",
    type: "base",
    schema: [
      { name: "email", type: "text", required: true },
      { name: "name", type: "text", required: false },
      { name: "company", type: "text", required: false },
      { name: "role", type: "text", required: false },
      { name: "message", type: "text", required: true },
      { name: "website", type: "text", required: false },
      { name: "source", type: "text", required: false },
      { name: "page_url", type: "text", required: false },
      { name: "utm_source", type: "text", required: false },
      { name: "utm_medium", type: "text", required: false },
      { name: "utm_campaign", type: "text", required: false },
      {
        name: "status",
        type: "select",
        required: true,
        options: {
          values: ["new", "triaged", "responded", "closed"],
          maxSelect: 1,
        },
      },
      { name: "notes", type: "text", required: false },
    ],
    indexes: [],
  }

  const scorecardSchema = {
    name: "scorecard_submissions",
    type: "base",
    schema: [
      { name: "email", type: "text", required: true },
      { name: "score_total", type: "number", required: true },
      {
        name: "tier",
        type: "select",
        required: true,
        options: {
          values: ["guessing", "partial_clarity", "defensible_bet"],
          maxSelect: 1,
        },
      },
      { name: "answers", type: "json", required: true },
      { name: "ip_hash", type: "text", required: false },
      { name: "user_agent", type: "text", required: false },
      { name: "source", type: "text", required: false },
      { name: "page_url", type: "text", required: false },
    ],
    indexes: [],
  }

  try {
    await createCollection(token, inquiriesSchema)
    console.log("Created collection: inquiries")
  } catch (e) {
    if (e.message?.includes("already exists") || e.message?.includes("name must be unique")) {
      console.log("Collection inquiries already exists.")
    } else throw e
  }

  try {
    await createCollection(token, scorecardSchema)
    console.log("Created collection: scorecard_submissions")
  } catch (e) {
    if (e.message?.includes("already exists") || e.message?.includes("name must be unique")) {
      console.log("Collection scorecard_submissions already exists.")
    } else throw e
  }

  // If you created inquiries before "website" was added: in PocketBase Admin (/_/) open
  // Collections → inquiries → add field "website" (Text, optional), then save.
  console.log("Done.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
