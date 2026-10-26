"""Pre-push check for the public pages: no internal project names, no phone number or
dropped links, ASCII-only copy, and every project card names at least one skill.
Run: python .github/scripts/check_site.py"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGES = ["index.html", "404.html", "links/index.html", "resume.txt"]

# internal TCS project names, plus things deliberately taken off the public site
BANNED = ["Eagle Eye", "RPA 1.0", "Smart Ticket", "Inventory As a Service", "Inventory aaS",
          "Smart Security Compliance", "[phone removed]", "steamcommunity"]

errors = []
for page in PAGES:
    text = (ROOT / page).read_text(encoding="utf-8")
    # resume.txt mirrors the user's resume (their wording), so only the phone check applies there
    banned = ["[phone removed]"] if page == "resume.txt" else BANNED
    errors += [f"{page}: banned text {b!r}" for b in banned if b.lower() in text.lower()]
    if page.endswith(".html"):
        errors += [f"{page}: non-ASCII character {c!r} (use plain punctuation or an HTML entity)"
                   for c in sorted(set(re.findall(r"[^\x00-\x7f]", text)))]

index = (ROOT / "index.html").read_text(encoding="utf-8")
for card in re.findall(r'<article class="proj.*?</article>', index, re.S):
    if not re.search(r'<li data-c="\w+">', card):
        errors.append("index.html: project without skills: " + re.search(r"<h3>(.*?)</h3>", card).group(1))

print("\n".join(errors) or "OK")
sys.exit(1 if errors else 0)
