"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import styles from "./scorecard.module.css"

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

/** Result content by tier: calm, valuable, decision-oriented. */
const RESULT_CONTENT = {
  "Defensible Bet": {
    emoji: "🟢",
    interpretation: "You're in rare air. Low risk of waste.",
    whatThisMeans:
      "Most teams don’t get here without real user input and explicit decisions. You’re in a good position to build with confidence. This result is uncommon, and worth protecting.",
    strengths: [
      "Clear problem and alignment",
      "User signal and evidence in the mix",
      "Decisions documented and shared",
    ],
    risks: [
      "Execution pace and scope creep",
      "Keeping stakeholders aligned as you ship",
    ],
    ctaButtonText: "Discuss ongoing support",
    ctaSubtext: "Want to accelerate execution?",
    ctaHref: "/#advisory",
  },
  "Partial Clarity": {
    emoji: "🟡",
    interpretation: "Some signal, but dangerous blind spots. This is where teams lose months.",
    whatThisMeans:
      "This is one of the most common places teams sit. You’re not behind. You’re at the point where a small investment in clarity can prevent months of rework. Many successful products pass through this stage.",
    strengths: [
      "Some user signal exists",
      "Direction is forming",
    ],
    risks: [
      "Key assumptions untested",
      "Go / no-go criteria unclear",
      "Engineering risk still high",
    ],
    ctaButtonText: "Get a Bet Readiness Review",
    ctaSubtext: "Pressure-test your riskiest assumption before committing engineering.",
    ctaHref: "/#contact?intent=bet-readiness",
  },
  Guessing: {
    emoji: "🔴",
    interpretation: "High likelihood of burned cycles and expensive rework.",
    whatThisMeans:
      "Lots of teams start here. The goal isn’t to feel bad. It’s to avoid burning cycles on the wrong bet. A short, focused review can turn guessing into a clear go or no-go and save you time and money.",
    strengths: [
      "Willingness to check before building",
      "Awareness that evidence matters",
    ],
    risks: [
      "Core problem or solution unclear",
      "Little or no user validation",
      "Stakeholders not aligned on criteria",
    ],
    ctaButtonText: "Get a Bet Readiness Review",
    ctaSubtext: "Stop guessing.",
    ctaHref: "/#discovery-program",
  },
}

