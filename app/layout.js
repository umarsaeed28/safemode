import "./theme.css"
import "./globals.css"
import { Plus_Jakarta_Sans } from "next/font/google"
import JsonLd from "./components/JsonLd"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://safemode.com"

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Safe Mode | Product & UX Discovery Studio",
    template: "%s | Safe Mode",
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
  authors: [{ name: "Safe Mode", url: SITE_URL }],
  creator: "Safe Mode",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Safe Mode",
    title: "Safe Mode | Product & UX Discovery Studio",
    description:
      "Product discovery and UX. Fixed scope, capped sprints. Decisions and a backlog ready for engineering.",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "Safe Mode | Product & UX Discovery",
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
    <html lang="en" className={plusJakarta.variable}>
      <body className={plusJakarta.className} style={{ fontFamily: "var(--font-sans)" }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <JsonLd />
        {children}
      </body>
    </html>
  )
}
