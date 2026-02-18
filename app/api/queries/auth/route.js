import { NextResponse } from "next/server"
import { createHash } from "crypto"

const COOKIE_NAME = "queries_auth"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const HARDCODED_PASSWORD = "admin"

/** Derive a safe cookie token from the password so it's not stored raw. */
function cookieToken() {
  return createHash("sha256").update(`queries_${HARDCODED_PASSWORD}_salt`).digest("hex").slice(0, 32)
}

export function verifyQueriesCookie(request) {
  const cookie = request.cookies.get(COOKIE_NAME)
  return cookie?.value === cookieToken()
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const submitted = typeof body.password === "string" ? body.password : ""
  if (submitted !== HARDCODED_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Invalid password." }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, cookieToken(), {
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
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" })
  return res
}