export default function ScorecardPage() {
  const [step, setStep] = useState("quiz") // quiz | email | tease | results
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(Array(10).fill(null))
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [emailError, setEmailError] = useState("")
  const [submitStatus, setSubmitStatus] = useState("idle")
  const [totalScore, setTotalScore] = useState(null)
  const [tier, setTier] = useState(null)
  const advanceTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current)
    }
  }, [])

  const allAnswered = answers.every((a) => a !== null && a >= 1 && a <= 5)
  const computedScore = allAnswered ? answers.reduce((s, a) => s + a, 0) : null
  const computedTier = computedScore !== null ? getTier(computedScore) : null

  const progressPercent =
    step === "quiz"
      ? ((currentQuestion + 1) / 10) * 100
      : step === "email" || step === "tease"
        ? 100
        : 0

  const currentValue = answers[currentQuestion]

  function handleScaleSelect(value) {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current)
      advanceTimeoutRef.current = null
    }
    const next = [...answers]
    next[currentQuestion] = value
    setAnswers(next)
    if (currentQuestion < 9) {
      advanceTimeoutRef.current = setTimeout(() => {
        advanceTimeoutRef.current = null
        setCurrentQuestion((q) => Math.min(q + 1, 9))
      }, 400)
    }
  }

  function handleSubmitQuiz() {
    if (!allAnswered) return
    setStep("email")
  }

  function handleBack() {
    if (currentQuestion > 0) setCurrentQuestion((q) => q - 1)
  }

  function handleEmailSubmit(e) {
    e.preventDefault()
    setEmailError("")
    const trimmedEmail = email.trim()
    const trimmedName = fullName.trim()
    const trimmedCompany = companyName.trim()
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedName) {
      setEmailError("Full name is required.")
      return
    }
    if (!trimmedCompany) {
      setEmailError("Company name is required.")
      return
    }
    if (!re.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.")
      return
    }
    setSubmitStatus("loading")
    const score = computedScore
    const tierName = computedTier
    const payload = {
      email: trimmedEmail,
      fullName: trimmedName,
      companyName: trimmedCompany,
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
          // Use server-computed score and tier when returned (single source of truth)
          setTotalScore(data.totalScore != null ? data.totalScore : score)
          setTier(data.tier || tierName)
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

  return (
    <div className={styles.page}>
      {(step === "quiz" || step === "email" || step === "tease") && (
        <div className={styles.progressBarWrap}>
          <div className={styles.progressBar} role="progressbar" aria-valuenow={Math.round(progressPercent)} aria-valuemin={0} aria-valuemax={100} aria-label="Survey progress">
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      <main className={styles.main} id="main-content">
        <div className={styles.card}>
          {step === "quiz" && (
            <>
              <p className={styles.stepIndicator}>Readiness check</p>
              <h1 className={styles.title}>Discovery Scorecard</h1>
              <p className={styles.subtitle}>
                Rate each statement 1 to 5. You’ll get a score and a clear next step.
              </p>
              <p className={styles.progress} aria-live="polite">
                Question {Math.min(currentQuestion + 1, 10)} of 10
              </p>
              <p className={styles.question}>{QUESTIONS[Math.min(currentQuestion, 9)]}</p>

              <fieldset className={styles.scaleWrap} aria-label={SCALE_LABELS.join(". ")}>
                <legend className={styles.visuallyHidden}>Rate 1 to 5</legend>
                <div className={styles.scaleAndNav}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={currentValue === value ? styles.scaleBtnSelected : styles.scaleBtn}
                      onClick={() => handleScaleSelect(value)}
                      aria-pressed={currentValue === value}
                      aria-label={`${value}: ${value === 1 ? "Strongly disagree" : value === 2 ? "Disagree" : value === 3 ? "Neutral" : value === 4 ? "Agree" : "Strongly agree"}`}
                    >
                      {value}
                    </button>
                  ))}
                  {currentQuestion === 9 && (
                    <button
                      type="button"
                      className={styles.scaleBtnNext}
                      onClick={handleSubmitQuiz}
                      disabled={!allAnswered}
                      aria-label="See my results"
                      aria-disabled={!allAnswered}
                    >
                      Submit
                    </button>
                  )}
                </div>
                {currentQuestion > 0 && (
                  <button type="button" className={styles.backBtn} onClick={handleBack} aria-label="Previous question">
                    ← Back
                  </button>
                )}
                <p className={styles.scaleLegend}>{SCALE_LABELS.join(", ")}</p>
              </fieldset>
            </>
          )}

          {step === "email" && (
            <>
              <p className={styles.stepIndicator}>Almost there</p>
              <h1 className={styles.title}>Get your results</h1>
              <p className={styles.emailTease}>
                Your score is calculated. Fill in the details below to reveal your tier and recommendations.
              </p>
              <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
                <label htmlFor="scorecard-fullname" className={styles.fieldLabel}>
                  Full name <span className={styles.required}>*</span>
                </label>
                <input
                  id="scorecard-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Smith"
                  className={styles.emailInput}
                  autoComplete="name"
                  disabled={submitStatus === "loading"}
                  autoFocus
                />
                <label htmlFor="scorecard-company" className={styles.fieldLabel}>
                  Company name <span className={styles.required}>*</span>
                </label>
                <input
                  id="scorecard-company"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  className={styles.emailInput}
                  autoComplete="organization"
                  disabled={submitStatus === "loading"}
                />
                <label htmlFor="scorecard-email" className={styles.fieldLabel}>
                  Email address <span className={styles.required}>*</span>
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
                />
                {emailError && (
                  <p className={styles.error} role="alert">
                    {emailError}
                  </p>
                )}
                <div className={styles.emailActions}>
                  <button
                    type="submit"
                    className={styles.primaryBtn}
                    disabled={submitStatus === "loading"}
                  >
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
              <p className={styles.stepIndicator}>Results ready</p>
              <h1 className={styles.title}>Your score is ready</h1>
              <p className={styles.emailTease}>
                Your score is calculated. Enter email to reveal your tier and recommendations.
              </p>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => setStep("email")}
              >
                Enter email to see results
              </button>
              <div className={styles.navRow}>
                <Link href="/" className={styles.secondaryBtn}>
                  Back to home
                </Link>
              </div>
            </>
          )}

          {step === "results" && tier && (() => {
            const content = RESULT_CONTENT[tier]
            if (!content) return null
            const tierTheme = tier === "Defensible Bet" ? "green" : tier === "Partial Clarity" ? "amber" : "red"
            return (
              <div className={styles.resultFrame}>
                <div className={styles.result} data-tier={tierTheme}>
                  {/* 1. Score as primary signal */}
                  <div className={styles.resultScoreBlock}>
                    <p className={styles.resultScore}>
                      <span className={styles.resultScoreNum}>{totalScore}</span>
                      <span className={styles.resultScoreOf}>/50</span>
                    </p>
                  </div>

                  {/* 2. Tier badge */}
                  <header className={styles.resultHeader}>
                    <p className={styles.resultTierBadge}>
                      <span className={styles.resultTierEmoji} aria-hidden>{content.emoji}</span>
                      {tier}
                    </p>
                    <p className={styles.resultInterpretation}>{content.interpretation}</p>
                  </header>

                  {/* 3. What this means */}
                  <section className={styles.resultSection} aria-labelledby="result-means-heading">
                    <h2 id="result-means-heading" className={styles.resultSectionTitle}>What this means</h2>
                    <div className={styles.resultWhatThisMeansBlock}>
                      <p className={styles.resultWhatThisMeans}>{content.whatThisMeans}</p>
                    </div>
                  </section>

                  {/* 4. Strength vs risk */}
                  <section className={styles.resultSection} aria-labelledby="result-strengths-heading">
                    <h2 id="result-strengths-heading" className={styles.visuallyHidden}>Strengths and gaps</h2>
                    <div className={styles.resultCards}>
                      <div className={`${styles.resultCard} ${styles.resultCardWorking}`}>
                        <h3 className={styles.resultCardTitle}>What&apos;s working</h3>
                        <ul className={styles.resultList}>
                          {content.strengths.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={`${styles.resultCard} ${styles.resultCardRisky}`}>
                        <h3 className={styles.resultCardTitle}>What&apos;s risky</h3>
                        <ul className={styles.resultList}>
                          {content.risks.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* 5. Recommended next step CTA */}
                  <section className={styles.resultSection} aria-labelledby="result-next-heading">
                    <h2 id="result-next-heading" className={styles.resultSectionTitle}>Recommended next step</h2>
                    <div className={styles.resultCtaBlock}>
                      <a href={content.ctaHref} className={styles.resultCtaButton}>
                        {content.ctaButtonText}
                      </a>
                      <p className={styles.resultCtaSubtext}>{content.ctaSubtext}</p>
                    </div>
                  </section>

                  {/* 6. Exit paths (de-emphasized) */}
                  <footer className={styles.resultTrust}>
                    <p className={styles.resultTrustLine}>We&apos;ll email you a copy of your results.</p>
                    <p className={styles.resultTrustSecondary}>
                      <Link href="/#contact" className={styles.resultTrustLink}>Talk to us</Link>
                      {", "}
                      <Link href="/" className={styles.resultTrustLink}>Back to home</Link>
                    </p>
                  </footer>
                </div>
              </div>
            )
          })()}
        </div>
      </main>
    </div>
  )
}
