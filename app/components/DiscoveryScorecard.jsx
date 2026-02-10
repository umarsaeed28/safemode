"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import styles from "./DiscoveryScorecard.module.css"

const QUESTIONS = [
  "Our team can name one specific customer problem we are solving right now, and agree on it.",
  "We've spoken with at least 10 real target users in the last 30 days about this exact opportunity.",
  "We've identified the single riskiest assumption behind this idea, and tested it.",
  "Engineers could start building tomorrow without major clarifying questions.",
  "We've explicitly mapped value, usability, feasibility, and viability risks, and de-risked the top one.",
  "This roadmap slice is tied to a measurable outcome (e.g., retention, activation), not just shipping.",
  "We've tested real flows or prototypes with users to surface failure modes early.",
  "Stakeholders are aligned on clear go / no-go criteria before committing engineering.",
  "Prioritization decisions are backed by evidence (quotes, data, tests), not just opinions.",
  "If new evidence killed this idea tomorrow, the team could pivot without politics or drama.",
]

const SCALE_LABELS = [
  "1 = Strongly Disagree",
  "2 = Disagree",
  "3 = Neutral",
  "4 = Agree",
  "5 = Strongly Agree",
]

function getTier(totalScore) {
  if (totalScore >= 40) return "Defensible Bet"
  if (totalScore >= 25) return "Partial Clarity"
  return "Guessing"
}

