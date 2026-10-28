"""Checks for the generated Chrome themes. Run: python -m unittest discover themes/_tools"""
import json
import re
import unittest
import zipfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SLUGS = ["desert-dusk", "fresh-foam", "midnight-detail"]
PUBLISHED = ["desert-dusk"]  # only one theme is published (Nazzal, 28 Oct 2026)
PLACES = re.compile(rb"turbo|luxury|abu\s*dhabi|\buae\b|dubai|sharjah|\bain\b|emirat|khaimah|chrome|google|mosque|minaret|skyline", re.I)
SIZES = {
    "images/theme_frame.png": (1920, 80),
    "images/theme_toolbar.png": (1920, 48),
    "images/theme_ntp_background.png": (1920, 1080),
    "store/icon-128.png": (128, 128),
    "store/screenshot-1280x800.png": (1280, 800),
    "store/promo-440x280.png": (440, 280),
    "store/marquee-1400x560.png": (1400, 560),
}
COLOR_KEYS = {"frame", "frame_inactive", "toolbar", "tab_text", "tab_background_text", "bookmark_text",
              "ntp_background", "ntp_text", "ntp_link", "ntp_section", "button_background",
              "omnibox_background", "omnibox_text"}


class ThemeTests(unittest.TestCase):
    def test_manifests(self):
        names = set()
        for slug in SLUGS:
            m = json.loads((ROOT / slug / "manifest.json").read_text())
            self.assertEqual(m["manifest_version"], 3)
            self.assertLessEqual(len(m["name"]), 45)
            self.assertLessEqual(len(m["description"]), 132)
            self.assertEqual(m["version"], "1.0.0")
            self.assertEqual(set(m["theme"]["colors"]), COLOR_KEYS)
            for v in m["theme"]["colors"].values():
                self.assertEqual(len(v), 3)
                self.assertTrue(all(0 <= c <= 255 for c in v))
            self.assertNotIn("permissions", m)
            self.assertNotIn("homepage_url", m)
            self.assertNotIn("turboluxury", json.dumps(m).lower())
            names.add(m["name"])
            for rel in m["theme"]["images"].values():
                self.assertTrue((ROOT / slug / rel).is_file(), rel)
        self.assertEqual(len(names), 3)

    def test_image_sizes(self):
        for slug in SLUGS:
            for rel, size in SIZES.items():
                self.assertEqual(Image.open(ROOT / slug / rel).size, size, f"{slug}/{rel}")

    def test_zip_contents(self):
        for slug in SLUGS:
            with zipfile.ZipFile(ROOT / slug / f"{slug}.zip") as z:
                self.assertEqual(sorted(z.namelist()), sorted(["manifest.json"] + [k for k in SIZES if k.startswith("images/")]))
                self.assertEqual(z.read("manifest.json"), (ROOT / slug / "manifest.json").read_bytes())

    def test_no_site_mention_in_shipped_files(self):
        for slug in SLUGS:
            with zipfile.ZipFile(ROOT / slug / f"{slug}.zip") as z:
                for n in z.namelist():
                    if n.endswith(".json"):
                        self.assertNotIn(b"turboluxury", z.read(n).lower())

    def test_no_brand_place_or_trademark_in_the_published_theme(self):
        for slug in PUBLISHED:
            with zipfile.ZipFile(ROOT / slug / f"{slug}.zip") as z:
                m = z.read("manifest.json")
                self.assertIsNone(PLACES.search(m), m)


if __name__ == "__main__":
    unittest.main()
