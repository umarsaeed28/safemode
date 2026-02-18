/**
 * PocketBase server-side helper: auth and create records.
 * Uses POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD.
 */

let cachedToken = null

function getBase() {
  const url = process.env.POCKETBASE_URL || "http://127.0.0.1:8090"
  return url.replace(/\/$/, "")
}

/** Clear cached token so next call re-authenticates. */
function clearTokenCache() {
  cachedToken = null
}

async function getAdminToken(forceRefresh = false) {
  if (cachedToken && !forceRefresh) return cachedToken
  cachedToken = null
  const base = getBase()
  const email = process.env.POCKETBASE_ADMIN_EMAIL
  const password = process.env.POCKETBASE_ADMIN_PASSWORD
  if (!email || !password) {
    console.warn("[PocketBase] Missing POCKETBASE_ADMIN_EMAIL or POCKETBASE_ADMIN_PASSWORD in env. Add them to .env.local.")
    return null
  }
  // PocketBase 0.36+ uses _superusers auth collection (no longer /api/admins/*)
  const authUrl = `${base}/api/collections/_superusers/auth-with-password`
  const res = await fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: email, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error("[PocketBase] Admin auth failed:", res.status, data.message || data.error || res.statusText, "| URL:", authUrl)
    return null
  }
  cachedToken = data.token ?? data.data?.token ?? null
  if (!cachedToken) {
    console.error("[PocketBase] Admin auth response missing token:", Object.keys(data))
    return null
  }
  return cachedToken
}

/**
 * Create an inquiry record. Email is normalized to lowercase.
 * @param {Object} data - { email, name?, company?, role?, message, source?, page_url?, utm_source?, utm_medium?, utm_campaign?, notes? }
 */
export async function createInquiry(data) {
  const token = await getAdminToken()
  if (!token) return null
  const base = getBase()
  const body = {
    email: (data.email || "").trim().toLowerCase(),
    name: data.name || "",
    company: data.company || "",
    role: data.role || "",
    message: data.message || "",
    website: data.website || "",
    source: data.source || "",
    page_url: data.page_url || "",
    utm_source: data.utm_source || "",
    utm_medium: data.utm_medium || "",
    utm_campaign: data.utm_campaign || "",
    status: "new",
    notes: data.notes || "",
  }
  const url = `${base}/api/collections/inquiries/records`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error("[PocketBase] Create inquiry failed:", res.status, result.message || result.error || res.statusText, "| URL:", url)
    return null
  }
  return result
}

/**
 * Create a scorecard_submissions record. Email lowercase. Tier: guessing | partial_clarity | defensible_bet.
 * @param {Object} data - { email, score_total, tier, answers (number[] length 10), ip_hash?, user_agent?, source?, page_url? }
 */
export async function createScorecardSubmission(data) {
  const token = await getAdminToken()
  if (!token) return null
  const base = getBase()
  const tierMap = {
    "Defensible Bet": "defensible_bet",
    "Partial Clarity": "partial_clarity",
    Guessing: "guessing",
  }
  const tier = tierMap[data.tier] || data.tier
  const body = {
    email: (data.email || "").trim().toLowerCase(),
    score_total: data.score_total,
    tier,
    answers: Array.isArray(data.answers) ? data.answers.map((a) => Number(a)) : [],
    ip_hash: data.ip_hash || "",
    user_agent: data.user_agent || "",
    source: data.source || "",
    page_url: data.page_url || "",
  }
  const url = `${base}/api/collections/scorecard_submissions/records`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error("[PocketBase] Create scorecard failed:", res.status, result.message || result.error || res.statusText, "| URL:", url)
    return null
  }
  return result
}

/**
 * List records (for internal API). Requires admin token.
 */
export async function listInquiries(options = {}) {
  const token = await getAdminToken()
  if (!token) return { items: [], total: 0 }
  const base = getBase()
  const { page = 1, perPage = 20, filter = "", sort = "-created" } = options
  const q = new URLSearchParams({ page: String(page), perPage: String(perPage), sort })
  if (filter) q.set("filter", filter)
  const res = await fetch(`${base}/api/collections/inquiries/records?${q}`, {
    headers: { Authorization: token },
  })
  if (!res.ok) return { items: [], total: 0 }
  const data = await res.json()
  return { items: data.items || [], total: data.totalItems || 0 }
}

export async function listScorecardSubmissions(options = {}) {
  const token = await getAdminToken()
  if (!token) return { items: [], total: 0 }
  const base = getBase()
  const { page = 1, perPage = 20, filter = "", sort = "-created" } = options
  const q = new URLSearchParams({ page: String(page), perPage: String(perPage), sort })
  if (filter) q.set("filter", filter)
  const res = await fetch(`${base}/api/collections/scorecard_submissions/records?${q}`, {
    headers: { Authorization: token },
  })
  if (!res.ok) return { items: [], total: 0 }
  const data = await res.json()
  return { items: data.items || [], total: data.totalItems || 0 }
}

