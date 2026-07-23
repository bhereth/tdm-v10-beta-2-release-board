// GitHub Pages serves a project site (not a user/org site) from
// https://<user>.github.io/<repo>/ — everything after the domain is a path
// prefix the app needs to know about. GITHUB_REPOSITORY ("owner/repo") is
// set automatically by GitHub Actions, so this only kicks in during that
// build; `next dev` / a local `next build` are unaffected.
//
// BASE_PATH lets a manual build target a different subfolder — e.g. when
// copying `out/` onto a webserver that serves this app from a path other
// than the domain root (BASE_PATH=/apps/wftdm-v10-beta2-release-prizes
// npm run build). It takes priority over the GitHub Pages auto-detection.
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath =
  process.env.BASE_PATH ||
  (process.env.GITHUB_ACTIONS === "true" && repoName ? `/${repoName}` : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  eslint: {
    dirs: ["src", "tests", "scripts"],
  },
};

export default nextConfig;
