# Blog content

SEO-optimized posts live here as MDX files. Each post is built at `/blog/[slug]`.

## Adding a new post

1. **Create a new file** in `content/blog/` with the extension `.mdx`.

2. **Use this frontmatter** (all fields required for SEO):

```yaml
---
title: "Your Post Title (use quotes if the title contains a colon)"
description: "One or two sentences for meta description and previews."
primaryKeyword: main keyword for the post
secondaryKeywords: ["keyword two", "keyword three"]
slug: url-friendly-slug
date: "YYYY-MM-DD"
---
```

- **title:** Shown as the H1 and in `<title>`. Use double quotes if the title contains a colon (`:`) or apostrophe.
- **description:** Used for meta description and Open Graph. Keep it under ~160 characters for search.
- **primaryKeyword / secondaryKeywords:** For your own SEO tracking; used in content strategy.
- **slug:** URL path. Must match the filename (e.g. `my-post.mdx` → `slug: my-post`). No spaces or special chars.
- **date:** ISO date string. Posts are sorted newest-first on the index.

3. **Write the body** in MDX (Markdown + JSX). Use one H1 only on the post page. The layout uses `title` from frontmatter as the H1. Use H2/H3 for sections. Links and images work as in Markdown.

4. **Save.** The post will appear on `/blog` and at `/blog/[slug]`. Metadata (title, description, Open Graph) is generated from frontmatter.

## YAML tips

- Wrap **title** and **description** in double quotes if they contain `:`, `'`, or `#`.
- **date** should be quoted: `"2025-01-15"`.
- **secondaryKeywords** is a YAML array; use the format shown above.

## Tone (guidelines)

- Opinionated and direct.
- No emojis or filler.
- For founders and product leaders.
- One clear idea per post; use H2/H3 for structure.
