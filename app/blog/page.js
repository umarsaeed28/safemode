import Link from "next/link";
import { getAllPosts } from "../../lib/blog";

export const metadata = {
  title: "Product Discovery & UX",
  description:
    "Posts on discovery, roadmaps, MVPs, and UX. Written for founders and product leaders.",
  openGraph: {
    title: "Product Discovery & UX | Safe Mode",
    description: "Posts on discovery, roadmaps, MVPs, and UX.",
    type: "website",
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16" role="main">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Product Discovery & UX
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          No fluff. Just what actually works.
        </p>
      </header>

      <nav aria-label="Blog posts">
        <ul className="space-y-8">
          {posts.length === 0 ? (
            <li className="text-gray-500">No posts yet.</li>
          ) : (
            posts.map(({ slug, frontmatter }) => (
              <li key={slug}>
                <article>
                  <Link
                    href={`/blog/${slug}`}
                    className="group block rounded-lg border border-gray-200 bg-white p-5 transition hover:border-[var(--md-sys-color-primary)] hover:shadow-sm"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-[var(--md-sys-color-primary)]">
                      {frontmatter.title}
                    </h2>
                    {frontmatter.description && (
                      <p className="mt-2 text-gray-600 line-clamp-2">
                        {frontmatter.description}
                      </p>
                    )}
                    {frontmatter.date && (
                      <time
                        dateTime={frontmatter.date}
                        className="mt-2 block text-sm text-gray-500"
                      >
                        {new Date(frontmatter.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    )}
                  </Link>
                </article>
              </li>
            ))
          )}
        </ul>
      </nav>
    </main>
  );
}
