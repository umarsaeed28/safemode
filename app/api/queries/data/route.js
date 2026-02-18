import { NextResponse } from "next/server"
import { listScorecardInquiries } from "../../../../lib/pocketbase"
import { verifyQueriesCookie } from "../auth/route"

function checkAuth(request) {
  return verifyQueriesCookie(request)
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const perPage = Math.min(parseInt(searchParams.get("perPage") || "50", 10), 200)
    const search = searchParams.get("search")?.trim() || ""

    // Quick env check — surface the problem instead of returning empty results
    const pbUrl = process.env.POCKETBASE_URL || "http://127.0.0.1:8090"
    if (!process.env.POCKETBASE_ADMIN_EMAIL || !process.env.POCKETBASE_ADMIN_PASSWORD) {
      console.error("Queries data: POCKETBASE_ADMIN_EMAIL or POCKETBASE_ADMIN_PASSWORD not set")
      return NextResponse.json({ items: [], total: 0, page, perPage, warning: "PocketBase credentials not configured. Check Vercel Environment Variables." })
    }
    if (pbUrl.includes("127.0.0.1") || pbUrl.includes("localhost")) {
      console.warn("Queries data: POCKETBASE_URL is still set to localhost — will not work in production")
    }

    let filter = ""
    if (search) {
      const safe = search.replace(/"/g, '\\"')
      filter = `email ~ "${safe}" || full_name ~ "${safe}" || company_name ~ "${safe}"`
    }

    const { items, total } = await listScorecardInquiries({ page, perPage, filter })
    return NextResponse.json({ items, total, page, perPage })
  } catch (err) {
    console.error("Queries data error:", err)
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

