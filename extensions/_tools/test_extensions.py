"""Package checks. Run from the repo root: python -m unittest discover -s extensions/_tools -v"""
import json
import re
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUGS = ["wash-day-weather", "car-care-log", "fuel-economy-log"]
FORBIDDEN = re.compile(r"turbo\s*-?luxury|carwash|car wash abu dhabi|abu dhabi car|nbkdevs\.com", re.I)
# Place and brand names that must not appear in the published extension (Nazzal, 28 Oct 2026)
PLACES = re.compile(r"turbo|luxury|abu\s*dhabi|\buae\b|dubai|sharjah|\bal\s*ain\b|\bain\b|emirat|khaimah|\baed\b", re.I)
PUBLISHED = ["wash-day-weather"]


def read_zip(path):
    with zipfile.ZipFile(path) as z:
        return {n: z.read(n) for n in z.namelist()}


class PackageTests(unittest.TestCase):
    def test_zips_have_manifest_first_and_all_referenced_files(self):
        for slug in SLUGS:
            for browser in ("firefox", "edge"):
                files = read_zip(ROOT / slug / "dist" / f"{slug}-{browser}.zip")
                names = list(files)
                self.assertEqual(names[0], "manifest.json")
                m = json.loads(files["manifest.json"])
                refs = list(m["icons"].values()) + list(m["action"]["default_icon"].values()) + [m["action"]["default_popup"]]
                bg = m.get("background", {})
                refs += bg.get("scripts", []) + ([bg["service_worker"]] if "service_worker" in bg else [])
                for r in refs:
                    self.assertIn(r, files, f"{slug} {browser} missing {r}")
                html = files["popup.html"].decode()
                for src in re.findall(r'<script src="([^"]+)"', html):
                    self.assertIn(src, files)
                self.assertNotRegex(html, r"<script(?![^>]*src=)")  # no inline scripts
                self.assertNotRegex(html, r"https?://")  # no remote assets

    def test_firefox_manifest(self):
        for slug in SLUGS:
            m = json.loads(read_zip(ROOT / slug / "dist" / f"{slug}-firefox.zip")["manifest.json"])
            g = m["browser_specific_settings"]["gecko"]
            self.assertEqual(g["id"], f"{slug}@nbkdevs.github.io")
            self.assertEqual(g["strict_min_version"], "140.0")
            expected = ["locationInfo"] if slug == "wash-day-weather" else ["none"]
            self.assertEqual(g["data_collection_permissions"], {"required": expected})
            self.assertEqual(m["browser_specific_settings"]["gecko_android"]["strict_min_version"], "142.0")
            self.assertLessEqual(len(m["description"]), 132)
            self.assertLessEqual(len(m["name"]), 45)

    def test_edge_manifest_has_no_gecko_block(self):
        for slug in SLUGS:
            m = json.loads(read_zip(ROOT / slug / "dist" / f"{slug}-edge.zip")["manifest.json"])
            self.assertNotIn("browser_specific_settings", m)
            if "background" in m:
                self.assertEqual(m["background"], {"service_worker": "background.js"})

    def test_permissions_are_minimal(self):
        expected = {"wash-day-weather": ["storage"], "car-care-log": ["storage", "alarms", "notifications"], "fuel-economy-log": ["storage"]}
        for slug, perms in expected.items():
            m = json.loads(read_zip(ROOT / slug / "dist" / f"{slug}-edge.zip")["manifest.json"])
            self.assertEqual(m["permissions"], perms)
            self.assertNotIn("host_permissions", m)

    def test_no_mention_of_the_client_site_anywhere_in_shipped_files(self):
        for slug in SLUGS:
            for browser in ("firefox", "edge"):
                for name, data in read_zip(ROOT / slug / "dist" / f"{slug}-{browser}.zip").items():
                    if name.endswith(".png"):
                        continue
                    self.assertIsNone(FORBIDDEN.search(data.decode()), f"{slug} {browser} {name}")

    def test_no_brand_or_place_names_in_the_published_extension(self):
        for slug in PUBLISHED:
            for browser in ("firefox", "edge"):
                for name, data in read_zip(ROOT / slug / "dist" / f"{slug}-{browser}.zip").items():
                    if name.endswith(".png"):
                        continue
                    self.assertIsNone(PLACES.search(data.decode()), f"{slug} {browser} {name}")

    def test_zips_match_source(self):
        for slug in SLUGS:
            files = read_zip(ROOT / slug / "dist" / f"{slug}-edge.zip")
            for p in (ROOT / slug / "src").rglob("*"):
                if p.is_file():
                    self.assertEqual(files[p.relative_to(ROOT / slug / "src").as_posix()], p.read_bytes(), f"{slug} {p.name} stale zip, rerun build.py")


if __name__ == "__main__":
    unittest.main()
