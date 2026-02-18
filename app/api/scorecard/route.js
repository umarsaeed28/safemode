import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createScorecardSubmission, createScorecardInquiry } from "../../../lib/pocketbase"

function isValidEmail(value) {
  if (!value || typeof value !== "string") return false
  const trimmed = value.trim()
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(trimmed)
}

const TIERS = ["Defensible Bet", "Partial Clarity", "Guessing"]

/** Compute tier from total score (10 to 50). Server-authoritative. */
function getTierFromScore(totalScore) {
  if (totalScore >= 40) return "Defensible Bet"
  if (totalScore >= 25) return "Partial Clarity"
  return "Guessing"
}

export async function POST(request) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : ""
    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : ""
    const answers = Array.isArray(body.answers) ? body.answers : []
    const createdAt = typeof body.createdAt === "string" ? body.createdAt : new Date().toISOString()
    const pageUrl = typeof body.pageUrl === "string" ? body.pageUrl : ""

    if (!fullName) {
      return NextResponse.json({ ok: false, error: "Full name is required." }, { status: 400 })
    }
    if (!companyName) {
      return NextResponse.json({ ok: false, error: "Company name is required." }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 })
    }
    if (answers.length !== 10 || answers.some((a) => typeof a !== "number" || a < 1 || a > 5)) {
      return NextResponse.json({ ok: false, error: "Invalid answers. Please complete all 10 questions." }, { status: 400 })
    }

    // Process results: compute score and tier on the server (single source of truth)
    const totalScore = answers.reduce((sum, a) => sum + a, 0)
    const tier = getTierFromScore(totalScore)

    const submission = {
      email,
      fullName,
      companyName,
      totalScore,
      tier,
      answers,
      createdAt,
      pageUrl: pageUrl || "(unknown)",
    }

    const tierForPb = tier === "Defensible Bet" ? "defensible_bet" : tier === "Partial Clarity" ? "partial_clarity" : "guessing"
    const userAgent = request.headers.get("user-agent") || undefined

    // Save to scorecard_submissions (legacy collection)
    try {
      const saved = await createScorecardSubmission({
        email: email.toLowerCase(),
        score_total: totalScore,
        tier: tierForPb,
        answers: answers.map((a) => Number(a)),
        page_url: pageUrl || undefined,
        user_agent: userAgent,
      })
      if (!saved) {
        console.warn("Scorecard API: PocketBase scorecard_submissions save failed; results still returned.")
      }
    } catch (pbErr) {
      console.warn("Scorecard API: PocketBase scorecard_submissions error (results still returned):", pbErr)
    }

    // Save to scorecard_inquiries (new collection with mandatory contact info)
    try {
      const inquirySaved = await createScorecardInquiry({
        email: email.toLowerCase(),
        full_name: fullName,
        company_name: companyName,
        score_total: totalScore,
        tier: tierForPb,
        answers: answers.map((a) => Number(a)),
        page_url: pageUrl || undefined,
        user_agent: userAgent,
      })
      if (!inquirySaved) {
        console.warn("Scorecard API: PocketBase scorecard_inquiries save failed; results still returned.")
      }
    } catch (pbErr) {
      console.warn("Scorecard API: PocketBase scorecard_inquiries error (results still returned):", pbErr)
    }

    // Try to send email notification; do not fail the request if email is not configured or send fails
    const user = process.env.GMAIL_USER
    const pass = process.env.GMAIL_APP_PASSWORD
    const to = process.env.CONTACT_TO || user

    if (user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user, pass },
        })
        const text = [
          "Discovery Scorecard submission",
          "",
          `Name: ${fullName}`,
          `Company: ${companyName}`,
          `Email: ${email}`,
          `Score: ${totalScore}`,
          `Tier: ${tier}`,
          `Page: ${pageUrl || "(unknown)"}`,
          `Submitted: ${createdAt}`,
          "",
          "Answers (1-5):",
          answers.map((a, i) => `  Q${i + 1}: ${a}`).join("\n"),
        ].join("\n")
        const esc = (s) => (s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        const html = [
          "<h2>Discovery Scorecard submission</h2>",
          `<p><strong>Name:</strong> ${esc(fullName)}</p>`,
          `<p><strong>Company:</strong> ${esc(companyName)}</p>`,
          `<p><strong>Email:</strong> ${esc(email)}</p>`,
          `<p><strong>Score:</strong> ${totalScore}</p>`,
          `<p><strong>Tier:</strong> ${tier}</p>`,
          `<p><strong>Page:</strong> ${esc(pageUrl || "(unknown)")}</p>`,
          `<p><strong>Submitted:</strong> ${esc(createdAt)}</p>`,
          "<p><strong>Answers (1-5):</strong></p><pre>" + answers.map((a, i) => `Q${i + 1}: ${a}`).join(", ") + "</pre>",
        ].join("")
        await transporter.sendMail({
          from: user,
          to: to || user,
          replyTo: email,
          subject: `Discovery Scorecard: ${tier} (${totalScore}/50) — ${fullName} (${companyName}) ${email}`,
          text,
          html,
        })
      } catch (emailErr) {
        console.error("Scorecard email send failed (submission still saved):", emailErr)
        console.info("Scorecard submission:", JSON.stringify(submission, null, 2))
      }
    } else {
      console.info("Scorecard submission (GMAIL not configured):", JSON.stringify(submission, null, 2))
    }

    return NextResponse.json({ ok: true, totalScore, tier })
  } catch (err) {
    console.error("Scorecard API error:", err)
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
