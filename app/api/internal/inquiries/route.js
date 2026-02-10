import { NextResponse } from "next/server"
import { listInquiries, getInquiry } from "../../../../lib/pocketbase"

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
    const id = searchParams.get("id")
    if (id) {
      const record = await getInquiry(id)
      if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 })
      return NextResponse.json(record)
    }
    const page = parseInt(searchParams.get("page") || "1", 10)
    const perPage = Math.min(parseInt(searchParams.get("perPage") || "20", 10), 100)
    const email = searchParams.get("email")?.trim()
    const filter = email ? `email ~ "${email.replace(/"/g, '\\"')}"` : ""
    const { items, total } = await listInquiries({ page, perPage, filter })
    return NextResponse.json({ items, total })
  } catch (err) {
    console.error("Internal inquiries error:", err)
    return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 })
  }
}
