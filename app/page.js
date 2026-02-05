"use client"

import { useState } from "react"
import HomeJsonLd from "./components/HomeJsonLd"
import styles from "./page.module.css"

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

    if (!name || !email || !message) {
      setFormState("error")
      setFormError("Please fill in all fields.")
      return
    }

    setFormState("sending")
    setFormError("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, service: selectedService }),
      })
      const data = await res.json()

      if (data.ok) {
        setFormState("sent")
        form.reset()
        setSelectedService(null)
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
      <header className={styles.header}>
        <nav className={styles.nav}>
          <a href="#" className={styles.logo}>
            Safe Mode
          </a>
          <ul className={styles.navLinks}>
            <li><a href="/#offerings">Offerings</a></li>
            <li><a href="/#why-us">Why us</a></li>
            <li><a href="/work">Work</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/#faq">FAQ</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main id="main-content">
        <HomeJsonLd />
        {/* 01 Hero */}
        <section id="hero" className={styles.hero} aria-labelledby="hero-heading">
          <span className={styles.heroLabel} aria-hidden>01</span>

          <div className={styles.heroContent}>
            <h1 id="hero-heading" className={styles.heroTitle}>
              9/10 ideas don&apos;t hold up. Let&apos;s check yours in <span className={styles.highlight}>Safe Mode</span>.
            </h1>
            <p className={styles.heroNarrative}>
              We run <span className={styles.highlight}>product discovery</span> and <span className={styles.highlight}>UX</span> when the stakes are high and the roadmap is fuzzy. No open-ended engagements. Fixed scope, capped sprints. You get decisions and a backlog your team can actually build from, not another deck that sits in a folder.
            </p>
            <div className={styles.heroCtas}>
              <a href="#contact" className={styles.ctaPrimary}>
                Start a conversation
              </a>
              <a href="/work" className={styles.ctaSecondary}>
                See our work
              </a>
            </div>
          </div>
        </section>

        {/* 02 Deliverables — narrative + Product & UX tiles */}
        <section id="deliverables" className={styles.deliverablesSection} aria-labelledby="deliverables-heading">
          <span className={styles.sectionNum}>02</span>
          <h2 id="deliverables-heading" className={styles.sectionTitle}>What you get</h2>
          <p className={styles.narrativeLead}>
            More opinions aren&apos;t the bottleneck. You need someone to make the call and hand over something your engineers can use.
          </p>
          <p className={styles.narrativeFollow}>
            That&apos;s what we do. Tradeoffs written down, scope locked. Artifacts that ship, not slides that sit in a folder.
          </p>

          <div className={styles.deliverablesGroup}>
            <h3 className={styles.deliverablesGroupTitle}>Product</h3>
            <div className={styles.deliverablesGrid}>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4h12l6 6v18H8V4z" /><path d="M20 4v6h6" /></svg>
                </span>
                <span className={styles.deliverableLabel}>Product brief</span>
              </div>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="14" r="8" /><path d="M10 22a6 6 0 0 1 12 0" /><path d="M16 10v2M14 14h4" /></svg>
                </span>
                <span className={styles.deliverableLabel}>Problem statement and JTBD</span>
              </div>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h20M6 14h20M6 20h14" /></svg>
                </span>
                <span className={styles.deliverableLabel}>PRD</span>
              </div>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h24v4H4zM4 14h24v4H4zM4 22h16v4H4z" /></svg>
                </span>
                <span className={styles.deliverableLabel}>Prioritized backlog</span>
              </div>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 24l8-8 8 8M16 16V8" /><path d="M4 28h24" /></svg>
                </span>
                <span className={styles.deliverableLabel}>MVP scope and tradeoffs</span>
              </div>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 24V8l12 8 12-8v16" /><path d="M4 16l12 8 12-8" /></svg>
                </span>
                <span className={styles.deliverableLabel}>Success metrics</span>
              </div>
            </div>
          </div>

          <div className={styles.deliverablesGroup}>
            <h3 className={styles.deliverablesGroupTitle}>UX</h3>
            <div className={styles.deliverablesGrid}>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="14" cy="14" r="6" /><path d="M20 20l4 4" /></svg>
                </span>
                <span className={styles.deliverableLabel}>Research insights summary</span>
              </div>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="10" r="4" /><path d="M8 28c0-4 4-8 8-8s8 4 8 8" /></svg>
                </span>
                <span className={styles.deliverableLabel}>Personas or proto-personas</span>
              </div>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16h6l4-8 4 12 4-4h6" /></svg>
                </span>
                <span className={styles.deliverableLabel}>User journeys</span>
              </div>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="24" height="20" rx="1" /><path d="M4 12h24M10 12v14" /></svg>
                </span>
                <span className={styles.deliverableLabel}>Wireframes</span>
              </div>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="24" height="24" rx="2" /><path d="M4 12h24M12 4v24" /></svg>
                </span>
                <span className={styles.deliverableLabel}>High-fidelity designs</span>
              </div>
              <div className={styles.deliverableTile}>
                <span className={styles.deliverableIcon} aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h10v10H4zM18 4h10v10H18zM4 18h10v10H4zM18 18h10v10H18z" /></svg>
                </span>
                <span className={styles.deliverableLabel}>Design system foundations</span>
              </div>
            </div>
          </div>
        </section>

        {/* 03 Why work with us + Our process */}
        <section id="why-us" className={styles.whySection}>
          <span className={styles.sectionNum}>03</span>
          <h2 className={styles.whyTitle}>Why work with us</h2>
          <p className={styles.whyLead}>
            Most workshops end in more options. We&apos;re built to end in decisions. That means killing weak ideas early and making tradeoffs most teams duck. You walk out with something your team can ship, not another deck.
          </p>
          <p className={styles.whyLead} style={{ marginTop: "1rem" }}>
            30+ years in product, UX, and software. We&apos;ve shipped and we&apos;ve failed. That experience comes from real teams:
          </p>
          <ul className={styles.whyBulletList}>
            <li aria-hidden>Past teams and clients include</li>
          </ul>
          <div className={styles.companyLogos}>
            <span className={styles.companyLogoName}>Amazon</span>
            <span className={styles.companyLogoName}>Autodesk</span>
            <span className={styles.companyLogoName}>Zillow</span>
            <span className={styles.companyLogoName}>Chewy</span>
            <span className={styles.companyLogoName}>TikTok</span>
            <span className={styles.companyLogoName}>T-Mobile</span>
            <span className={styles.companyLogoName}>BlackBerry</span>
            <span className={styles.companyLogoName}>VMware</span>
          </div>
          <a href="#how-it-works" className={styles.processBtn}>Our process</a>
        </section>

        {/* 04 How it works */}
        <section id="how-it-works" className={styles.processSection}>
          <span className={styles.sectionNum}>04</span>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <ol className={styles.steps}>
            <li>
              <span className={styles.stepNum}>1</span>
              <div>
                <strong>Kickoff and alignment.</strong> Scope, outcomes, and success metrics get locked up front. You get a brief; we agree what “done” means. No drift.
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <div>
                <strong>Research and synthesis.</strong> We talk to users (when it reduces risk), then turn what we learn into a decision log and prioritized opportunities, not a report that sits in a drawer.
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>3</span>
              <div>
                <strong>Backlog and flows.</strong> Groomed backlog with acceptance criteria. UX flows and key screens for what actually moves the needle.
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>4</span>
              <div>
                <strong>Handoff.</strong> Design foundations and docs your team can build on. You’re ready to implement. No “what do we do next?” hangover.
              </div>
            </li>
          </ol>
        </section>

        {/* 05 Solutions — three offerings */}
        <section id="offerings" className={styles.solutionsSection}>
          <span className={styles.sectionNum}>05</span>
          <h2 className={styles.solutionsTitle}>Offerings</h2>

          <article className={styles.solutionBlock}>
            <span className={styles.solutionNum}>01</span>
            <h3 className={styles.solutionTitle}>Product &amp; UX Audit</h3>
            <p className={styles.solutionPrice}>$525 · 90-minute senior review</p>
            <p className={styles.solutionWho}>Founders and product leads who want a straight read before committing more time or budget to build.</p>
            <div className={styles.solutionGrid}>
              <div>
                <h4 className={styles.blockLabel}>How it works</h4>
                <ul className={styles.bulletList}>
                  <li>Your product, roadmap, and UX reviewed against your business goals</li>
                  <li>We find the real bottleneck, not the obvious one</li>
                  <li>Assumptions pressure-tested; trade-offs called out in plain language</li>
                  <li>One clear recommendation: quick wins, a sprint, or deeper discovery</li>
                </ul>
              </div>
              <div>
                <h4 className={styles.blockLabel}>What you get</h4>
                <ul className={styles.bulletList}>
                  <li>One-page executive audit with priorities you can act on</li>
                  <li>Recommendation you can take to the team or the board</li>
                  <li>Follow-up call so decisions don’t stall</li>
                </ul>
              </div>
            </div>
            <a href="#contact" className={styles.addServiceBtn} onClick={(e) => { e.preventDefault(); addService("Product & UX Audit"); }}>Add service</a>
          </article>

          <article className={`${styles.solutionBlock} ${styles.solutionBlockFlagship}`}>
            <span className={styles.flagshipBadge}>Flagship</span>
            <span className={styles.solutionNum}>02</span>
            <h3 className={styles.solutionTitle}>Discovery Program</h3>
            <p className={styles.solutionPrice}>$18,500 · 3 sprints · fixed scope</p>
            <p className={styles.solutionWho}>Teams building or evolving a core product. You need clarity and something to build, not another round of guesses.</p>
            <div className={styles.solutionGrid}>
              <div>
                <h4 className={styles.blockLabel}>How it works</h4>
                <ul className={styles.bulletList}>
                  <li>Scope, success criteria, and constraints locked before we start</li>
                  <li>Focused research, then we document decisions, not opinions</li>
                  <li>Insights become a backlog your engineers can pick up</li>
                  <li>Design only where it moves the product. No filler.</li>
                </ul>
              </div>
              <div>
                <h4 className={styles.blockLabel}>What you get</h4>
                <ul className={styles.bulletList}>
                  <li>Ship-ready backlog with acceptance criteria</li>
                  <li>Research synthesis and a decision log so everyone’s aligned</li>
                  <li>UX flows and key screens for the critical path</li>
                  <li>Design foundations your team can extend. No black box.</li>
                </ul>
              </div>
            </div>
            <a href="#contact" className={styles.addServiceBtn} onClick={(e) => { e.preventDefault(); addService("Discovery Program"); }}>Add service</a>
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
            <a href="#contact" className={styles.addServiceBtn} onClick={(e) => { e.preventDefault(); addService("Add a Sprint"); }}>Add service</a>
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
          <h2 className={styles.contactTitle}>Send one note.</h2>
          <p className={styles.contactLead}>
            What are you building, and where’s it stuck? Send that. We’ll come back with a clear next step. No pitch, no runaround.
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
              <input type="email" name="email" required className={styles.input} disabled={formState === "sending"} />
            </label>
            <label className={styles.label}>
              Message <span className={styles.required}>*</span>
              <textarea name="message" rows={4} required className={styles.textarea} disabled={formState === "sending"} />
            </label>
            {formState === "error" && <p className={styles.formError} role="alert">{formError}</p>}
            {formState === "sent" && <p className={styles.formSuccess}>Message sent. We’ll get back to you soon.</p>}
            <button type="submit" className={styles.submit} disabled={formState === "sending"}>
              {formState === "sending" ? "Sending…" : "Let’s chat"}
            </button>
          </form>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <nav className={styles.footerNav} aria-label="Footer">
              <a href="#offerings">Offerings</a>
              <a href="#deliverables">What you get</a>
              <a href="#why-us">Why us</a>
              <a href="#how-it-works">How it works</a>
              <a href="/work">Our work</a>
              <a href="/blog">Blog</a>
              <a href="#contact">Contact</a>
            </nav>
            <p className={styles.footerText}>Safe Mode. Product and UX discovery. Fixed scope, no scope creep.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
