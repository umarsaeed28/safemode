/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || process.env.NEXT_PUBLIC_BASE_PATH?.replace(/^\//, "") || "";
const basePath = repoName ? `/${repoName}` : (process.env.NEXT_PUBLIC_BASE_PATH || "");

const nextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
};

module.exports = nextConfig;