export default function DiscoveryScorecard({ isOpen, onClose }) {
  const [step, setStep] = useState("quiz") // quiz | email | tease | results
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(Array(10).fill(null))
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [submitStatus, setSubmitStatus] = useState("idle") // idle | loading | done | error
  const [totalScore, setTotalScore] = useState(null)
  const [tier, setTier] = useState(null)
  const modalRef = useRef(null)
  const closeBtnRef = useRef(null)

  const total = answers.reduce((sum, a) => sum + (a ?? 0), 0)
  const allAnswered = answers.every((a) => a !== null && a >= 1 && a <= 5)
  const computedScore = allAnswered ? answers.reduce((s, a) => s + a, 0) : null
  const computedTier = computedScore !== null ? getTier(computedScore) : null

  const reset = useCallback(() => {
    setStep("quiz")
    setCurrentQuestion(0)
    setAnswers(Array(10).fill(null))
    setEmail("")
    setEmailError("")
    setSubmitStatus("idle")
    setTotalScore(null)
    setTier(null)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      reset()
      return
    }
    closeBtnRef.current?.focus()
  }, [isOpen, reset])

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  function handleAnswer(value) {
    const next = [...answers]
    next[currentQuestion] = value
    setAnswers(next)
    if (currentQuestion < 9) {
      setCurrentQuestion((q) => q + 1)
    } else {
      setStep("email")
    }
  }

  function handleBack() {
    if (currentQuestion > 0) setCurrentQuestion((q) => q - 1)
  }

  function handleEmailSubmit(e) {
    e.preventDefault()
    setEmailError("")
    const trimmed = email.trim()
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(trimmed)) {
      setEmailError("Please enter a valid email address.")
      return
    }
    setSubmitStatus("loading")
    const score = computedScore ?? total
    const tierName = computedTier ?? getTier(score)
    const payload = {
      email: trimmed,
      totalScore: score,
      tier: tierName,
      answers: answers.map((a) => Number(a)),
      createdAt: new Date().toISOString(),
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
    }
    fetch("/api/scorecard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setTotalScore(score)
          setTier(tierName)
          setStep("results")
          setSubmitStatus("done")
        } else {
          setEmailError(data.error || "Something went wrong.")
          setSubmitStatus("error")
        }
      })
      .catch(() => {
        setEmailError("Network error. Please try again.")
        setSubmitStatus("error")
      })
  }

  function handleSkipEmail() {
    setStep("tease")
  }

  if (!isOpen) return null

  const tierConfig = {
    "Defensible Bet": {
      emoji: "🟢",
      ctaText: "Want to accelerate execution? Discuss ongoing support.",
      ctaHref: "/#advisory",
    },
    "Partial Clarity": {
      emoji: "🟡",
      ctaText: "Get a Bet Readiness Review before you commit engineering.",
      ctaHref: "/#contact?intent=bet-readiness",
    },
    Guessing: {
      emoji: "🔴",
      ctaText: "Stop guessing. Book a Kill-or-Ship Decision Review.",
      ctaHref: "/#contact?intent=kill-or-ship",
    },
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scorecard-title"
      ref={modalRef}
    >
      <div className={styles.backdrop} onClick={onClose} aria-hidden />
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
          ref={closeBtnRef}
        >
          ×
        </button>

        {step === "quiz" && (
          <>
            <h2 id="scorecard-title" className={styles.title}>
              Discovery Scorecard
            </h2>
            <p className={styles.progress} aria-live="polite">
              Question {currentQuestion + 1} of 10
            </p>
            <p className={styles.question}>{QUESTIONS[currentQuestion]}</p>
            <fieldset className={styles.scale} aria-label={SCALE_LABELS.join(". ")}>
              <legend className={styles.visuallyHidden}>Rate 1 to 5</legend>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`q${currentQuestion}`}
                    value={value}
                    checked={answers[currentQuestion] === value}
                    onChange={() => handleAnswer(value)}
                    className={styles.radio}
                  />
                  <span className={styles.radioText}>{value}</span>
                </label>
              ))}
            </fieldset>
            <p className={styles.scaleLegend}>{SCALE_LABELS.join(" · ")}</p>
            {currentQuestion > 0 && (
              <button type="button" className={styles.secondaryBtn} onClick={handleBack}>
                Back
              </button>
            )}
          </>
        )}

        {step === "email" && (
          <>
            <h2 id="scorecard-title" className={styles.title}>
              Get your results
            </h2>
            <p className={styles.emailTease}>
              Your score is calculated. Enter your email to reveal your tier and recommendations.
            </p>
            <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
              <label htmlFor="scorecard-email" className={styles.visuallyHidden}>
                Email address
              </label>
              <input
                id="scorecard-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={styles.emailInput}
                autoComplete="email"
                disabled={submitStatus === "loading"}
                autoFocus
              />
              {emailError && <p className={styles.error} role="alert">{emailError}</p>}
              <div className={styles.emailActions}>
                <button type="submit" className={styles.primaryBtn} disabled={submitStatus === "loading"}>
                  {submitStatus === "loading" ? "Sending…" : "Reveal my results"}
                </button>
                <button type="button" className={styles.textBtn} onClick={handleSkipEmail}>
                  No thanks
                </button>
              </div>
            </form>
          </>
        )}

        {step === "tease" && (
          <>
            <h2 id="scorecard-title" className={styles.title}>
              Your score is ready
            </h2>
            <p className={styles.emailTease}>
              Your score is calculated. Enter email to reveal your tier and recommendations.
            </p>
            <button type="button" className={styles.primaryBtn} onClick={() => setStep("email")}>
              Enter email to see results
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Close
            </button>
          </>
        )}

        {step === "results" && tier && (
          <>
            <h2 id="scorecard-title" className={styles.title}>
              Results revealed
            </h2>
            <p className={styles.scoreLine}>
              <span className={styles.scoreNumber}>{totalScore}</span>
              <span className={styles.scoreOf}>/50</span>
              <span className={styles.tierBadge}> {tierConfig[tier].emoji} {tier}</span>
            </p>
            {tier === "Defensible Bet" && (
              <>
                <p className={styles.resultBody}>
                  You&apos;re in rare air. Low risk of waste.
                </p>
                <a href="/#services" className={styles.ctaLink}>
                  Want to accelerate execution? Discuss ongoing support.
                </a>
              </>
            )}
            {tier === "Partial Clarity" && (
              <>
                <p className={styles.resultBody}>
                  Some signal, but dangerous blind spots. This is where teams lose months.
                </p>
                <a href="/#contact?intent=bet-readiness" className={styles.ctaLink}>
                  Get a Bet Readiness Review before you commit engineering.
                </a>
              </>
            )}
            {tier === "Guessing" && (
              <>
                <p className={styles.resultBody}>
                  High likelihood of burned cycles and expensive rework.
                </p>
                <a href="/#contact?intent=kill-or-ship" className={styles.ctaLink}>
                  Stop guessing. Book a Kill-or-Ship Decision Review.
                </a>
              </>
            )}
            <p className={styles.emailCopy}>We&apos;ll email you a copy.</p>
            <button type="button" className={styles.primaryBtn} onClick={onClose}>
              Done
            </button>
          </>
        )}
      </div>
    </div>
  )
}
