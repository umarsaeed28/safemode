"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useCart } from "../context/CartContext"
import styles from "../page.module.css"
import checkoutStyles from "./checkout.module.css"

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""

function CheckoutContent() {
  const searchParams = useSearchParams()
  const { cart, clearCart } = useCart()
  const [formState, setFormState] = useState("idle")
  const [stripeLoading, setStripeLoading] = useState(false)
  const total = cart.reduce((sum, item) => sum + item.price, 0)

  useEffect(() => {
    const success = searchParams.get("success")
    if (success === "stripe" && cart.length > 0) {
      clearCart()
      setFormState("sent")
      window.history.replaceState({}, "", "/checkout")
    }
  }, [searchParams, cart.length, clearCart])

  async function handleStripe() {
    setStripeLoading(true)
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Checkout failed")
      if (data.url) window.location.href = data.url
    } catch (err) {
      setFormState("error")
      setStripeLoading(false)
    }
  }

  if (cart.length === 0 && formState !== "sent") {
    return (
      <>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>shipgate</Link>
            <div className={styles.navRight}>
              <ul className={styles.navLinks}>
                <li><Link href="/#offerings">Offerings</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/#contact">Contact</Link></li>
              </ul>
              <Link href="/cart" className={styles.cartIcon} aria-label="Cart">Cart</Link>
            </div>
          </nav>
        </header>
        <main id="main-content" className={checkoutStyles.main}>
          <p className={checkoutStyles.empty}>Your cart is empty.</p>
          <Link href="/#offerings" className={styles.ctaPrimary}>View offerings</Link>
        </main>
      </>
    )
  }

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>shipgate</Link>
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
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cart.length > 0 && <span className={checkoutStyles.badge}>{cart.length}</span>}
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content" className={checkoutStyles.main}>
        <div className={checkoutStyles.wrapper}>
          <Link href="/cart" className={checkoutStyles.backLink}>← Back to cart</Link>
          <h1 className={checkoutStyles.title}>Payment</h1>

          <div className={checkoutStyles.summary}>
            <span>Order total</span>
            <span>${total.toLocaleString()}</span>
          </div>

          {formState === "sent" ? (
            <p className={styles.formSuccess}>Transaction successful.</p>
          ) : (
            <>
              {formState === "error" && (
                <p className={styles.formError} role="alert">Something went wrong. Please try again.</p>
              )}
              <p className={checkoutStyles.chooseLabel}>Pay with</p>
              <div className={checkoutStyles.paymentOptions}>
                <button
                  type="button"
                  className={checkoutStyles.stripeBtn}
                  onClick={handleStripe}
                  disabled={stripeLoading}
                >
                  {stripeLoading ? "Redirecting…" : "Stripe"}
                </button>
                {paypalClientId && (
                  <>
                    <span className={checkoutStyles.or}>or</span>
                    <div className={checkoutStyles.paypalWrap}>
                      <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={async () => {
                          const res = await fetch("/api/checkout/paypal/order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ amount: total }),
                          })
                          const data = await res.json()
                          if (!res.ok) throw new Error(data.error || "Order failed")
                          return data.orderID
                        }}
                        onApprove={async (data) => {
                          const res = await fetch("/api/checkout/paypal/capture", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderID: data.orderID }),
                          })
                          const result = await res.json()
                          if (result.ok) {
                            clearCart()
                            setFormState("sent")
                          }
                        }}
                        onError={() => setFormState("error")}
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <Suspense fallback={<div className={checkoutStyles.main}>Loading…</div>}>
        <CheckoutContent />
      </Suspense>
    </PayPalScriptProvider>
  )
}
