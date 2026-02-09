"use client"

import { useState } from "react"
import HomeJsonLd from "./components/HomeJsonLd"
import Header from "./components/Header"
import styles from "./page.module.css"

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

function isCompanyEmail(email) {
  if (!email || typeof email !== "string") return false
  const domain = email.trim().split("@")[1]?.toLowerCase()
  return domain && !DISALLOWED_EMAIL_DOMAINS.has(domain)
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function Home() {
  const [formState, setFormState] = useState("idle")
  const [formError, setFormError] = useState("")
  const [selectedService, setSelectedService] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const name = form.name.value?.trim() || ""
    const email = form.email.value?.trim() || ""
    const message = form.message.value?.trim() || ""
    const website = form.website?.value?.trim() || ""

    if (!name || !email || !message) {
      setFormState("error")
      setFormError("Name, email, and message are required.")
      return
    }

    if (!isCompanyEmail(email)) {
      setFormState("error")
      setFormError("Please use your company email address. Personal addresses (e.g. Gmail, Yahoo, Outlook) are not accepted.")
      return
    }

    setFormState("sending")
    setFormError("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website: website || undefined, service: selectedService }),
      })
      const data = await res.json()

      if (data.ok) {
        setFormState("sent")
        form.reset()
        setSelectedService(null)
        setFormError("")
      } else {
        setFormState("error")
        setFormError(data.error || "Something went wrong.")
      }
    } catch {
      setFormState("error")
      setFormError("Network error. Please try again.")
    }
  }

  function addService(name) {
    setSelectedService(name)
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <Header />

      <main id="main-content">
        <HomeJsonLd />
        {/* 01 Hero */}
        <section id="hero" className={styles.hero} aria-labelledby="hero-heading">
          <span className={styles.heroLabel} aria-hidden>01</span>

          <div className={styles.heroContent}>
            <h1 id="hero-heading" className={styles.heroTitle}>
              9/10 ideas don&apos;t pass the gate. <span className={styles.heroTitleNoBreak}>Does yours?</span>
            </h1>
            <p className={styles.heroNarrative}>
              For teams unsure what to build, we&apos;re a product and UX duo with 30+ years of experience across big tech and startups. We&apos;ll talk to your users and validate ideas early, so you focus on building what actually drives growth.
            </p>
            <div className={styles.heroCtas}>
              <a href="#contact" className={styles.ctaPrimary}>
                Book a 30-min Intro Call
              </a>
              <a href="/work" className={styles.ctaSecondary}>
                See our work
              </a>
            </div>
          </div>
        </section>

        {/* 02 Why work with us */}
        <section id="why-us" className={styles.whySection}>
          <span className={styles.sectionNum}>02</span>
          <h2 className={styles.whyTitle}>Why work with us?</h2>
          <p className={styles.whyLead}>
            Most discovery fails by leaning too far in one direction: strategy without user truth, or UX without hard decisions. We close that gap with a senior Product + UX partnership.
          </p>
          <div className={styles.whyProfiles}>
            <div className={styles.whyProfile}>
              <img src="/farabi.jpg" alt="" className={styles.whyProfilePic} width={160} height={160} />
              <div className={styles.whyProfileText}>
                <div className={styles.whyProfileNameRow}>
                  <strong className={styles.whyProfileName}>Farabi</strong>
                  <a href="https://www.linkedin.com/in/farabi/" target="_blank" rel="noopener noreferrer" className={styles.whyProfileLinkedIn} aria-label="Farabi on LinkedIn">
                    <LinkedInIcon />
                  </a>
                </div>
                <p className={styles.whyLead}>Brings battle-tested product judgment across prop tech, e-commerce, and marketplaces, where wrong bets are expensive and decisions must hold up at scale.</p>
              </div>
            </div>
            <div className={styles.whyProfile}>
              <img src="/umar.jpg" alt="" className={styles.whyProfilePic} width={160} height={160} />
              <div className={styles.whyProfileText}>
                <div className={styles.whyProfileNameRow}>
                  <strong className={styles.whyProfileName}>Umar</strong>
                  <a href="https://www.linkedin.com/in/umarsaeed28/" target="_blank" rel="noopener noreferrer" className={styles.whyProfileLinkedIn} aria-label="Umar on LinkedIn">
                    <LinkedInIcon />
                  </a>
                </div>
                <p className={styles.whyLead}>Brings seasoned UX and engineering leadership from consulting and in-house work across SaaS, mobile, and e-commerce, turning ambiguity into testable solutions and real user signal.</p>
              </div>
            </div>
          </div>
          <p className={`${styles.whyLead} ${styles.whyLogosHeader}`} style={{ marginTop: "3rem", marginBottom: "0.75rem" }}>Past teams and clients include</p>
          <div className={styles.companyLogos} aria-hidden>
            <span className={styles.companyLogoName}>Amazon</span>
            <span className={styles.companyLogoName}>Autodesk</span>
            <span className={styles.companyLogoName}>Zillow</span>
            <span className={styles.companyLogoName}>Chewy</span>
            <span className={styles.companyLogoName}>TikTok</span>
            <span className={styles.companyLogoName}>T-Mobile</span>
            <span className={styles.companyLogoName}>BlackBerry</span>
            <span className={styles.companyLogoName}>VMware</span>
            <span className={styles.companyLogoName}>ALLDATA</span>
            <span className={styles.companyLogoName}>Funko</span>
          </div>
        </section>

        {/* 03 What you get */}
        <section id="deliverables" className={styles.deliverablesSection} aria-labelledby="deliverables-heading">
          <span className={styles.sectionNum}>03</span>
          <h2 id="deliverables-heading" className={styles.sectionTitle}>What you get</h2>

          <div className={styles.deliverablesGrid}>
            <div className={styles.deliverableTile}>
              <span className={styles.deliverableLabel}>One-page Bet Sheet</span>
              <p className={styles.deliverableDesc}>Your goal → top 3 opportunities → recommended bets → 90-day outcomes. Cagan value and risk framing with clear success metrics.</p>
            </div>
            <div className={styles.deliverableTile}>
              <span className={styles.deliverableLabel}>Live Opportunity Solution Tree</span>
              <p className={styles.deliverableDesc}>Teresa Torres–style OST mapping outcome → opportunities → solutions. Includes evidence scores and verbatim quotes from user interviews.</p>
            </div>
            <div className={styles.deliverableTile}>
              <span className={styles.deliverableLabel}>User and UX foundation</span>
              <p className={styles.deliverableDesc}>2–3 proto-personas with UX needs. Critical journey map with pain-to-opportunity mapping. UX stakeholder feedback summary.</p>
            </div>
            <div className={styles.deliverableTile}>
              <span className={styles.deliverableLabel}>Competitive strategy</span>
              <p className={styles.deliverableDesc}>Gibson Biddle DHM matrix (Delight, Hard-to-copy, Margin). Your strategic positioning compared to key competitors.</p>
            </div>
            <div className={styles.deliverableTile}>
              <span className={styles.deliverableLabel}>Build-ready PRDs</span>
              <p className={styles.deliverableDesc}>1–2 Marty Cagan PRDs for top bets. Clear value proposition, risks, success criteria, and non-goals.</p>
            </div>
            <div className={styles.deliverableTile}>
              <span className={styles.deliverableLabel}>Now / Next / Later roadmap</span>
              <p className={styles.deliverableDesc}>Time-phased plan linking OST → PRDs → execution. Outcome metrics defined for each milestone.</p>
            </div>
            <div className={styles.deliverableTile}>
              <span className={styles.deliverableLabel}>Stakeholder alignment report</span>
              <p className={styles.deliverableDesc}>CTO, Sales, and Investor perspectives on your bets. Objections, counters, and a clear decision table.</p>
            </div>
          </div>
        </section>

        {/* 04 How it works — vertical timeline */}
        <section id="how-it-works" className={styles.processSection}>
          <span className={styles.sectionNum}>04</span>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>1</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Frame the bet</h3>
                <p className={styles.timelineDesc}>We lock the goal, success metrics, and decision criteria up front.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>2</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Find the signal</h3>
                <p className={styles.timelineDesc}>We talk to users when it reduces risk and turn insights into clear opportunities.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>3</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Decide what to build</h3>
                <p className={styles.timelineDesc}>We make tradeoffs, define the bets, and produce a build-ready backlog and flows.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>4</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Set you up to ship</h3>
                <p className={styles.timelineDesc}>You get clear decisions, design foundations, and everything your team needs to implement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 05 Solutions — three services */}
        <section id="services" className={styles.solutionsSection}>
          <span className={styles.sectionNum}>05</span>
          <h2 className={styles.solutionsTitle}>Services</h2>

          <article id="product-audit" className={styles.solutionBlock}>
            <span className={styles.solutionNum}>01</span>
            <h3 className={styles.solutionTitle}>Product Audit</h3>
            <p className={styles.solutionPrice}>$1,500 · Credit toward Discovery Program</p>
            <p className={styles.solutionWho}>Get a clear outside perspective before investing more time or money. We review your product, roadmap, and UX, identify real bottlenecks, and challenge key assumptions.</p>
            <h4 className={styles.blockLabel}>What you get</h4>
            <ul className={styles.bulletList}>
              <li>A one page executive summary with clear priorities</li>
              <li>A direct recommendation on what to fix, improve, or focus on next</li>
              <li>A follow up call to help you move forward with confidence</li>
            </ul>
            <button type="button" className={styles.addServiceBtn} onClick={() => addService("Product Audit")}>Add service</button>
          </article>

          <article className={`${styles.solutionBlock} ${styles.solutionBlockFlagship}`}>
            <span className={styles.flagshipBadge}>Flagship</span>
            <span className={styles.solutionNum}>02</span>
            <h3 className={styles.solutionTitle}>Discovery Program</h3>
            <p className={styles.solutionPrice}>$25,000 · Fixed scope · Outcome driven</p>
            <p className={styles.solutionWho}>For teams building or evolving a core product who need clarity and a real plan to build from, not another round of guessing.</p>
            <div className={styles.solutionGrid}>
              <div>
                <h4 className={styles.blockLabel}>How it works</h4>
                <ul className={styles.bulletList}>
                  <li>Outcomes, scope, and success metrics locked before we start</li>
                  <li>Real user research and opportunity mapping to surface what matters</li>
                  <li>Decisions documented clearly, with tradeoffs made explicit</li>
                  <li>Insights translated into build-ready product and UX artifacts</li>
                </ul>
              </div>
              <div>
                <h4 className={styles.blockLabel}>What you get</h4>
                <ul className={styles.bulletList}>
                  <li>One-page bet sheet and evidence-backed opportunity map</li>
                  <li>Build-ready PRDs and a prioritized backlog with acceptance criteria</li>
                  <li>User journeys, UX flows, and key screens for the critical path</li>
                  <li>Design foundations your team can extend with confidence</li>
                </ul>
              </div>
            </div>
            <button type="button" className={styles.addServiceBtn} onClick={() => addService("Discovery Program")}>Add service</button>
          </article>

          <article className={styles.solutionBlock}>
            <span className={styles.solutionNum}>03</span>
            <h3 className={styles.solutionTitle}>Add a Sprint</h3>
            <p className={styles.solutionPrice}>$6,200 · 1 sprint extension</p>
            <p className={styles.solutionWho}>Already with us, or need a few more sprints to close the loop? Same team, same context. We lock scope and finish what we started.</p>
            <div className={styles.solutionGrid}>
              <div>
                <h4 className={styles.blockLabel}>How it works</h4>
                <ul className={styles.bulletList}>
                  <li>Same team. No re-onboarding.</li>
                  <li>Scope agreed before kickoff. We close gaps, we don’t open new ones</li>
                </ul>
              </div>
              <div>
                <h4 className={styles.blockLabel}>What you get</h4>
                <ul className={styles.bulletList}>
                  <li>Extra flows, screens, or backlog items as agreed</li>
                  <li>Design system and docs updated so your team can take over</li>
                  <li>Handoff that doesn’t leave anyone guessing</li>
                </ul>
              </div>
            </div>
            <button type="button" className={styles.addServiceBtn} onClick={() => addService("Add a Sprint")}>Add service</button>
          </article>
        </section>

        {/* 06 FAQ */}
        <section id="faq" className={styles.section}>
          <div className={styles.card}>
            <span className={styles.sectionNum}>06</span>
            <h2 className={styles.sectionTitle}>FAQ</h2>
            <div className={styles.faq}>
              <details className={styles.faqItem} open>
                <summary>What do you deliver?</summary>
                <div className={styles.faqBody}>
                  Stuff your team can build from: a product brief, research synthesis, a prioritized backlog with acceptance criteria, UX flows, and design foundations. No “strategy deck” that dies in a folder.
                </div>
              </details>
              <details className={styles.faqItem} open>
                <summary>Who is this for?</summary>
                <div className={styles.faqBody}>
                  Founders and product teams who are stuck on what to build next, or need to de-risk before they build more.
                </div>
              </details>
              <details className={styles.faqItem} open>
                <summary>What problem do you actually solve?</summary>
                <div className={styles.faqBody}>
                  Too many ideas and opinions, not enough decisions. We help you get to a clear “what” and “why” so build can start (or stop) with confidence.
                </div>
              </details>
              <details className={styles.faqItem} open>
                <summary>How is this different from an agency or consultancy?</summary>
                <div className={styles.faqBody}>
                  We’re not optimizing for billable hours or a long report. We’re optimizing for decisions and something shippable. Fixed scope, capped sprints.
                </div>
              </details>
              <details className={styles.faqItem} open>
                <summary>Is this discovery, strategy, or execution?</summary>
                <div className={styles.faqBody}>
                  Discovery that turns into execution. Strategy only counts if it changes what gets built. We focus on that line.
                </div>
              </details>
              <details className={styles.faqShowAll}>
                <summary className={styles.faqShowAllSummary}>Show all FAQs</summary>
                <div className={styles.faqMore}>
                  <details className={styles.faqItem}>
                    <summary>How do you keep scope under control?</summary>
                    <div className={styles.faqBody}>
                      Outcomes locked up front. Sprints capped. Tradeoffs written down. If something new comes in, something else comes out.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What if priorities change mid-engagement?</summary>
                    <div className={styles.faqBody}>
                      We re-cut scope. We don’t extend the timeline.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>How fast do you work?</summary>
                    <div className={styles.faqBody}>
                      Most work runs 2 to 6 weeks. Fast because we’re focused, not because we’re cutting corners.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>Who will we work with?</summary>
                    <div className={styles.faqBody}>
                      A small senior team (product and UX) with 30+ years combined across product, design, and software. People who’ve shipped and who’ve failed.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>Do you work with existing teams or replace them?</summary>
                    <div className={styles.faqBody}>
                      Alongside. We’re here to unblock and accelerate, not to take over.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>Do you do user research?</summary>
                    <div className={styles.faqBody}>
                      When it reduces risk. We skip research that doesn’t lead to a decision.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>Will you talk to customers or users?</summary>
                    <div className={styles.faqBody}>
                      Yes, when it makes the next build decision clearer.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What if we already have a roadmap?</summary>
                    <div className={styles.faqBody}>
                      We pressure-test it. Reduce risk before you build more on top of it.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What if we already know what to build?</summary>
                    <div className={styles.faqBody}>
                      Then we help you confirm it, or surface the weak assumptions before you commit.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>How do you handle stakeholder disagreement?</summary>
                    <div className={styles.faqBody}>
                      We get it out in the open early. Then we use evidence and tradeoffs to resolve it, not politics.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What happens after the engagement?</summary>
                    <div className={styles.faqBody}>
                      You own it all. Backlog, designs, decisions, rationale. No lock-in. No retainer.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What&apos;s the biggest risk of working with you?</summary>
                    <div className={styles.faqBody}>
                      You’ll have to make decisions you’ve been putting off.
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What&apos;s the biggest risk of not working with you?</summary>
                    <div className={styles.faqBody}>
                      Building the wrong thing and feeling sure you’re right.
                    </div>
                  </details>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* 07 Contact */}
        <section id="contact" className={styles.contactSection}>
          <span className={styles.sectionNum}>07</span>
          <h2 className={styles.contactTitle}>Start the conversation</h2>
          <p className={styles.contactLead}>
            Tell us what you&apos;re building and where you&apos;re unsure. We&apos;ll review it and come back with a clear next step. No pitch. No runaround.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            {selectedService && (
              <div className={styles.selectedService}>
                <span>Inquiring about: <strong>{selectedService}</strong></span>
                <button type="button" className={styles.selectedServiceClear} onClick={() => setSelectedService(null)} aria-label="Remove service">×</button>
              </div>
            )}
            <label className={styles.label}>
              Name <span className={styles.required}>*</span>
              <input type="text" name="name" required className={styles.input} disabled={formState === "sending"} />
            </label>
            <label className={styles.label}>
              Email <span className={styles.required}>*</span>
              <input type="email" name="email" required placeholder="you@yourcompany.com" className={styles.input} disabled={formState === "sending"} />
            </label>
            <label className={styles.label}>
              Website
              <input type="url" name="website" placeholder="https://yourcompany.com" className={styles.input} disabled={formState === "sending"} />
            </label>
            <label className={styles.label}>
              Message <span className={styles.required}>*</span>
              <textarea name="message" rows={4} required placeholder="What are you building, and where's it stuck?" className={styles.textarea} disabled={formState === "sending"} />
            </label>
            {formState === "error" && <p className={styles.formError} role="alert">{formError}</p>}
            {formState === "sent" && <p className={styles.formSuccess}>Transaction successful.</p>}
            <button type="submit" className={styles.submit} disabled={formState === "sending"}>
              {formState === "sending" ? "Sending…" : "Let’s chat"}
            </button>
          </form>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <nav className={styles.footerNav} aria-label="Footer">
              <a href="#services">Services</a>
              <a href="#deliverables">What you get</a>
              <a href="#how-it-works">How it works</a>
              <a href="/work">Our work</a>
              <a href="/blog">Blog</a>
              <a href="#contact">Contact</a>
            </nav>
            <p className={styles.footerText}>shipgate. Product and UX discovery. Fixed scope, no scope creep.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