export async function getInquiry(id) {
  const token = await getAdminToken()
  if (!token) return null
  const base = getBase()
  const res = await fetch(`${base}/api/collections/inquiries/records/${id}`, {
    headers: { Authorization: token },
  })
  if (!res.ok) return null
  return res.json()
}

export async function getScorecardSubmission(id) {
  const token = await getAdminToken()
  if (!token) return null
  const base = getBase()
  const res = await fetch(`${base}/api/collections/scorecard_submissions/records/${id}`, {
    headers: { Authorization: token },
  })
  if (!res.ok) return null
  return res.json()
}

/**
 * Create a scorecard_inquiries record. Stores mandatory contact info + scorecard results.
 * @param {Object} data - { email, full_name, company_name, score_total, tier, answers, page_url?, user_agent? }
 */
export async function createScorecardInquiry(data) {
  const token = await getAdminToken()
  if (!token) return null
  const base = getBase()
  const tierMap = {
    "Defensible Bet": "defensible_bet",
    "Partial Clarity": "partial_clarity",
    Guessing: "guessing",
  }
  const tier = tierMap[data.tier] || data.tier
  const body = {
    email: (data.email || "").trim().toLowerCase(),
    full_name: (data.full_name || "").trim(),
    company_name: (data.company_name || "").trim(),
    score_total: data.score_total,
    tier,
    answers: Array.isArray(data.answers) ? data.answers.map((a) => Number(a)) : [],
    page_url: data.page_url || "",
    user_agent: data.user_agent || "",
  }
  const url = `${base}/api/collections/scorecard_inquiries/records`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error("[PocketBase] Create scorecard inquiry failed:", res.status, result.message || result.error || res.statusText, "| URL:", url)
    return null
  }
  return result
}

export async function listScorecardInquiries(options = {}) {
  let token = await getAdminToken()
  if (!token) return { items: [], total: 0 }
  const base = getBase()
  const { page = 1, perPage = 20, filter = "", sort = "-created" } = options
  const q = new URLSearchParams({ page: String(page), perPage: String(perPage), sort })
  if (filter) q.set("filter", filter)
  const url = `${base}/api/collections/scorecard_inquiries/records?${q}`
  let res = await fetch(url, { headers: { Authorization: token } })
  // If 401/403, refresh token and retry once
  if (res.status === 401 || res.status === 403) {
    clearTokenCache()
    token = await getAdminToken(true)
    if (!token) return { items: [], total: 0 }
    res = await fetch(url, { headers: { Authorization: token } })
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error("[PocketBase] List scorecard inquiries failed:", res.status, err.message || err.error || res.statusText, "| URL:", url)
    return { items: [], total: 0 }
  }
  const data = await res.json()
  return { items: data.items || [], total: data.totalItems || 0 }
}

export async function getAllScorecardInquiries() {
  const token = await getAdminToken()
  if (!token) return []
  const base = getBase()
  let allItems = []
  let page = 1
  const perPage = 200
  while (true) {
    const q = new URLSearchParams({ page: String(page), perPage: String(perPage), sort: "-created" })
    const res = await fetch(`${base}/api/collections/scorecard_inquiries/records?${q}`, {
      headers: { Authorization: token },
    })
    if (!res.ok) break
    const data = await res.json()
    const items = data.items || []
    allItems = allItems.concat(items)
    if (items.length < perPage) break
    page++
  }
  return allItems
}

/** Get counts for internal dashboard (no filter). */
export async function getStats() {
  const token = await getAdminToken()
  if (!token) return { inquiriesTotal: 0, scorecardTotal: 0, byTier: {} }
  const base = getBase()
  const [inqRes, scRes] = await Promise.all([
    fetch(`${base}/api/collections/inquiries/records?perPage=1`, { headers: { Authorization: token } }),
    fetch(`${base}/api/collections/scorecard_submissions/records?perPage=1`, { headers: { Authorization: token } }),
  ])
  const inqData = inqRes.ok ? await inqRes.json() : {}
  const scData = scRes.ok ? await scRes.json() : {}
  const inquiriesTotal = inqData.totalItems ?? 0
  const scorecardTotal = scData.totalItems ?? 0
  const byTier = { guessing: 0, partial_clarity: 0, defensible_bet: 0 }
  if (scorecardTotal > 0) {
    const allRes = await fetch(
      `${base}/api/collections/scorecard_submissions/records?perPage=500&sort=-created`,
      { headers: { Authorization: token } }
    )
    if (allRes.ok) {
      const all = await allRes.json()
      ;(all.items || []).forEach((r) => {
        if (r.tier && byTier[r.tier] !== undefined) byTier[r.tier]++
      })
    }
  }
  return { inquiriesTotal, scorecardTotal, byTier }
}
