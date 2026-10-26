# Harshit Chaurasia - portfolio

Personal portfolio for **Harshit Chaurasia** - Senior RPA Developer & ML Engineer. Hand-written vanilla HTML, CSS, and JavaScript. No build step, no framework, no dependencies.

**Live:** [harshit.saakura.dev](https://harshit.saakura.dev) (primary) - [harshitrajchaurasia.github.io](https://harshitrajchaurasia.github.io) (mirror)

## What this is

A single-page portfolio built as a static site. Everything is plain HTML/CSS/JS that you can open and read - there is no toolchain to learn, nothing to install, and nothing to compile. Editing the source and pushing to `master` deploys it.

Highlights of the build:

- **Skills linked to projects.** Every project card lists its skills; the skills panel is built from those tags, so a skill only appears if a project used it. Pick a skill to highlight its projects, point at a project to light up its skills.
- **Seven category colours** (RPA, ML, GenAI, Cloud, Code, Enterprise, Practice) shared by the hero bar, the skills panel and the project cards.
- **Light by default, with a dark toggle** via `data-theme`, resolved before first paint.
- **Featured projects first.** The strongest seven show by default; the rest (`.extra`) sit behind "Show more", and a skill filter pulls out any that match.
- **Accessibility:** AA contrast, keyboard support, and a `prefers-reduced-motion` path that turns animation off.

## Structure

```
index.html        Main portfolio (loads styles.css + script.js)
styles.css        All styling and the color-token system
script.js         All behavior, one IIFE, no modules
links/index.html  "All links" page (uses /styles.css plus a small inline block)
404.html          404 page (absolute paths, served at any depth)
github-stats.json GitHub numbers for the Contact section, refreshed nightly by .github/workflows/github-stats.yml
assets/           Cert badges and other static assets
```

## Run locally

```bash
# A plain HTTP server is needed so fetch() and web fonts work (file:// will not)
python -m http.server 8731
# then open http://localhost:8731/index.html
```

After editing CSS or JS, append a cache-buster (for example `index.html?v=2`) when reloading, since the dev server honors caching.

## Check before pushing

```bash
python .github/scripts/check_site.py   # no internal project names, ASCII-only copy, every project has skills
```

## Deploy

Commit to `master` and push. One push updates both targets: Cloudflare rebuilds the primary domain and GitHub Pages rebuilds the mirror, each in about a minute. The only workflow is the nightly stats refresh.

## License

Code is free to read and learn from. Content, copy, and imagery are personal and not licensed for reuse.
