"use client"

import { useState, useEffect, useCallback } from "react"
import styles from "./internal.module.css"

function formatDate(s) {
  if (!s) return "—"
  try {
    const d = new Date(s)
    return d.toLocaleString()
  } catch {
    return s
  }
}

function tierLabel(tier) {
  if (!tier) return "—"
  const map = { defensible_bet: "Defensible Bet", partial_clarity: "Partial Clarity", guessing: "Guessing" }
  return map[tier] || tier
}

export default function InternalPage() {
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [stats, setStats] = useState({ inquiriesTotal: 0, scorecardTotal: 0, byTier: {} })
  const [inquiries, setInquiries] = useState({ items: [], total: 0 })
  const [submissions, setSubmissions] = useState({ items: [], total: 0 })
  const [searchEmail, setSearchEmail] = useState("")
  const [detailRecord, setDetailRecord] = useState(null)
  const [detailType, setDetailType] = useState(null)
  const [pbBase, setPbBase] = useState("")

  const loadStats = useCallback(async () => {
    const res = await fetch("/api/internal/stats", { credentials: "include" })
    if (res.ok) setStats(await res.json())
  }, [])

  const loadInquiries = useCallback(async () => {
    const q = new URLSearchParams({ perPage: "20", sort: "-created" })
    if (searchEmail) q.set("email", searchEmail)
    const res = await fetch(`/api/internal/inquiries?${q}`, { credentials: "include" })
    if (res.ok) setInquiries(await res.json())
    else setInquiries({ items: [], total: 0 })
  }, [searchEmail])

  const loadSubmissions = useCallback(async () => {
    const q = new URLSearchParams({ perPage: "20", sort: "-created" })
    if (searchEmail) q.set("email", searchEmail)
    const res = await fetch(`/api/internal/scorecard-submissions?${q}`, { credentials: "include" })
    if (res.ok) setSubmissions(await res.json())
    else setSubmissions({ items: [], total: 0 })
  }, [searchEmail])

  useEffect(() => {
    if (!authenticated) return
    loadStats()
    loadInquiries()
    loadSubmissions()
    fetch("/api/internal/pb-base", { credentials: "include" })
      .then((r) => r.ok && r.json())
      .then((d) => d && setPbBase(d.url || ""))
  }, [authenticated, loadStats, loadInquiries, loadSubmissions])

  useEffect(() => {
    if (!authenticated) return
    const t = setTimeout(() => {
      loadInquiries()
      loadSubmissions()
    }, 300)
    return () => clearTimeout(t)
  }, [authenticated, searchEmail, loadInquiries, loadSubmissions])

  async function handleLogin(e) {
    e.preventDefault()
    setAuthError("")
    const res = await fetch("/api/internal/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include",
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok) setAuthenticated(true)
    else setAuthError(data.error || "Invalid password.")
  }

  async function handleLogout() {
    await fetch("/api/internal/auth", { method: "DELETE", credentials: "include" })
    setAuthenticated(false)
    setDetailRecord(null)
  }

  function openDetail(type, record) {
    setDetailType(type)
    setDetailRecord(record)
  }

  if (!authenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.gate}>
            <h1 className={styles.title}>Internal</h1>
            <form onSubmit={handleLogin}>
              <label className={styles.gateLabel}>Password</label>
              <input
                type="password"
                className={styles.gateInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Internal</h1>
        <p className={styles.logout}>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </p>

        <section className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.inquiriesTotal}</div>
            <div className={styles.statLabel}>Inquiries</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.scorecardTotal}</div>
            <div className={styles.statLabel}>Scorecard submissions</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.byTier?.defensible_bet ?? 0}</div>
            <div className={styles.statLabel}>Defensible Bet</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.byTier?.partial_clarity ?? 0}</div>
            <div className={styles.statLabel}>Partial Clarity</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.byTier?.guessing ?? 0}</div>
            <div className={styles.statLabel}>Guessing</div>
          </div>
        </section>

        <section className={styles.searchWrap}>
          <label className={styles.gateLabel}>Search by email</label>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="email@example.com"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </section>

        <h2 className={styles.sectionTitle}>Recent inquiries</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.items.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    No inquiries found.
                  </td>
                </tr>
              )}
              {inquiries.items.map((r) => (
                <tr key={r.id}>
                  <td>
                    <button type="button" className={styles.rowLink} onClick={() => openDetail("inquiry", r)}>
                      {r.email}
                    </button>
                  </td>
                  <td>{r.name || "—"}</td>
                  <td>{r.status || "—"}</td>
                  <td>{formatDate(r.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={styles.sectionTitle}>Recent scorecard submissions</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Score</th>
                <th>Tier</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {submissions.items.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    No submissions found.
                  </td>
                </tr>
              )}
              {submissions.items.map((r) => (
                <tr key={r.id}>
                  <td>
                    <button type="button" className={styles.rowLink} onClick={() => openDetail("scorecard", r)}>
                      {r.email}
                    </button>
                  </td>
                  <td>{r.score_total ?? "—"}</td>
                  <td>{tierLabel(r.tier)}</td>
                  <td>{formatDate(r.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detailRecord && (
        <div className={styles.overlay} onClick={() => setDetailRecord(null)} role="dialog" aria-modal="true">
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.drawerTitle}>
              {detailType === "inquiry" ? "Inquiry" : "Scorecard submission"}
            </h3>
            {detailType === "inquiry" && (
              <>
                <div className={styles.drawerRow}>
                  <span className={styles.drawerLabel}>Email</span>
                  <span className={styles.drawerValue}>{detailRecord.email}</span>
                </div>
                <div className={styles.drawerRow}>
                  <span className={styles.drawerLabel}>Name</span>
                  <span className={styles.drawerValue}>{detailRecord.name || "—"}</span>
                </div>
                <div className={styles.drawerRow}>
                  <span className={styles.drawerLabel}>Message</span>
                  <span className={styles.drawerValue}>{detailRecord.message || "—"}</span>
                </div>
                <div className={styles.drawerRow}>
                  <span className={styles.drawerLabel}>Status</span>
                  <span className={styles.drawerValue}>{detailRecord.status || "—"}</span>
                </div>
                <div className={styles.drawerRow}>
                  <span className={styles.drawerLabel}>Created</span>
                  <span className={styles.drawerValue}>{formatDate(detailRecord.created)}</span>
                </div>
                {pbBase && (
                  <a
                    href={`${pbBase}/_/collections/inquiries/records/${detailRecord.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.drawerLink}
                  >
                    Open in PocketBase admin →
                  </a>
                )}
              </>
            )}
            {detailType === "scorecard" && (
              <>
                <div className={styles.drawerRow}>
                  <span className={styles.drawerLabel}>Email</span>
                  <span className={styles.drawerValue}>{detailRecord.email}</span>
                </div>
                <div className={styles.drawerRow}>
                  <span className={styles.drawerLabel}>Score</span>
                  <span className={styles.drawerValue}>{detailRecord.score_total ?? "—"}</span>
                </div>
                <div className={styles.drawerRow}>
                  <span className={styles.drawerLabel}>Tier</span>
                  <span className={styles.drawerValue}>{tierLabel(detailRecord.tier)}</span>
                </div>
                <div className={styles.drawerRow}>
                  <span className={styles.drawerLabel}>Answers</span>
                  <span className={styles.drawerValue}>
                    {Array.isArray(detailRecord.answers)
                      ? detailRecord.answers.join(", ")
                      : JSON.stringify(detailRecord.answers || "—")}
                  </span>
                </div>
                <div className={styles.drawerRow}>
                  <span className={styles.drawerLabel}>Created</span>
                  <span className={styles.drawerValue}>{formatDate(detailRecord.created)}</span>
                </div>
                {pbBase && (
                  <a
                    href={`${pbBase}/_/collections/scorecard_submissions/records/${detailRecord.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.drawerLink}
                  >
                    Open in PocketBase admin →
                  </a>
                )}
              </>
            )}
            <button type="button" className={styles.drawerClose} onClick={() => setDetailRecord(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
