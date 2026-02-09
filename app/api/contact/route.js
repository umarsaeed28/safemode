import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

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

    const user = process.env.GMAIL_USER
    const pass = process.env.GMAIL_APP_PASSWORD
    const to = process.env.CONTACT_TO || "umarsaee.re@gmail.com"

    if (!user || !pass) {
      return NextResponse.json(
        { ok: false, error: "Server email is not configured." },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    })

    const serviceLine = service ? `\n\nService / interest: ${service}` : ""
    const websiteLine = website ? `\nWebsite: ${website}` : ""
    const text = message + serviceLine + websiteLine
    const htmlService = service ? `<p><strong>Service / interest:</strong> ${service.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>` : ""
    const htmlWebsite = website ? `<p><strong>Website:</strong> <a href="${website.replace(/"/g, "&quot;")}">${website.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</a></p>` : ""
    const htmlMessage = `<pre>${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`

    await transporter.sendMail({
      from: user,
      to,
      replyTo: email,
      subject: `Safe Mode contact from ${name}${service ? ` (${service})` : ""}`,
      text,
      html: `<p>From: ${name} &lt;${email}&gt;</p>${htmlService}${htmlWebsite}${htmlMessage}`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Contact API error:", err)
    const message = err?.message || String(err)
    const isAuth = /invalid login|authentication failed|username and password/i.test(message)
    const isEnv = !process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD
    const hint = isEnv
      ? "Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local."
      : isAuth
        ? "Check GMAIL_USER and GMAIL_APP_PASSWORD. Use a Gmail App Password (not your normal password): Google Account → Security → 2-Step Verification → App passwords."
        : "Check server logs for details."
    return NextResponse.json(
      { ok: false, error: `Failed to send message. ${hint}` },
      { status: 500 }
    )
  }
}
