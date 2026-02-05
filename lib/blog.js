const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Get all blog post slugs (from .mdx filenames).
 * @returns {string[]}
 */
function getSlugs() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/**
 * Get raw file content for a post by slug (for MDX compile).
 * @param {string} slug
 * @returns {string | null}
 */
function getRawPostBySlug(slug) {
  const p = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf-8");
}

/**
 * Get frontmatter and raw content for a post by slug.
 * @param {string} slug
 * @returns {{ frontmatter: object, content: string } | null}
 */
function getPostBySlug(slug) {
  const raw = getRawPostBySlug(slug);
  if (!raw) return null;
  const { data: frontmatter, content } = matter(raw);
  return { frontmatter, content };
}

/**
 * Get all posts with frontmatter, sorted by date (newest first).
 * Assumes frontmatter has date or createdAt; falls back to slug order.
 * @returns {Array<{ slug: string, frontmatter: object }>}
 */
function getAllPosts() {
  const slugs = getSlugs();
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      return { slug, frontmatter: post.frontmatter };
    })
    .filter(Boolean);
  posts.sort((a, b) => {
    const dA = a.frontmatter.date || a.frontmatter.createdAt || "";
    const dB = b.frontmatter.date || b.frontmatter.createdAt || "";
    return dB.localeCompare(dA);
  });
  return posts;
}

module.exports = { getSlugs, getRawPostBySlug, getPostBySlug, getAllPosts };
