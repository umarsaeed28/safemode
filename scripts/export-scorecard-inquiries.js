#!/usr/bin/env node
/**
 * Daily export of scorecard_inquiries from PocketBase → queries.txt
 *
 * Fetches ALL scorecard_inquiries records and writes a human-readable
 * summary to queries.txt at the project root.
 *
 * Usage (one-off):
 *   node scripts/export-scorecard-inquiries.js
 *
 * Usage (daily cron – add to crontab):
 *   0 8 * * * cd /path/to/producthero && node scripts/export-scorecard-inquiries.js >> /tmp/scorecard-export.log 2>&1
 *
 * Usage (long-running listener mode – runs forever, exports once per day):
 *   node scripts/export-scorecard-inquiries.js --listen
 *
 * Environment:
 *   POCKETBASE_URL (default http://127.0.0.1:8090)
 *   POCKETBASE_ADMIN_EMAIL
 *   POCKETBASE_ADMIN_PASSWORD
 */

const fs = require("fs")
const path = require("path")

const POCKETBASE_URL = (process.env.POCKETBASE_URL || "http://127.0.0.1:8090").replace(/\/$/, "")
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD
const OUTPUT_FILE = path.resolve(__dirname, "..", "queries.txt")

const LISTEN_MODE = process.argv.includes("--listen")
const INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 hours

async function getAdminToken() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD env vars")
  }
  const res = await fetch(`${POCKETBASE_URL}/api/collections/_superusers/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Auth failed (${res.status}): ${err.message || res.statusText}`)
  }
  const data = await res.json()
  return data.token ?? data.data?.token
}

async function fetchAllInquiries(token) {
  let allItems = []
  let page = 1
  const perPage = 200
  while (true) {
    const q = new URLSearchParams({ page: String(page), perPage: String(perPage), sort: "-created" })
    const res = await fetch(`${POCKETBASE_URL}/api/collections/scorecard_inquiries/records?${q}`, {
      headers: { Authorization: token },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Fetch failed (${res.status}): ${err.message || res.statusText}`)
    }
    const data = await res.json()
    const items = data.items || []
    allItems = allItems.concat(items)
    if (items.length < perPage) break
    page++
  }
  return allItems
}

function formatRecord(r, idx) {
  const tierLabel = {
    guessing: "Guessing",
    partial_clarity: "Partial Clarity",
    defensible_bet: "Defensible Bet",
  }
  const answersStr = Array.isArray(r.answers) ? r.answers.map((a, i) => `Q${i + 1}:${a}`).join(", ") : "(none)"
  return [
    `--- Record #${idx + 1} (${r.id}) ---`,
    `  Full Name    : ${r.full_name}`,
    `  Company      : ${r.company_name}`,
    `  Email        : ${r.email}`,
    `  Score        : ${r.score_total}/50`,
    `  Tier         : ${tierLabel[r.tier] || r.tier}`,
    `  Answers      : ${answersStr}`,
    `  Page URL     : ${r.page_url || "(none)"}`,
    `  Submitted    : ${r.created || "(unknown)"}`,
  ].join("\n")
}

async function exportOnce() {
  const now = new Date().toISOString()
  console.log(`[${now}] Starting scorecard inquiries export...`)

  const token = await getAdminToken()
  const items = await fetchAllInquiries(token)

  const header = [
    "=".repeat(60),
    "  SCORECARD INQUIRIES EXPORT",
    `  Generated: ${now}`,
    `  Total records: ${items.length}`,
    "=".repeat(60),
    "",
  ].join("\n")

  const body = items.length > 0
    ? items.map((r, i) => formatRecord(r, i)).join("\n\n")
    : "(No scorecard inquiries found)"

  const content = header + body + "\n"

  fs.writeFileSync(OUTPUT_FILE, content, "utf-8")
  console.log(`[${now}] Exported ${items.length} record(s) to ${OUTPUT_FILE}`)
}

async function main() {
  if (LISTEN_MODE) {
    console.log("Running in listener mode. Will export every 24 hours. Press Ctrl+C to stop.")
    // Run immediately on start
    try { await exportOnce() } catch (e) { console.error("Export error:", e.message) }
    // Then schedule every 24h
    setInterval(async () => {
      try { await exportOnce() } catch (e) { console.error("Export error:", e.message) }
    }, INTERVAL_MS)
  } else {
    await exportOnce()
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message || err)
  process.exit(1)
})

