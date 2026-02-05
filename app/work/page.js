import Link from "next/link"
import styles from "../page.module.css"

export const metadata = {
  title: "Our work | Safe Mode",
  description:
    "Selected product and UX discovery work: case studies and outcomes from Safe Mode.",
  openGraph: {
    title: "Our work | Safe Mode",
    description: "Selected product and UX discovery work.",
    url: "/work",
  },
  alternates: { canonical: "/work" },
}

export default function WorkPage() {
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            Safe Mode
          </Link>
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

      <main id="main-content" role="main">
        <section className={styles.hero} style={{ paddingBottom: "clamp(4rem, 10vw, 6rem)" }} aria-labelledby="work-heading">
          <div className={styles.heroContent}>
            <h1 id="work-heading" className={styles.heroTitle}>
              Our work
            </h1>
            <p className={styles.heroNarrative}>
              Product and UX discovery that led to clear decisions and shippable direction. Selected outcomes and case studies.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/#contact" className={styles.ctaPrimary}>
                Start a conversation
              </Link>
              <Link href="/" className={styles.ctaSecondary}>
                Back to home
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section} style={{ maxWidth: "var(--section-max)", margin: "0 auto", padding: "var(--section-padding-y) var(--section-padding-x)" }}>
          <div className={styles.card} style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <p className={styles.whyBody} style={{ margin: 0 }}>
              Case studies and project highlights will go here.
            </p>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <nav className={styles.footerNav}>
              <a href="/#offerings">Offerings</a>
              <a href="/#deliverables">Deliverables</a>
              <a href="/#why-us">Why us</a>
              <a href="/#how-it-works">How it works</a>
              <a href="/work">Work</a>
              <a href="/#contact">Contact</a>
            </nav>
            <p className={styles.footerText}>Safe Mode. Product and UX discovery studio.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
