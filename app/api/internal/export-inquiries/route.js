import { NextResponse } from "next/server"
import { getAllScorecardInquiries } from "../../../../lib/pocketbase"
import { writeFileSync } from "fs"
import { resolve } from "path"

function checkAuth(request) {
  const password = process.env.INTERNAL_DASH_PASSWORD
  if (!password) return false
  const cookie = request.cookies.get("internal_dash")
  return cookie?.value === password
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

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const now = new Date().toISOString()
    const items = await getAllScorecardInquiries()

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
    const outputPath = resolve(process.cwd(), "queries.txt")
    writeFileSync(outputPath, content, "utf-8")

    return NextResponse.json({ ok: true, total: items.length, path: outputPath })
  } catch (err) {
    console.error("Export scorecard inquiries error:", err)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

