import { NextResponse } from "next/server"

const COOKIE_NAME = "internal_dash"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(request) {
  const password = process.env.INTERNAL_DASH_PASSWORD
  if (!password) {
    return NextResponse.json({ ok: false, error: "Not configured." }, { status: 503 })
  }
  const body = await request.json().catch(() => ({}))
  const submitted = typeof body.password === "string" ? body.password : ""
  if (submitted !== password) {
    return NextResponse.json({ ok: false, error: "Invalid password." }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set("internal_dash", "", { maxAge: 0, path: "/" })
  return res
}
