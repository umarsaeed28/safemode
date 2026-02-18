import { NextResponse } from "next/server"
import { verifyQueriesCookie } from "../auth/route"

/**
 * Diagnostic endpoint — tells the /queries UI exactly what's
 * configured (and what's missing) so the user can fix it from
 * the Vercel dashboard without needing a terminal.
 */
export async function GET(request) {
  if (!verifyQueriesCookie(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const pbUrl = process.env.POCKETBASE_URL || "http://127.0.0.1:8090"
  const email = process.env.POCKETBASE_ADMIN_EMAIL || ""
  const password = process.env.POCKETBASE_ADMIN_PASSWORD || ""

  const checks = {
    POCKETBASE_URL: { value: pbUrl, ok: true, hint: null },
    POCKETBASE_ADMIN_EMAIL: { value: email ? `${email.slice(0, 3)}***` : "(not set)", ok: !!email, hint: null },
    POCKETBASE_ADMIN_PASSWORD: { value: password ? "***" : "(not set)", ok: !!password, hint: null },
  }

  // Flag if URL is still the default localhost
  if (pbUrl.includes("127.0.0.1") || pbUrl.includes("localhost")) {
    checks.POCKETBASE_URL.hint =
      "This is a localhost address — it won't work on Vercel. Set POCKETBASE_URL to your PocketBase server's public URL (e.g. https://pb.yourdomain.com)."
    checks.POCKETBASE_URL.ok = false
  }

  if (!email) {
    checks.POCKETBASE_ADMIN_EMAIL.hint =
      "Set POCKETBASE_ADMIN_EMAIL in Vercel Environment Variables to your PocketBase superuser email."
  }
  if (!password) {
    checks.POCKETBASE_ADMIN_PASSWORD.hint =
      "Set POCKETBASE_ADMIN_PASSWORD in Vercel Environment Variables to your PocketBase superuser password."
  }

  // Try to reach PocketBase health endpoint
  let pbReachable = false
  let pbError = null
  let authOk = false
  let authError = null
  let collectionOk = false
  let collectionError = null

  const base = pbUrl.replace(/\/$/, "")

  try {
    const healthRes = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(5000) })
    pbReachable = healthRes.ok
    if (!healthRes.ok) pbError = `HTTP ${healthRes.status}`
  } catch (err) {
    pbError = err.message || "Connection failed"
  }

  // Try admin auth
  if (pbReachable && email && password) {
    try {
      const authRes = await fetch(`${base}/api/collections/_superusers/auth-with-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: email, password }),
        signal: AbortSignal.timeout(5000),
      })
      const authData = await authRes.json().catch(() => ({}))
      if (authRes.ok && (authData.token || authData.data?.token)) {
        authOk = true
        const token = authData.token || authData.data?.token

        // Check collection exists
        try {
          const colRes = await fetch(`${base}/api/collections/scorecard_inquiries`, {
            headers: { Authorization: token },
            signal: AbortSignal.timeout(5000),
          })
          collectionOk = colRes.ok
          if (!colRes.ok) collectionError = `HTTP ${colRes.status} — collection may not exist yet (it will be auto-created on first scorecard submission)`
        } catch (err) {
          collectionError = err.message
        }
      } else {
        authError = authData.message || `HTTP ${authRes.status}`
      }
    } catch (err) {
      authError = err.message || "Auth request failed"
    }
  }

  const allOk = checks.POCKETBASE_URL.ok && checks.POCKETBASE_ADMIN_EMAIL.ok && checks.POCKETBASE_ADMIN_PASSWORD.ok && pbReachable && authOk && collectionOk

  return NextResponse.json({
    ok: allOk,
    env: checks,
    pocketbase_reachable: pbReachable,
    pocketbase_error: pbError,
    admin_auth_ok: authOk,
    admin_auth_error: authError,
    collection_ok: collectionOk,
    collection_error: collectionError,
    summary: allOk
      ? "Everything looks good! PocketBase is connected and the collection exists."
      : !checks.POCKETBASE_URL.ok
        ? "⚠️ POCKETBASE_URL is set to localhost. Go to Vercel → Settings → Environment Variables and set it to your PocketBase server's public URL."
        : !checks.POCKETBASE_ADMIN_EMAIL.ok || !checks.POCKETBASE_ADMIN_PASSWORD.ok
          ? "⚠️ PocketBase credentials are missing. Go to Vercel → Settings → Environment Variables and add POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD."
          : !pbReachable
            ? `⚠️ Cannot reach PocketBase at ${pbUrl}. Make sure your PocketBase server is running and accessible from the internet.`
            : !authOk
              ? `⚠️ PocketBase is reachable but admin auth failed: ${authError}. Check your email/password.`
              : `⚠️ Connected to PocketBase but collection issue: ${collectionError}`,
  })
}

