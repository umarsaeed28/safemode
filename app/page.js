"use client"

import Link from "next/link"
import HomeJsonLd from "./components/HomeJsonLd"
import Header from "./components/Header"
import styles from "./page.module.css"

const CALENDLY_URL = "https://calendly.com/farabi-hassan-fh/30min"

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function Home() {
  return (
    <>
      <Header />

      <main id="main-content">
        <HomeJsonLd />
        {/* 01 Hero */}
        <section id="hero" className={styles.hero} aria-labelledby="hero-heading">
          <span className={styles.heroLabel} aria-hidden>01</span>

          <div className={styles.heroLayout}>
            <div className={styles.heroContent}>
              <h1 id="hero-heading" className={styles.heroTitle}>
                9/10 ideas don&apos;t pass the gate. <span className={styles.heroTitleNoBreak}>Does yours?</span>
              </h1>
              <p className={styles.heroNarrative}>
                For teams unsure what to build, we&apos;re a product and UX duo with 30+ years of experience across big tech and startups. We&apos;ll talk to your users and validate ideas early, so you focus on building what actually drives growth.
              </p>
              <div className={styles.heroCtas}>
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
                  Book a 30-Minute Intro Call
                </a>
                <a href="/scorecard" className={styles.ctaSecondary}>
                  Take the Discovery Scorecard
                </a>
              </div>
            </div>
            <figure className={styles.heroIllustration} aria-hidden>
              <img
                src="/hero-illustration.png"
                alt=""
                width={560}
                height={360}
                className={styles.heroIllustrationImg}
              />
            </figure>
          </div>
        </section>

        {/* 02 How it works, vertical timeline */}
        <section id="how-it-works" className={styles.processSection}>
          <span className={styles.sectionNum}>02</span>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>📋</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Frame the bet</h3>
                <p className={styles.timelineDesc}>We lock the goal, success metrics, and decision criteria up front.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>📡</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Find the signal</h3>
                <p className={styles.timelineDesc}>We talk to users when it reduces risk and turn insights into clear opportunities.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>🎯</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Decide what to build</h3>
                <p className={styles.timelineDesc}>We make tradeoffs, define the bets, and produce a build-ready backlog and flows.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>🚢</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Set you up to ship</h3>
                <p className={styles.timelineDesc}>You get clear decisions, design foundations, and everything your team needs to implement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 Why work with us */}
        <section id="why-us" className={styles.whySection}>
          <span className={styles.sectionNum}>03</span>
          <h2 className={styles.whyTitle}>Why work with us?</h2>
          <p className={styles.whyLead}>
            Most discovery fails by leaning too far in one direction: strategy without user truth, or UX without hard decisions. We close that gap by bringing a full product skill set under one roof: product leadership, user research, UX, and engineering working together from day one.
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
                <p className={styles.whyLead}>Product leadership with deep experience in marketplaces, CRM, prop tech, and e-commerce at scale.</p>
                <p className={styles.whyLead}>Owns problem definition, business context, metrics, and executive tradeoffs so decisions hold up when real money and teams are involved.</p>
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
                <p className={styles.whyLead}>A full stack product builder spanning research, UX, prototyping, engineering partnership, and quality.</p>
                <p className={styles.whyLead}>Turns ambiguity into testable solutions, validates them with real users, and ensures what gets proposed is actually buildable and sound.</p>
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

        {/* 04 Services, 3-step decision ladder */}
        <section id="services" className={styles.solutionsSection} aria-labelledby="services-heading">
          <span className={styles.sectionNum} aria-hidden>04</span>
          <h2 id="services-heading" className={styles.solutionsTitle}>Services</h2>

          {/* SERVICE 1 FREE */}
          <article id="discovery-scorecard" className={styles.serviceBlock}>
            <span className={styles.serviceBadge}>Free</span>
            <h3 className={styles.serviceTitle}>Start With the Discovery Scorecard (Free)</h3>
            <p className={styles.serviceSubhead}>Are You Ready to Build, or About to Guess?</p>
            <div className={styles.serviceBody}>
              <p>Most teams don&apos;t fail because they lack ideas.</p>
              <p>They fail because they commit engineering time before the bet is clear.</p>
              <p>The Discovery Scorecard is a short self-assessment that shows whether your team is:</p>
              <ul className={styles.serviceBodyList}>
                <li>guessing,</li>
                <li>partially aligned, or</li>
                <li>truly ready to ship.</li>
              </ul>
              <p>It takes a few minutes.</p>
              <p>The result is blunt.</p>
            </div>
            <Link href="/scorecard" className={styles.serviceCta}>
              Take the Discovery Scorecard
            </Link>
          </article>

          {/* SERVICE 2 FLAGSHIP */}
          <article id="discovery-program" className={`${styles.serviceBlock} ${styles.serviceBlockFlagship}`}>
            <span className={styles.flagshipBadge}>Flagship Engagement</span>
            <h3 className={styles.serviceTitle}>Discovery Program</h3>
            <p className={styles.serviceSubhead}>Make the Bet Defensible</p>
            <p className={styles.servicePrice}>$25,000</p>
            <div className={styles.serviceBody}>
              <p>For teams building or evolving a core product who need clarity, not another round of guessing.</p>
              <p>This is a fixed-scope, outcome-driven discovery engagement that turns ambiguity into clear bets your team can execute with confidence.</p>
              <p>This is not a UX review or a roadmap critique.</p>
              <p>It&apos;s decision work.</p>
            </div>
            <details className={styles.deliverablesDetails}>
              <summary className={styles.deliverablesHeading}>
                <span className={styles.deliverablesHeadingText}>What You Get</span>
                <span className={styles.deliverablesHeadingHint} aria-hidden>Show 7 deliverables</span>
              </summary>
              <ul className={styles.deliverablesList}>
              <li className={styles.deliverableItem}>
                <span className={styles.deliverableTitle}>One-Page Bet Sheet</span>
                <span className={styles.deliverableDesc}>Your goal → top 3 opportunities → recommended bets → 90-day outcomes. Value and risk framed explicitly, with clear success metrics.</span>
              </li>
              <li className={styles.deliverableItem}>
                <span className={styles.deliverableTitle}>Live Opportunity Solution Tree</span>
                <span className={styles.deliverableDesc}>Outcome → opportunities → solutions, mapped end-to-end. Evidence-scored and grounded in real user quotes.</span>
              </li>
              <li className={styles.deliverableItem}>
                <span className={styles.deliverableTitle}>User &amp; UX Foundation</span>
                <span className={styles.deliverableDesc}>2 to 3 proto-personas with concrete UX needs. Critical journey mapped from pain → opportunity. UX stakeholder feedback summary.</span>
              </li>
              <li className={styles.deliverableItem}>
                <span className={styles.deliverableTitle}>Competitive Strategy</span>
                <span className={styles.deliverableDesc}>Delight / Hard-to-copy / Margin matrix. Clear positioning against real competitors — not slideware.</span>
              </li>
              <li className={styles.deliverableItem}>
                <span className={styles.deliverableTitle}>Build-Ready PRDs</span>
                <span className={styles.deliverableDesc}>1 to 2 PRDs for the highest-confidence bets. Clear value proposition, risks, success criteria, and non-goals.</span>
              </li>
              <li className={styles.deliverableItem}>
                <span className={styles.deliverableTitle}>Now / Next / Later Roadmap</span>
                <span className={styles.deliverableDesc}>Time-phased plan linking opportunities → PRDs → execution. Outcome metrics defined at every stage.</span>
              </li>
              <li className={styles.deliverableItem}>
                <span className={styles.deliverableTitle}>Stakeholder Alignment Report</span>
                <span className={styles.deliverableDesc}>Simulated CTO, Sales, and Investor perspectives captured explicitly. Objections, counters, and a clear decision table.</span>
              </li>
            </ul>
            </details>
            <a href="/#contact" className={styles.serviceCta}>Discuss the Discovery Program</a>
          </article>

          {/* SERVICE 3 — ADVISORY */}
          <article id="advisory" className={styles.serviceBlock}>
            <h3 className={styles.serviceTitle}>Advisory</h3>
            <p className={styles.serviceSubhead}>Senior product judgment when the cost of being wrong is real.</p>
            <p className={styles.servicePrice}>$2,500/month</p>
            <div className={styles.serviceBody}>
              <p>Ongoing product judgment for teams already in motion.</p>
              <p>Advisory is for founders and product leaders who have clarity on what they&apos;re building and want senior product judgment as high-stakes decisions arise.</p>
              <p>This is not discovery work and not a review.</p>
              <p>It&apos;s decision support.</p>
            </div>
            <div className={styles.availabilityNote}>
              <p>Advisory is typically offered:</p>
              <ul>
                <li>after completing the Discovery Program, or</li>
                <li>to founders with clear direction and momentum.</li>
              </ul>
              <p>Availability is limited.</p>
            </div>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.serviceCta}>Discuss Advisory</a>
          </article>
        </section>

        {/* 06 FAQ */}
        <section id="faq" className={styles.section}>
          <div className={styles.card}>
            <span className={styles.sectionNum}>06</span>
            <h2 className={styles.sectionTitle}>FAQs</h2>
            <div className={styles.faq}>
              <details className={styles.faqItem} open>
                <summary>What do you deliver</summary>
                <div className={styles.faqBody}>
                  <p>Decision confidence your team can act on, delivered through shippable artifacts. This includes a clear product brief, research synthesis, a prioritized backlog with acceptance criteria, UX flows, and design foundations. No strategy decks. No ambiguity.</p>
                </div>
              </details>
              <details className={styles.faqItem} open>
                <summary>Who is this for</summary>
                <div className={styles.faqBody}>
                  <p>Founders and product teams who are unsure what to build next, or who want to reduce risk before committing more engineering time.</p>
                </div>
              </details>
              <details className={styles.faqItem} open>
                <summary>What problem do you solve</summary>
                <div className={styles.faqBody}>
                  <p>Too many ideas and opinions. Not enough certainty.</p>
                  <p>We help teams make clear decisions about what to build or not build, so work starts or stops without second guessing.</p>
                </div>
              </details>
              <details className={styles.faqShowAll}>
                <summary className={styles.faqShowAllSummary}>Show all FAQs</summary>
                <div className={styles.faqMore}>
                  <details className={styles.faqItem}>
                    <summary>How are you different from agencies or consultants</summary>
                    <div className={styles.faqBody}>
                      <p>We optimize for decisions and build ready output, not billable hours or long reports. Scope is fixed. Sprints are capped. Tradeoffs are explicit.</p>
                      <p>Hiring a senior PM and UX designer duo costs roughly 500K per year plus ramp time. We deliver clear bets and build ready output in weeks.</p>
                      <p>Agencies optimize for hours. We optimize for decisions.</p>
                      <p>AI tools document your thinking. We challenge it.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>Is this discovery, strategy, or execution</summary>
                    <div className={styles.faqBody}>
                      <p>It is discovery that turns directly into execution.</p>
                      <p>Strategy only matters if it results in a defensible bet your team can act on.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>How does the Discovery Scorecard fit in</summary>
                    <div className={styles.faqBody}>
                      <p>The Discovery Scorecard is a free readiness check. It helps teams understand whether they are guessing, partially aligned, or truly ready to ship before investing more time or money.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What is the difference between the Scorecard and the Discovery Program</summary>
                    <div className={styles.faqBody}>
                      <p>The Scorecard shows where you stand.</p>
                      <p>The Discovery Program shows exactly what to do next and why, with evidence and build ready artifacts.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>How long does the Discovery Program take</summary>
                    <div className={styles.faqBody}>
                      <p>Engagements are time boxed and outcome driven. Most teams complete the program in a few weeks, not months.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>Do you talk to real users</summary>
                    <div className={styles.faqBody}>
                      <p>Yes, when it reduces risk. We talk directly to users to replace assumptions with evidence, but we do not run research for the sake of it.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What if we already have a roadmap</summary>
                    <div className={styles.faqBody}>
                      <p>We pressure test it. If it holds up, great. If it does not, we surface the risks early before engineering time is wasted.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What if we already know what we want to build</summary>
                    <div className={styles.faqBody}>
                      <p>Then we help you validate the bet or kill it quickly. Confidence is only useful if it is earned.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What happens after the engagement</summary>
                    <div className={styles.faqBody}>
                      <p>You keep everything. The backlog, decisions, rationale, and design foundations are yours to build on without dependency on us.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>Do you offer ongoing support</summary>
                    <div className={styles.faqBody}>
                      <p>Yes. Advisory is available for teams who have clarity and want senior product judgment as high stakes decisions come up. Availability is limited.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What is the biggest risk of working with you</summary>
                    <div className={styles.faqBody}>
                      <p>You will be forced to make real decisions and let go of ideas that do not hold up.</p>
                    </div>
                  </details>
                  <details className={styles.faqItem}>
                    <summary>What is the biggest risk of not working with you</summary>
                    <div className={styles.faqBody}>
                      <p>Building the wrong thing with confidence and realizing it too late.</p>
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
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
            Book a 30-Minute Intro Call
          </a>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <nav className={styles.footerNav} aria-label="Footer">
              <a href="#services">Services</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
            </nav>
            <p className={styles.footerText}>shipgate. Product and UX discovery. Fixed scope, no scope creep.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
