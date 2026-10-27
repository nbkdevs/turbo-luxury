"""Draw the three extension icons (48, 96, 128 px). Deterministic. Needs Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
S = 512


def base(color):
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((16, 16, S - 16, S - 16), radius=110, fill=color)
    return img, d


def weather():
    img, d = base((22, 110, 160, 255))
    d.ellipse((290, 90, 430, 230), fill=(255, 205, 70, 255))
    for cx, cy, r in ((200, 330, 90), (290, 300, 110), (370, 340, 80)):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255, 255))
    d.rounded_rectangle((120, 330, 450, 420), radius=45, fill=(255, 255, 255, 255))
    return img


def log():
    img, d = base((176, 112, 24, 255))
    d.rounded_rectangle((100, 120, 412, 420), radius=36, fill=(255, 255, 255, 255))
    d.rectangle((100, 120, 412, 200), fill=(232, 168, 60, 255))
    d.rounded_rectangle((100, 120, 412, 220), radius=36, fill=(232, 168, 60, 255))
    d.rectangle((100, 180, 412, 220), fill=(232, 168, 60, 255))
    for x in (170, 342):
        d.rounded_rectangle((x - 14, 85, x + 14, 160), radius=14, fill=(90, 56, 12, 255))
    d.line((170, 320, 235, 380, 350, 255), fill=(31, 157, 85, 255), width=36, joint="curve")
    return img


def fuel():
    img, d = base((24, 120, 78, 255))
    d.rounded_rectangle((130, 100, 330, 410), radius=28, fill=(255, 255, 255, 255))
    d.rectangle((165, 140, 295, 230), fill=(24, 120, 78, 255))
    d.rounded_rectangle((100, 395, 360, 430), radius=12, fill=(255, 255, 255, 255))
    d.line((330, 200, 385, 200, 385, 330), fill=(255, 255, 255, 255), width=26, joint="curve")
    d.ellipse((365, 310, 405, 350), fill=(255, 255, 255, 255))
    d.polygon([(385, 360), (352, 410), (418, 410)], fill=(255, 205, 70, 255))
    d.ellipse((352, 385, 418, 440), fill=(255, 205, 70, 255))
    return img


for slug, fn in (("wash-day-weather", weather), ("car-care-log", log), ("fuel-economy-log", fuel)):
    out = ROOT / slug / "src" / "icons"
    out.mkdir(parents=True, exist_ok=True)
    big = fn()
    for px in (48, 96, 128):
        big.resize((px, px), Image.LANCZOS).save(out / f"icon-{px}.png", optimize=True)
    store = ROOT / slug / "store"
    store.mkdir(exist_ok=True)
    big.resize((300, 300), Image.LANCZOS).save(store / "logo-300x300.png", optimize=True)
    print("icons", slug)
