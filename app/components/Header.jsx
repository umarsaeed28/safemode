"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import styles from "../page.module.css"

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#why-us", label: "Why us" },
  { href: "/work", label: "Work" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)

  function closeMenu() {
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) closeMenu()
    }
    function handleEscape(e) {
      if (e.key === "Escape") closeMenu()
    }
    document.addEventListener("click", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [menuOpen])

  return (
    <header className={styles.header}>
      <nav ref={navRef} className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Main">
        <Link href="/" className={styles.logo} aria-label="Safe Mode home" onClick={closeMenu}>
          Safe Mode
        </Link>

        <button
          type="button"
          className={styles.navBurger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className={styles.navBurgerBar} />
          <span className={styles.navBurgerBar} />
          <span className={styles.navBurgerBar} />
        </button>

        <ul
          id="main-nav"
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}
          role="navigation"
        >
          {links.map(({ href, label }) => (
            <li key={href}>
              {href.startsWith("/") && !href.startsWith("/#") ? (
                <Link href={href} onClick={closeMenu}>
                  {label}
                </Link>
              ) : (
                <a href={href} onClick={closeMenu}>
                  {label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
