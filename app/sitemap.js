import { getAllPosts } from "../lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://safemode.com";

export default function sitemap() {
  const posts = getAllPosts();
  const blogUrls = posts.map(({ slug, frontmatter }) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: frontmatter.date ? new Date(frontmatter.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...blogUrls,
  ];
}
