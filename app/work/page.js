import Link from "next/link"
import Header from "../components/Header"
import styles from "../page.module.css"

export const metadata = {
  title: "Our work | shipgate",
  description:
    "Selected product and UX discovery work: case studies and outcomes from shipgate.",
  openGraph: {
    title: "Our work | shipgate",
    description: "Selected product and UX discovery work.",
    url: "/work",
  },
  alternates: { canonical: "/work" },
}

export default function WorkPage() {
  return (
    <>
      <Header />

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
                Book a 30-min Intro Call
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
              <a href="/#services">Services</a>
              <a href="/#faq">FAQ</a>
              <a href="/#contact">Contact</a>
            </nav>
            <p className={styles.footerText}>shipgate. Product and UX discovery studio.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
