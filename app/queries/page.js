"use client"

import { useState, useEffect, useCallback } from "react"
import styles from "./queries.module.css"

function formatDate(s) {
  if (!s) return "—"
  try {
    return new Date(s).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return s
  }
}

const TIER_MAP = {
  defensible_bet: { label: "Defensible Bet", cls: "tierGreen" },
  partial_clarity: { label: "Partial Clarity", cls: "tierAmber" },
  guessing: { label: "Guessing", cls: "tierRed" },
}

function TierBadge({ tier }) {
  const t = TIER_MAP[tier] || { label: tier || "—", cls: "" }
  return (
    <span className={`${styles.tierBadge} ${styles[t.cls] || ""}`}>
      {t.label}
    </span>
  )
}

export default function QueriesPage() {
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [data, setData] = useState({ items: [], total: 0, page: 1, perPage: 50 })
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)

  /* ── Check existing cookie on mount (persist across refresh) ── */

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/queries/data?page=1&perPage=1", { credentials: "include" })
        if (res.ok) setAuthenticated(true)
      } catch {
        // not logged in
      } finally {
        setCheckingAuth(false)
      }
    }
    checkSession()
  }, [])

  /* ── Auth ─────────────────────────────────────────── */

  async function handleLogin(e) {
    e.preventDefault()
    setAuthError("")
    const res = await fetch("/api/queries/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include",
    })
    const d = await res.json().catch(() => ({}))
    if (d.ok) setAuthenticated(true)
    else setAuthError(d.error || "Invalid password.")
  }

  async function handleLogout() {
    await fetch("/api/queries/auth", { method: "DELETE", credentials: "include" })
    setAuthenticated(false)
    setDetail(null)
  }

  /* ── Data fetching ────────────────────────────────── */

  const loadData = useCallback(async (p, q) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), perPage: "50" })
    if (q) params.set("search", q)
    try {
      const res = await fetch(`/api/queries/data?${params}`, { credentials: "include" })
      if (res.status === 401) {
        setAuthenticated(false)
        return
      }
      if (res.ok) setData(await res.json())
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authenticated) return
    loadData(page, search)
  }, [authenticated, page, loadData]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!authenticated) return
    setPage(1)
    const t = setTimeout(() => loadData(1, search), 300)
    return () => clearTimeout(t)
  }, [search, authenticated, loadData])

  /* ── CSV export (client-side) ─────────────────────── */

  function handleExport() {
    if (!data.items.length) return
    const header = ["Full Name", "Company", "Email", "Score", "Tier", "Answers", "Submitted"]
    const rows = data.items.map((r) => [
      r.full_name,
      r.company_name,
      r.email,
      r.score_total,
      (TIER_MAP[r.tier]?.label) || r.tier,
      Array.isArray(r.answers) ? r.answers.join(";") : "",
      r.created || "",
    ])
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `scorecard-inquiries-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ── Stats ────────────────────────────────────────── */

  const totalRecords = data.total
  const tierCounts = { defensible_bet: 0, partial_clarity: 0, guessing: 0 }
  data.items.forEach((r) => {
    if (tierCounts[r.tier] !== undefined) tierCounts[r.tier]++
  })
  const totalPages = Math.max(1, Math.ceil(data.total / (data.perPage || 50)))

  /* ── Login gate ───────────────────────────────────── */

  if (checkingAuth) {
    return (
      <div className={styles.page}>
        <div className={styles.gate}>
          <div className={styles.gateCard}>
            <p className={styles.gateSubtitle} style={{ textAlign: "center", margin: 0 }}>Loading…</p>
          </div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.gate}>
          <div className={styles.gateCard}>
            <h1 className={styles.gateTitle}>Queries</h1>
            <p className={styles.gateSubtitle}>Scorecard inquiry viewer</p>
            <form onSubmit={handleLogin}>
              <label className={styles.gateLabel}>Password</label>
              <input
                type="password"
                className={styles.gateInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                autoFocus
              />
              <button type="submit" className={styles.gateBtn}>
                Log in
              </button>
              {authError && <p className={styles.gateError}>{authError}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }

  /* ── Authenticated view ───────────────────────────── */

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <h1 className={styles.topbarTitle}>
            Queries
            <span className={styles.topbarBadge}>{totalRecords} total</span>
          </h1>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
        </header>

        <div className={styles.content}>
          {/* Stats cards */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{totalRecords}</div>
              <div className={styles.statLabel}>Total inquiries</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{tierCounts.defensible_bet}</div>
              <div className={styles.statLabel}>Defensible Bet</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{tierCounts.partial_clarity}</div>
              <div className={styles.statLabel}>Partial Clarity</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{tierCounts.guessing}</div>
              <div className={styles.statLabel}>Guessing</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name, company, or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" className={styles.exportBtn} onClick={handleExport}>
              ↓ Export CSV
            </button>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Score</th>
                  <th>Tier</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {data.items.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      {search ? "No results match your search." : "No scorecard inquiries yet."}
                    </td>
                  </tr>
                )}
                {loading && data.items.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.empty}>Loading…</td>
                  </tr>
                )}
                {data.items.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <button
                        type="button"
                        className={styles.rowLink}
                        onClick={() => setDetail(r)}
                      >
                        {r.full_name || "—"}
                      </button>
                    </td>
                    <td>{r.company_name || "—"}</td>
                    <td>{r.email || "—"}</td>
                    <td>{r.score_total ?? "—"}<span style={{ color: "#9ca3af" }}>/50</span></td>
                    <td><TierBadge tier={r.tier} /></td>
                    <td>{formatDate(r.created)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data.total > 0 && (
              <div className={styles.pagination}>
                <p className={styles.paginationInfo}>
                  Page {page} of {totalPages} · {data.total} record{data.total !== 1 ? "s" : ""}
                </p>
                <div className={styles.paginationBtns}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className={styles.overlay} onClick={() => setDetail(null)} role="dialog" aria-modal="true">
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>Inquiry Detail</h2>
              <button type="button" className={styles.drawerCloseBtn} onClick={() => setDetail(null)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className={styles.drawerField}>
              <span className={styles.drawerLabel}>Full Name</span>
              <span className={styles.drawerValue}>{detail.full_name || "—"}</span>
            </div>

            <div className={styles.drawerField}>
              <span className={styles.drawerLabel}>Company</span>
              <span className={styles.drawerValue}>{detail.company_name || "—"}</span>
            </div>

            <div className={styles.drawerField}>
              <span className={styles.drawerLabel}>Email</span>
              <span className={styles.drawerValue}>{detail.email || "—"}</span>
            </div>

            <hr className={styles.drawerDivider} />

            <div className={styles.drawerField}>
              <span className={styles.drawerLabel}>Score</span>
              <span className={styles.drawerValue}>{detail.score_total ?? "—"}/50</span>
            </div>

            <div className={styles.drawerField}>
              <span className={styles.drawerLabel}>Tier</span>
              <TierBadge tier={detail.tier} />
            </div>

            <div className={styles.drawerField}>
              <span className={styles.drawerLabel}>Answers (Q1–Q10)</span>
              <div className={styles.drawerAnswers}>
                {Array.isArray(detail.answers)
                  ? detail.answers.map((a, i) => (
                      <span key={i} className={styles.answerChip} title={`Q${i + 1}`}>
                        {a}
                      </span>
                    ))
                  : <span className={styles.drawerValue}>—</span>}
              </div>
            </div>

            <hr className={styles.drawerDivider} />

            <div className={styles.drawerField}>
              <span className={styles.drawerLabel}>Page URL</span>
              <span className={styles.drawerValue}>{detail.page_url || "—"}</span>
            </div>

            <div className={styles.drawerField}>
              <span className={styles.drawerLabel}>Submitted</span>
              <span className={styles.drawerValue}>{formatDate(detail.created)}</span>
            </div>

            <div className={styles.drawerField}>
              <span className={styles.drawerLabel}>Record ID</span>
              <span className={styles.drawerValue} style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>{detail.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

