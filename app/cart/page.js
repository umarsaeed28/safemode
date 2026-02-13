"use client"

import Link from "next/link"
import { useCart } from "../context/CartContext"
import styles from "../page.module.css"
import cartStyles from "./cart.module.css"

export default function CartPage() {
  const { cart, removeItemAt } = useCart()
  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            shipgate
          </Link>
          <div className={styles.navRight}>
            <ul className={styles.navLinks}>
              <li><Link href="/#offerings">Offerings</Link></li>
              <li><Link href="/#why-us">Why us</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
            <Link href="/cart" className={styles.cartIcon} aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cart.length > 0 && <span className={cartStyles.badge}>{cart.length}</span>}
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content" className={cartStyles.main}>
        <div className={cartStyles.wrapper}>
          <h1 className={cartStyles.title}>Your cart</h1>

          {cart.length === 0 ? (
            <p className={cartStyles.empty}>Your cart is empty.</p>
          ) : (
            <>
              <ul className={cartStyles.list}>
                {cart.map((item, index) => (
                  <li key={`${item.id}-${index}`} className={cartStyles.item}>
                    <div>
                      <span className={cartStyles.itemName}>{item.name}</span>
                      <span className={cartStyles.itemPrice}>${item.price.toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      className={cartStyles.removeBtn}
                      onClick={() => removeItemAt(index)}
                      aria-label={`Remove ${item.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <div className={cartStyles.total}>
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className={cartStyles.actions}>
                <Link href="/#offerings" className={cartStyles.addMoreLink}>
                  Add more services
                </Link>
                <Link href="/#contact" className={styles.submit}>
                  Proceed to checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
