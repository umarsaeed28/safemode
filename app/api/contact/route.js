import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

function isValidEmail(value) {
  if (!value || typeof value !== "string") return false
  const trimmed = value.trim()
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(trimmed)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""
    const service = typeof body.service === "string" ? body.service.trim() : ""

    if (!name) {
      return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 })
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
    const text = message + serviceLine
    const htmlService = service ? `<p><strong>Service / interest:</strong> ${service.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>` : ""
    const htmlMessage = `<pre>${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`

    await transporter.sendMail({
      from: user,
      to,
      replyTo: email,
      subject: `Safe Mode contact from ${name}${service ? ` (${service})` : ""}`,
      text,
      html: `<p>From: ${name} &lt;${email}&gt;</p>${htmlService}${htmlMessage}`,
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
