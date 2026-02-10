import { NextResponse } from "next/server"

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
  const base = process.env.POCKETBASE_URL || ""
  return NextResponse.json({ url: base ? base.replace(/\/$/, "") : "" })
}
