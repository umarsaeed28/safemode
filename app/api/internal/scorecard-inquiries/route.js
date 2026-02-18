import { NextResponse } from "next/server"
import { listScorecardInquiries } from "../../../../lib/pocketbase"

function checkAuth(request) {
  const password = process.env.INTERNAL_DASH_PASSWORD
  if (!password) return false
  const cookie = request.cookies.get("internal_dash")
  return cookie?.value === password
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const perPage = Math.min(parseInt(searchParams.get("perPage") || "50", 10), 200)
    const email = searchParams.get("email")?.trim()
    const filter = email ? `email ~ "${email.replace(/"/g, '\\"')}"` : ""
    const { items, total } = await listScorecardInquiries({ page, perPage, filter })
    return NextResponse.json({ items, total })
  } catch (err) {
    console.error("Internal scorecard inquiries error:", err)
    return NextResponse.json({ error: "Failed to load scorecard inquiries" }, { status: 500 })
  }
}

