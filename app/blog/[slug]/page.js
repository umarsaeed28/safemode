import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { getSlugs, getRawPostBySlug, getPostBySlug } from "../../../lib/blog";
import { mdComponents } from "../MdxContent";

export async function generateStaticParams() {
  const slugs = getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post | Safe Mode" };
  const { frontmatter } = post;
  const title = frontmatter.title || slug;
  const description = frontmatter.description || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://safemode.com";
  const url = `${siteUrl}/blog/${slug}`;
  const publishedTime = post.frontmatter.date || null;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Safe Mode`,
      description,
      type: "article",
      url,
      publishedTime: publishedTime || undefined,
      authors: ["Safe Mode"],
      siteName: "Safe Mode",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Safe Mode`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const raw = getRawPostBySlug(slug);
  if (!raw) {
    return (
      <main className="mx-auto max-w-prose px-4 py-12">
        <p>Post not found.</p>
        <Link href="/blog" className="text-[var(--md-sys-color-primary)] underline">
          Back to blog
        </Link>
      </main>
    );
  }

  const { content, frontmatter } = await compileMDX({
    source: raw,
    options: { parseFrontmatter: true },
    components: mdComponents,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://safemode.com";
  const articleUrl = `${siteUrl}/blog/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    url: articleUrl,
    datePublished: frontmatter.date || null,
    dateModified: frontmatter.date || null,
    author: { "@type": "Organization", name: "Safe Mode", url: siteUrl },
    publisher: { "@type": "Organization", name: "Safe Mode", url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  };

  return (
    <main id="main-content" className="mx-auto max-w-prose px-4 py-10 sm:py-14" role="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article itemScope itemType="https://schema.org/Article">
        <header className="mb-10">
          <Link
            href="/blog"
            className="text-sm font-medium text-[var(--md-sys-color-primary)] hover:underline"
          >
            Blog
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {frontmatter.title}
          </h1>
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
        </header>
        <div className="prose prose-gray max-w-none">{content}</div>
      </article>

      <footer className="mt-14 border-t border-gray-200 pt-10">
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <p className="font-semibold text-gray-900">Work with Safe Mode</p>
          <p className="mt-1 text-sm text-gray-600">
            Fixed scope. Capped sprints. Decisions, not more options.
          </p>
          <Link
            href="/#contact"
            className="mt-4 inline-block rounded-md bg-[var(--md-sys-color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Start a conversation
          </Link>
        </div>
        <p className="mt-6 text-center">
          <Link href="/blog" className="text-sm text-[var(--md-sys-color-primary)] hover:underline">
            All posts
          </Link>
        </p>
      </footer>
    </main>
  );
}
