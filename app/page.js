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
                Stop guessing what to build.
              </h1>
              <p className={styles.heroNarrative}>
                We help product teams validate the bet before engineering starts. In 6 weeks, you&apos;ll know exactly what to build and why, backed by real user evidence, not opinions.
              </p>
              <div className={styles.heroCtas}>
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
                  Book a 30-Minute Intro Call
                </a>
                <a href="/scorecard" className={styles.heroTextLink}>
                  Take the Discovery Scorecard →
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

        {/* 02 How it works */}
        <section id="how-it-works" className={styles.processSection}>
          <span className={styles.sectionNum}>02</span>
          <h2 className={styles.sectionTitle}>Six weeks. One decision.</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>🗳️</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Weeks 1–2: We talk to your users.</h3>
                <p className={styles.timelineDesc}>We run 6-8 interviews independently to understand real pain, not to confirm what you already believe.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>📐</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Weeks 3–4: We prototype the top bet.</h3>
                <p className={styles.timelineDesc}>We narrow to 1-2 opportunities, build a clickable concept, and test it with the same users.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <span className={styles.timelineDot}>🎯</span>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Weeks 5-6: You get The Build Case.</h3>
                <p className={styles.timelineDesc}>What to build, why, the evidence, and the risks. We present it live and defend it with you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 What this looks like in practice */}
        <section id="in-practice" className={styles.practiceSection} aria-labelledby="practice-heading">
          <span className={styles.sectionNum}>03</span>
          <h2 id="practice-heading" className={styles.sectionTitle}>What this looks like in practice</h2>
          <div className={styles.practiceGrid}>
            <div className={styles.practiceCard}>
              <strong className={styles.practiceClient}>ALLDATA</strong>
              <p className={styles.practiceQuote}>Mechanics wouldn&apos;t use the app. Adoption was near zero. We went into the field and watched them work. The blocker wasn&apos;t the product — it was gloves. Touch navigation didn&apos;t work with heavy-duty gloves. We redesigned for glove-friendly use. Adoption went from near zero to 20%+ in three months.</p>
            </div>
            <div className={styles.practiceCard}>
              <strong className={styles.practiceClient}>ClearCapital</strong>
              <p className={styles.practiceQuote}>Underwriters were stalling on calls. Nobody could figure out why. We sat with them and watched. The data they needed was buried across multiple screens. We redesigned the view into a single visual snapshot. Adoption jumped 130%.</p>
            </div>
            <div className={styles.practiceCard}>
              <strong className={styles.practiceClient}>Amazon</strong>
              <p className={styles.practiceQuote}>Leadership was convinced the checkout flow was fine. It wasn&apos;t. User research revealed a deeply held assumption was driving large-scale abandonment. We ran controlled experiments to prove it. 15% revenue lift post launch. Millions in contribution profit protected.</p>
            </div>
          </div>
        </section>

        {/* 04 Why work with us */}
        <section id="why-us" className={styles.whySection}>
          <span className={styles.sectionNum}>04</span>
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
          <span className={styles.sectionNum} aria-hidden>05</span>
          <h2 id="services-heading" className={styles.solutionsTitle}>Services</h2>

          {/* The Build Case */}
          <article id="build-case" className={`${styles.serviceBlock} ${styles.serviceBlockFlagship} ${styles.buildCaseTile}`}>
            <header className={styles.buildCaseHeader}>
              <div className={styles.buildCaseTitleRow}>
                <h3 className={styles.buildCaseTitle}>The Build Case</h3>
              </div>
              <p className={styles.buildCasePrice} aria-label="Price and duration">$20K · 6 weeks</p>
            </header>

            <div className={styles.buildCaseValueProp}>
              <p>Every sprint spent on the wrong thing costs $150-300K. 75% of venture-backed startups fail, 42% because they built something nobody wanted. The Build Case gives you a defensible go/no-go decision in 6 weeks.</p>
            </div>

            <div className={styles.buildCaseDeliverables}>
              <h4 className={styles.buildCaseDeliverablesHeading}>You walk away with</h4>
              <ul className={styles.buildCaseDeliverablesList}>
                <li><strong>The Bet:</strong> what to build and why</li>
                <li><strong>User Evidence:</strong> quotes, patterns, qualitative &amp; quantitative research, prototype and feedback from real user tests.</li>
                <li><strong>Risks Analysis:</strong> what could go wrong and what assumptions must hold</li>
                <li><strong>Market Context:</strong> competitive landscape and where the opportunity sits</li>
                <li><strong>Technical Feasibility:</strong> what&apos;s buildable, what&apos;s hard and difficult vs low hanging fruit.</li>
                <li><strong>What Was Killed:</strong> Ideas that didn&apos;t survive the evidence, so your team stops relitigating</li>
              </ul>
              <p className={styles.buildCaseDeliverablesNote}>Delivered via live walkthrough. We present, defend, and pressure test with your team.</p>
            </div>

            <blockquote className={styles.buildCaseTaglineBlock}>
              This is not a strategy deck. It&apos;s a build decision.
            </blockquote>

            <div className={styles.buildCaseCtaGroup}>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.serviceCta}>Book a 30-Minute Intro Call</a>
              <Link href="/scorecard" className={styles.serviceCtaSecondary}>Not sure? Take the Discovery Scorecard</Link>
            </div>
          </article>

          {/* Advisory */}
          <article id="advisory" className={`${styles.serviceBlock} ${styles.advisoryTile}`}>
            <header className={styles.advisoryHeader}>
              <h3 className={styles.advisoryTitle}>Advisory</h3>
              <p className={styles.advisoryPrice} aria-label="Price">$3K/mo</p>
            </header>

            <div className={styles.advisoryValueProp}>
              <p>Already in motion? We stay on as a sounding board. Weekly call, async access, senior product judgment when the stakes are real. Available after completing The Build Case or by fit.</p>
            </div>

            <div className={styles.advisoryCtaGroup}>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.serviceCta}>Discuss Advisory</a>
            </div>
          </article>
        </section>

        {/* 06 FAQ */}
        <section id="faq" className={styles.section}>
          <div className={styles.card}>
            <span className={styles.sectionNum}>06</span>
            <h2 className={styles.sectionTitle}>FAQs</h2>
            <div className={styles.faq}>
              <details className={styles.faqItem}>
                <summary>What do we get?</summary>
                <div className={styles.faqBody}>
                  <p>The Build Case: a single document with a clear build decision, user evidence, a tested prototype, risk assessment, and a 90-day execution plan. No strategy decks. No ambiguity.</p>
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary>How long does it take?</summary>
                <div className={styles.faqBody}>
                  <p>Six weeks, fixed scope.</p>
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary>What if we already know what to build?</summary>
                <div className={styles.faqBody}>
                  <p>Then we validate the bet or kill it quickly. Confidence is only useful if it&apos;s earned.</p>
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary>What happens after?</summary>
                <div className={styles.faqBody}>
                  <p>You keep everything. The decisions, evidence, and prototype are yours. No dependency on us. Advisory is available if you want ongoing support.</p>
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary>How are you different?</summary>
                <div className={styles.faqBody}>
                  <p>Most consultants give you a strategy deck. Most agencies give you a UX audit. We give you a tested prototype and a build decision backed by real user evidence. You&apos;ll watch your users react before you write a line of code. Nobody else does that in 6 weeks for this price.</p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* 08 Contact */}
        <section id="contact" className={styles.contactSection}>
          <span className={styles.sectionNum}>08</span>
          <h2 className={styles.contactTitle}>Start the conversation</h2>
          <p className={styles.contactLead}>
            Tell us what you&apos;re building. In 30 minutes we&apos;ll tell you if The Build Case is the right move, or if you don&apos;t need us.
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
            <p className={styles.footerText}>We tell you what to build. Then we prove it.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
