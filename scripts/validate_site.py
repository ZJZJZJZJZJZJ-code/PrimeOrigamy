from pathlib import Path
import json
import re


ROOT = Path(__file__).resolve().parents[1]
EXEMPT = {"404.html", "imprint.html", "privacy.html", "affiliate-disclosure.html"}


def fail(message: str) -> None:
    raise SystemExit(message)


raw = (ROOT / "config.js").read_text(encoding="utf-8")
payload = raw.split("=", 1)[1].strip().rstrip(";")
cfg = json.loads(payload)
assert cfg.get("commercializationEnabled") is True
assert cfg.get("associateTag") == "foldflightlab-21"

subscription = cfg.get("subscription", {})
assert subscription.get("mode") in {"email", "api"}
assert subscription.get("consentVersion") == "2026-08-17"
if subscription.get("mode") == "email":
    assert re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", subscription.get("email", ""))
else:
    assert subscription.get("endpoint", "").startswith("https://")

links = cfg.get("links", {})
for key, item in links.items():
    assert item.get("type") in {"search", "direct"}, f"{key}: invalid link type"
    if item["type"] == "direct":
        assert re.fullmatch(r"[A-Z0-9]{10}", item.get("asin", ""), re.I), f"{key}: invalid ASIN"
    else:
        assert item.get("query", "").strip(), f"{key}: empty search query"

used: set[str] = set()
canonical_urls: set[str] = set()
for path in ROOT.rglob("*.html"):
    text = path.read_text(encoding="utf-8")
    rel = path.relative_to(ROOT).as_posix()
    used.update(re.findall(r'data-amazon="([^"]+)"', text))
    if rel not in EXEMPT:
        required = [
            (r"<title>[^<]+</title>", "title"),
            (r'<meta name="description" content="[^"]+"', "meta description"),
            (r'<link rel="canonical" href="https://foldflightlab\.github\.io/[^"]*"', "canonical"),
        ]
        for pattern, label in required:
            if not re.search(pattern, text, re.I):
                fail(f"{rel}: missing {label}")
        canonical = re.search(r'<link rel="canonical" href="([^"]+)"', text, re.I)
        if canonical:
            if canonical.group(1) in canonical_urls:
                fail(f"{rel}: duplicate canonical {canonical.group(1)}")
            canonical_urls.add(canonical.group(1))
    for href in re.findall(r'href="([^"]+)"', text):
        if href.startswith(("#", "http://", "https://", "mailto:", "tel:", "javascript:")):
            continue
        clean = href.split("#", 1)[0].split("?", 1)[0]
        if not clean:
            continue
        target = (ROOT / clean.lstrip("/")) if clean.startswith("/") else (path.parent / clean).resolve()
        if clean.endswith("/") or target.is_dir():
            target = target / "index.html"
        if not target.exists():
            fail(f"{rel}: broken internal link -> {href}")

missing = sorted(used - set(links))
if missing:
    fail("Missing Amazon config keys: " + ", ".join(missing))

required_direct = {
    "bookEasy", "bookAbsolute", "bookOneFold", "bookEncyclopedia",
    "bookDesignSecrets", "bookChampion", "bookSmithsonian",
}
if not required_direct.issubset(used):
    fail("Some curated books are not linked in HTML")

for page in ("join.html", "paper-airplane-troubleshooting.html"):
    text = (ROOT / page).read_text(encoding="utf-8")
    assert "data-subscribe-form" in text
    assert "Your address is not sold" in text

privacy = (ROOT / "privacy.html").read_text(encoding="utf-8")
assert 'id="newsletter"' in privacy
assert "Art. 6 Abs. 1 lit. a DSGVO" in privacy

print(
    "HTML/SEO/privacy/internal-link/Amazon-key validation passed. "
    f"{len(used)} affiliate intents and {len(canonical_urls)} canonical pages checked."
)
