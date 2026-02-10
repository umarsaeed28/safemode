import { NextResponse } from "next/server"
import { getStats } from "../../../../lib/pocketbase"

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
    const stats = await getStats()
    return NextResponse.json(stats)
  } catch (err) {
    console.error("Internal stats error:", err)
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 })
  }
}
