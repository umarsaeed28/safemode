import "./theme.css"
import "./globals.css"
import { Inter } from "next/font/google"
import JsonLd from "./components/JsonLd"
import CartLayoutClient from "./components/CartLayoutClient"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-inter",
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shipgate.ai"

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shipgate | Stop guessing what to build.",
    template: "%s | Shipgate",
  },
  description:
    "We run product discovery and UX so you get decisions and a shippable backlog. Fixed scope, no scope creep. For founders and product teams who need to move fast without guessing.",
  keywords: [
    "product discovery",
    "UX discovery",
    "product strategy",
    "backlog",
    "fixed scope",
    "product team",
    "founder",
  ],
  authors: [{ name: "shipgate", url: SITE_URL }],
  creator: "shipgate",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "shipgate",
    title: "shipgate | Product & UX Discovery Studio",
    description:
      "Product discovery and UX. Fixed scope, capped sprints. Decisions and a backlog ready for engineering.",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipgate | Stop guessing what to build.",
    description:
      "Product discovery and UX. Fixed scope. We force the hard calls so you ship with clarity.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: SITE_URL },
  verification: {},
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <JsonLd />
        <CartLayoutClient>{children}</CartLayoutClient>
      </body>
    </html>
  )
}
