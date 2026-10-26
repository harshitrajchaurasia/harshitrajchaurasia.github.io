"""Pre-push check for the public pages: no internal project names, no phone number or
dropped links, ASCII-only copy, and every project card names at least one skill.
Run: python .github/scripts/check_site.py"""
import hashlib, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
PAGES = ["index.html", "404.html", "links/index.html", "resume.txt"]

# Internal TCS project names, plus the phone number, kept as (length, sha256 prefix of the
# lowercased text) so this public file doesn't publish what it is guarding against.
# Add one: python -c "import hashlib,sys;t=sys.argv[1].lower();print(len(t),hashlib.sha256(t.encode()).hexdigest()[:16])" "Name"
PHONE = (10, "5ce89d21e03cab43")
BANNED = [(9, "7e35c7734dbd96a9"), (7, "5c1f829933f277ec"), (12, "5e5519b738cf186e"),
          (22, "9ece3c6f97070fe1"), (13, "f2bf0bed170e3fb7"), (25, "860e5060af8f2c1a"), PHONE]
BANNED_PLAIN = ["steamcommunity"]   # dropped links, nothing secret about these


def hits(text, banned):
    """Yield every banned (length, hash) whose text appears anywhere in `text`."""
    low = text.lower()
    for n, h in banned:
        # ponytail: hashes every window of each length, fine for pages this size
        if any(hashlib.sha256(low[i:i + n].encode()).hexdigest()[:16] == h for i in range(len(low) - n + 1)):
            yield h

errors = []
for page in PAGES:
    text = (ROOT / page).read_text(encoding="utf-8")
    # resume.txt mirrors the user's resume (their wording), so only the phone check applies there
    banned = [PHONE] if page == "resume.txt" else BANNED
    errors += [f"{page}: banned text (hash {h})" for h in hits(text, banned)]
    if page != "resume.txt":
        errors += [f"{page}: banned text {b!r}" for b in BANNED_PLAIN if b in text.lower()]
    if page.endswith(".html"):
        errors += [f"{page}: non-ASCII character {c!r} (use plain punctuation or an HTML entity)"
                   for c in sorted(set(re.findall(r"[^\x00-\x7f]", text)))]

index = (ROOT / "index.html").read_text(encoding="utf-8")
for card in re.findall(r'<article class="proj.*?</article>', index, re.S):
    if not re.search(r'<li data-c="\w+">', card):
        errors.append("index.html: project without skills: " + re.search(r"<h4>(.*?)</h4>", card).group(1))

print("\n".join(errors) or "OK")
sys.exit(1 if errors else 0)
