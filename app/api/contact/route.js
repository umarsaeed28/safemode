import { NextResponse } from "next/server"
import { createInquiry } from "../../../lib/pocketbase"

const DISALLOWED_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.uk", "yahoo.fr", "yahoo.de", "yahoo.es", "yahoo.it",
  "hotmail.com", "hotmail.co.uk", "hotmail.fr", "hotmail.es", "live.com", "live.co.uk",
  "outlook.com", "outlook.co.uk", "msn.com", "passport.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "aim.com",
  "mail.com", "email.com", "protonmail.com", "proton.me", "pm.me",
  "zoho.com", "yandex.com", "yandex.ru", "yandex.ua",
  "gmx.com", "gmx.net", "gmx.de", "inbox.com", "mail.ru", "rambler.ru",
  "fastmail.com", "tutanota.com", "hey.com", "disroot.org",
])

function isValidEmail(value) {
  if (!value || typeof value !== "string") return false
  const trimmed = value.trim()
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(trimmed)
}

function isCompanyEmail(email) {
  if (!email || typeof email !== "string") return false
  const domain = email.trim().split("@")[1]?.toLowerCase()
  return domain && !DISALLOWED_EMAIL_DOMAINS.has(domain)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""
    const service = typeof body.service === "string" ? body.service.trim() : ""
    const website = typeof body.website === "string" ? body.website.trim() : ""
    const pageUrl = typeof body.page_url === "string" ? body.page_url.trim() : ""

    if (!name) {
      return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 })
    }
    if (!isCompanyEmail(email)) {
      return NextResponse.json({
        ok: false,
        error: "Please use your company email address. Personal email addresses (e.g. Gmail, Yahoo, Outlook) are not accepted.",
      }, { status: 400 })
    }
    if (!message) {
      return NextResponse.json({ ok: false, error: "Message is required." }, { status: 400 })
    }

    const record = await createInquiry({
      email: email.toLowerCase(),
      name,
      message,
      website: website || undefined,
      source: service || undefined,
      page_url: pageUrl || undefined,
    })

    if (!record) {
      console.error("Contact API: PocketBase not configured or createInquiry failed.")
      return NextResponse.json(
        { ok: false, error: "Unable to save your message. Please try again later." },
        { status: 503 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
