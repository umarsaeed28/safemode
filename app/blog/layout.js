import "../blog/blog.css";
import Link from "next/link";

export const metadata = {
  title: {
    default: "Product Discovery & UX | Blog | Safe Mode",
    template: "%s | Safe Mode",
  },
  description:
    "Practical posts on product discovery, prioritization, and UX for founders and product leads who want to ship with less guesswork.",
  openGraph: {
    title: "Product Discovery and UX | Safe Mode",
    description: "Practical product discovery and UX. No fluff.",
    type: "website",
  },
};

export default function BlogLayout({ children }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-lg font-semibold text-gray-900 hover:text-[var(--md-sys-color-primary)]"
          >
            Safe Mode
          </Link>
          <div className="flex gap-6">
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Blog
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-[var(--md-sys-color-primary)] hover:underline"
            >
              Contact
            </Link>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}
