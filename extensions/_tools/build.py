"""Build Firefox and Edge packages for every extension. Deterministic zips.

    python extensions/_tools/build.py            # all
    python extensions/_tools/build.py car-care-log

Output per extension: build/<browser>/ (unpacked, git-ignored) and dist/<slug>-<browser>.zip
"""
import json
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GECKO_DOMAIN = "nbkdevs.github.io"  # neutral id domain; deliberately not the client's site

EXTENSIONS = {
    "wash-day-weather": {
        "name": "Wash Day Weather",
        "version": "1.0.1",
        "description": "Find the best day this week to wash your car. Scores 7 days for any town or city on rain, dust, wind and temperature.",
        "permissions": ["storage"],
        "background": None,
        # the chosen town's rounded coordinates go to the forecast API; Firefox counts that as location data
        "data_collection": ["locationInfo"],
    },
    "car-care-log": {
        "name": "Car Care Service Log",
        "version": "1.0.0",
        "description": "Log washes, oil changes, tyres and more, see what is due next, and get a daily reminder. Data stays in your browser.",
        "permissions": ["storage", "alarms", "notifications"],
        "background": ["lib.js", "background.js"],
    },
    "fuel-economy-log": {
        "name": "Fuel Economy Log",
        "version": "1.0.0",
        "description": "Log fill-ups to see litres per 100 km, km per litre and AED per km. Works offline, data stays in your browser.",
        "permissions": ["storage"],
        "background": None,
    },
}


def manifest(slug, cfg, browser):
    m = {
        "manifest_version": 3,
        "name": cfg["name"],
        "version": cfg["version"],
        "description": cfg["description"],
        "icons": {"48": "icons/icon-48.png", "96": "icons/icon-96.png", "128": "icons/icon-128.png"},
        "action": {
            "default_title": cfg["name"],
            "default_popup": "popup.html",
            "default_icon": {"48": "icons/icon-48.png", "96": "icons/icon-96.png"},
        },
        "permissions": cfg["permissions"],
    }
    if cfg["background"]:
        if browser == "firefox":
            m["background"] = {"scripts": cfg["background"]}
        else:
            m["background"] = {"service_worker": "background.js"}
    if browser == "firefox":
        m["browser_specific_settings"] = {
            "gecko": {
                "id": f"{slug}@{GECKO_DOMAIN}",
                "strict_min_version": "140.0",
                "data_collection_permissions": {"required": cfg.get("data_collection", ["none"])},
            },
            "gecko_android": {"strict_min_version": "142.0"},
        }
    return m


def write_zip(src_dir, out):
    files = sorted(p for p in src_dir.rglob("*") if p.is_file())
    files.sort(key=lambda p: (p.name != "manifest.json", str(p)))
    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for p in files:
            zi = zipfile.ZipInfo(p.relative_to(src_dir).as_posix(), (2026, 10, 27, 0, 0, 0))
            zi.compress_type = zipfile.ZIP_DEFLATED
            zi.external_attr = 0o644 << 16
            z.writestr(zi, p.read_bytes())


def build(slug):
    cfg = EXTENSIONS[slug]
    base = ROOT / slug
    for browser in ("firefox", "edge"):
        out = base / "build" / browser
        if out.exists():
            shutil.rmtree(out)
        shutil.copytree(base / "src", out)
        (out / "manifest.json").write_text(json.dumps(manifest(slug, cfg, browser), indent=2) + "\n")
        write_zip(out, base / "dist" / f"{slug}-{browser}.zip")
        print("built", base / "dist" / f"{slug}-{browser}.zip")


if __name__ == "__main__":
    for s in (sys.argv[1:] or EXTENSIONS):
        build(s)
