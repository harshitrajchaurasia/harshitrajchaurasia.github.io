# harshit.sh

Personal portfolio for **Harshit Chaurasia** - AI & Automation Engineer. Hand-written vanilla HTML, CSS, and JavaScript. No build step, no framework, no dependencies.

**Live:** [harshit.saakura.dev](https://harshit.saakura.dev) (primary) - [harshitrajchaurasia.github.io](https://harshitrajchaurasia.github.io) (mirror)

## What this is

A single-page portfolio built as a static site. Everything is plain HTML/CSS/JS that you can open and read - there is no toolchain to learn, nothing to install, and nothing to compile. Editing the source and pushing to `master` deploys it.

Highlights of the build:

- **Per-section accent theming.** Each section sets one CSS variable (`--sec`) and its entire palette - borders, glows, titles, hover states - flows from it.
- **Light and dark themes** via `data-theme` and CSS custom properties, with the initial theme resolved before first paint to avoid a flash.
- **Boot-terminal typewriter**, scroll-reveal, metric count-ups, a command palette, and a few details left for the curious to find.
- **Accessibility as a requirement.** WCAG AA contrast throughout, full keyboard support, and a `prefers-reduced-motion` path that disables every animation.

## Structure

```
index.html        Main portfolio (loads styles.css + script.js)
styles.css        All styling and the color-token system
script.js         All behavior, one IIFE, no modules
links/index.html  Self-hosted "all links" page (standalone, CSS inlined)
404.html          GitHub Pages 404 page
assets/           Cert badges and other static assets
```

## Run locally

```bash
# A plain HTTP server is needed so fetch() and web fonts work (file:// will not)
python -m http.server 8731
# then open http://localhost:8731/index.html
```

After editing CSS or JS, append a cache-buster (for example `index.html?v=2`) when reloading, since the dev server honors caching.

## Deploy

Commit to `master` and push. One push updates both targets: Cloudflare rebuilds the primary domain and GitHub Pages rebuilds the mirror, each in about a minute. There is no CI.

## License

Code is free to read and learn from. Content, copy, and imagery are personal and not licensed for reuse.
