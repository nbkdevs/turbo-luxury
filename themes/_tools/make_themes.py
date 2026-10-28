#!/usr/bin/env python3
"""Generate the three Chrome themes: manifest.json, theme images and Chrome Web Store graphics.

Run from the repo root:  python themes/_tools/make_themes.py [slug ...]
Needs Pillow. Output is deterministic (fixed random seeds).
"""
import json
import math
import random
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
W, H = 1920, 1080
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def font(size, bold=False):
    try:
        return ImageFont.truetype(FONT_BOLD if bold else FONT, size)
    except OSError:
        return ImageFont.load_default(size)


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def vgradient(w, h, stops):
    """stops: [(pos 0..1, (r,g,b)), ...]"""
    img = Image.new("RGB", (w, h))
    px = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
            if p0 <= t <= p1:
                px.line([(0, y), (w, y)], fill=lerp(c0, c1, (t - p0) / (p1 - p0 or 1)))
                break
    return img


# ---------------------------------------------------------------- scenes

def scene_dusk():
    rnd = random.Random(11)
    img = vgradient(W, H, [(0, (22, 18, 58)), (0.35, (88, 40, 96)), (0.6, (214, 98, 74)), (0.78, (250, 176, 96)), (1, (255, 214, 140))])
    # stars in the upper sky
    d = ImageDraw.Draw(img)
    for _ in range(140):
        x, y = rnd.randrange(W), rnd.randrange(int(H * 0.38))
        r = rnd.choice([1, 1, 1, 2])
        a = rnd.randint(120, 230)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(a, a, min(255, a + 20)))
    # sun glow near horizon
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = int(W * 0.72), int(H * 0.74)
    for r in range(420, 0, -6):
        c = int(255 * (1 - r / 420) ** 2)
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(c, int(c * 0.62), int(c * 0.28)))
    glow = glow.filter(ImageFilter.GaussianBlur(24))
    img = Image.blend(img, Image.composite(glow, img, Image.new("L", (W, H), 255)), 0.0)
    from PIL import ImageChops
    img = ImageChops.add(img, glow)
    d = ImageDraw.Draw(img)
    d.ellipse([cx - 62, cy - 62, cx + 62, cy + 62], fill=(255, 238, 190))
    # far dune ridge on the horizon (no buildings or landmarks)
    far = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(far)
    pts = [(0, H)]
    for x in range(0, W + 8, 8):
        y = H * 0.80 + math.sin(x / 520 + 0.6) * H * 0.03 + math.sin(x / 190 + 1.3) * H * 0.012
        pts.append((x, y))
    pts.append((W, H))
    fd.polygon(pts, fill=(96, 50, 84, 255))
    img.paste(far, (0, 0), far)
    # dunes
    dunes = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dd = ImageDraw.Draw(dunes)
    layers = [((70, 38, 70), 0.86, 0.045, 0.0), ((52, 28, 56), 0.92, 0.06, 1.7), ((32, 18, 44), 0.97, 0.05, 3.1)]
    for color, yb, amp, ph in layers:
        pts = [(0, H)]
        for x in range(0, W + 8, 8):
            y = H * yb + math.sin(x / 310 + ph) * H * amp + math.sin(x / 120 + ph * 2) * H * amp * 0.25
            pts.append((x, y))
        pts.append((W, H))
        dd.polygon(pts, fill=color + (255,))
    img.paste(dunes, (0, 0), dunes)
    return img


def scene_foam():
    rnd = random.Random(23)
    img = vgradient(W, H, [(0, (236, 248, 255)), (0.55, (196, 230, 247)), (1, (140, 200, 230))])
    over = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(over)
    # soft layered waves at the bottom
    for i, (c, yb, amp, ph) in enumerate([((90, 170, 210, 120), 0.84, 0.035, 0.4), ((40, 130, 180, 150), 0.90, 0.04, 2.0), ((20, 96, 150, 190), 0.96, 0.03, 3.6)]):
        pts = [(0, H)]
        for x in range(0, W + 8, 8):
            pts.append((x, H * yb + math.sin(x / 260 + ph) * H * amp))
        pts.append((W, H))
        od.polygon(pts, fill=c)
    # bubbles
    for _ in range(90):
        r = int(rnd.choice([10, 14, 20, 28, 40, 60, 90]) * rnd.uniform(0.7, 1.2))
        x, y = rnd.randrange(-40, W + 40), rnd.randrange(-40, int(H * 0.9))
        od.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, 38), outline=(255, 255, 255, 150), width=max(1, r // 18))
        hr = max(2, r // 4)
        od.ellipse([x - r * 0.55 - hr, y - r * 0.55 - hr, x - r * 0.55 + hr, y - r * 0.55 + hr], fill=(255, 255, 255, 200))
    img = Image.alpha_composite(img.convert("RGBA"), over).convert("RGB")
    return img


def scene_midnight():
    rnd = random.Random(37)
    img = vgradient(W, H, [(0, (6, 8, 14)), (0.6, (14, 18, 28)), (1, (22, 14, 12))])
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    vx, vy = int(W * 0.5), int(H * 0.62)
    # converging road lines in warm orange
    for i in range(-14, 15):
        x_end = vx + i * 260
        c = int(255 - abs(i) * 11)
        gd.line([(vx, vy), (x_end, H + 40)], fill=(c, int(c * 0.42), int(c * 0.1)), width=3 if abs(i) % 2 else 5)
    # horizon streaks (anamorphic flare)
    for k in range(6):
        y = vy + rnd.randint(-6, 6)
        gd.line([(0, y), (W, y)], fill=(90 - k * 10, 130 - k * 14, 200 - k * 20), width=2)
    gd.ellipse([vx - 40, vy - 18, vx + 40, vy + 18], fill=(255, 190, 120))
    glow = glow.filter(ImageFilter.GaussianBlur(5))
    from PIL import ImageChops
    img = ImageChops.add(img, glow)
    # broad blurred haze around the vanishing point
    haze = Image.new("RGB", (W, H), (0, 0, 0))
    hd = ImageDraw.Draw(haze)
    hd.ellipse([vx - 520, vy - 150, vx + 520, vy + 150], fill=(70, 38, 18))
    haze = haze.filter(ImageFilter.GaussianBlur(90))
    img = ImageChops.add(img, haze)
    # glossy diagonal reflection bands (like light on black paint)
    bands = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bands)
    for off, a in ((-300, 18), (200, 26), (900, 14)):
        bd.polygon([(off, 0), (off + 260, 0), (off + 260 + 500, H), (off + 500, H)], fill=(255, 255, 255, a))
    bands = bands.filter(ImageFilter.GaussianBlur(40))
    img = Image.alpha_composite(img.convert("RGBA"), bands).convert("RGB")
    return img


# ---------------------------------------------------------------- themes

THEMES = [
    {
        "slug": "desert-dusk",
        "name": "Desert Dusk",
        "version": "1.0.0",
        "description": "A warm desert sunset theme: indigo sky and first stars fading to gold over a low sun and rolling dunes.",
        "tagline": "Stars, a low sun and rolling dunes",
        "scene": scene_dusk,
        "frame": ((38, 26, 70), (96, 46, 92)),
        "toolbar": (250, 240, 228),
        "colors": {
            "frame": [38, 26, 70], "frame_inactive": [52, 38, 84], "toolbar": [250, 240, 228],
            "tab_text": [40, 24, 52], "tab_background_text": [244, 226, 214], "bookmark_text": [60, 34, 64],
            "ntp_background": [38, 26, 70], "ntp_text": [255, 240, 224], "ntp_link": [255, 196, 120],
            "ntp_section": [60, 36, 84], "button_background": [250, 240, 228],
            "omnibox_background": [255, 255, 255], "omnibox_text": [40, 24, 52],
        },
        "ntp_alignment": "bottom",
        "accent": (255, 190, 110),
        "text": (255, 244, 232),
    },
    {
        "slug": "fresh-foam",
        "name": "Fresh Foam",
        "version": "1.0.0",
        "description": "A bright, clean theme of soft blue water, drifting bubbles and gentle waves.",
        "tagline": "Bright water, soft bubbles, clean tabs",
        "scene": scene_foam,
        "frame": ((206, 232, 246), (170, 214, 236)),
        "toolbar": (255, 255, 255),
        "colors": {
            "frame": [190, 224, 242], "frame_inactive": [208, 232, 246], "toolbar": [255, 255, 255],
            "tab_text": [14, 58, 92], "tab_background_text": [30, 76, 112], "bookmark_text": [14, 90, 130],
            "ntp_background": [196, 230, 247], "ntp_text": [10, 52, 84], "ntp_link": [8, 100, 150],
            "ntp_section": [255, 255, 255], "button_background": [255, 255, 255],
            "omnibox_background": [238, 247, 252], "omnibox_text": [14, 58, 92],
        },
        "ntp_alignment": "bottom",
        "accent": (20, 110, 170),
        "text": (10, 52, 84),
    },
    {
        "slug": "midnight-detail",
        "name": "Midnight Detail",
        "version": "1.0.0",
        "description": "A dark, glossy theme inspired by a night drive: black paint reflections and warm road light.",
        "tagline": "Black paint, warm road light",
        "scene": scene_midnight,
        "frame": ((12, 14, 20), (30, 22, 20)),
        "toolbar": (30, 33, 42),
        "colors": {
            "frame": [12, 14, 20], "frame_inactive": [20, 22, 30], "toolbar": [30, 33, 42],
            "tab_text": [244, 246, 250], "tab_background_text": [176, 182, 196], "bookmark_text": [226, 230, 240],
            "ntp_background": [8, 10, 16], "ntp_text": [236, 238, 244], "ntp_link": [255, 150, 70],
            "ntp_section": [28, 30, 40], "button_background": [44, 48, 60],
            "omnibox_background": [48, 52, 66], "omnibox_text": [240, 242, 248],
        },
        "ntp_alignment": "bottom",
        "accent": (255, 150, 70),
        "text": (240, 242, 248),
    },
]


def hgradient(w, h, c0, c1):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for x in range(w):
        d.line([(x, 0), (x, h)], fill=lerp(c0, c1, x / max(1, w - 1)))
    return img


def make_frame(t):
    img = hgradient(W, 80, *t["frame"])
    return img


def make_toolbar(t):
    c = t["toolbar"]
    img = Image.new("RGB", (W, 48), c)
    d = ImageDraw.Draw(img)
    shade = tuple(max(0, v - 18) for v in c)
    d.line([(0, 47), (W, 47)], fill=shade)
    return img


def mock_browser(t, scene, size=(1280, 800)):
    w, h = size
    img = Image.new("RGB", size, tuple(t["colors"]["frame"]))
    frame = make_frame(t).resize((w, 40))
    img.paste(frame, (0, 0))
    d = ImageDraw.Draw(img)
    tool = tuple(t["colors"]["toolbar"])
    # active tab
    d.rounded_rectangle([14, 8, 214, 44], radius=10, fill=tool)
    d.text((34, 17), "New Tab", font=font(15), fill=tuple(t["colors"]["tab_text"]))
    d.text((240, 17), "Inbox", font=font(15), fill=tuple(t["colors"]["tab_background_text"]))
    d.rectangle([0, 40, w, 86], fill=tool)
    d.rounded_rectangle([110, 49, w - 140, 78], radius=15, fill=tuple(t["colors"]["omnibox_background"]))
    d.text((132, 55), "Search or type a URL", font=font(15), fill=tuple(t["colors"]["omnibox_text"]))
    for i in range(3):
        d.ellipse([24 + i * 28, 54, 40 + i * 28, 70], outline=tuple(t["colors"]["bookmark_text"]), width=2)
    body = scene.resize((w, int(w * H / W)))
    body = body.crop((0, body.height - (h - 86), w, body.height))
    img.paste(body, (0, 86))
    d = ImageDraw.Draw(img)
    # fake search box and shortcuts on the new tab page
    sx0, sx1, sy = w // 2 - 260, w // 2 + 260, 250
    d.rounded_rectangle([sx0, sy, sx1, sy + 52], radius=26, fill=tuple(t["colors"]["omnibox_background"]))
    d.text((sx0 + 28, sy + 15), "Search the web", font=font(18), fill=tuple(t["colors"]["omnibox_text"]))
    for i in range(5):
        cx = w // 2 - 200 + i * 100
        d.ellipse([cx - 28, sy + 100, cx + 28, sy + 156], fill=tuple(t["colors"]["ntp_section"]))
        d.rounded_rectangle([cx - 30, sy + 164, cx + 30, sy + 172], radius=4, fill=tuple(t["colors"]["ntp_text"]))
    return img


def cover(img, w, h):
    s = max(w / img.width, h / img.height)
    r = img.resize((int(img.width * s) + 1, int(img.height * s) + 1), Image.LANCZOS)
    x = (r.width - w) // 2
    y = r.height - h  # keep the bottom (foreground)
    return r.crop((x, y, x + w, y + h))


def text_shadow(d, xy, text, f, fill, shadow=(0, 0, 0)):
    x, y = xy
    d.text((x + 2, y + 2), text, font=f, fill=shadow + (0,) if False else shadow)
    d.text((x, y), text, font=f, fill=fill)


def make_icon(t, scene):
    s = 512
    img = cover(scene, s, s).filter(ImageFilter.GaussianBlur(0.5))
    d = ImageDraw.Draw(img)
    pad = 40
    d.rounded_rectangle([pad, pad, s - pad, s - pad], radius=70, outline=t["accent"], width=14)
    f = font(210, True)
    letter = "".join(w[0] for w in t["name"].split()[:2]).upper()
    bbox = d.textbbox((0, 0), letter, font=f)
    x = (s - (bbox[2] - bbox[0])) // 2 - bbox[0]
    y = (s - (bbox[3] - bbox[1])) // 2 - bbox[1]
    d.text((x + 6, y + 6), letter, font=f, fill=(0, 0, 0))
    d.text((x, y), letter, font=f, fill=t["text"] if sum(t["text"]) > 400 else t["accent"])
    return img.resize((128, 128), Image.LANCZOS)


def make_promo(t, scene, size):
    w, h = size
    img = cover(scene, w, h)
    ov = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    dark = sum(t["text"]) > 400
    od.rectangle([0, 0, w, h], fill=(0, 0, 0, 70) if dark else (255, 255, 255, 80))
    img = Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")
    d = ImageDraw.Draw(img)
    scale = w / 440
    f1 = font(int(40 * scale), True)
    f2 = font(int(15 * scale))
    d.text((int(24 * scale) + 2, int(96 * scale) + 2), t["name"], font=f1, fill=(0, 0, 0) if dark else (255, 255, 255))
    d.text((int(24 * scale), int(96 * scale)), t["name"], font=f1, fill=t["text"])
    d.text((int(26 * scale), int(150 * scale)), t["tagline"], font=f2, fill=t["text"])
    d.text((int(26 * scale), int(176 * scale)), "A browser theme", font=f2, fill=t["accent"] if dark else t["text"])
    return img


def build(t):
    out = ROOT / t["slug"]
    img_dir = out / "images"
    store = out / "store"
    img_dir.mkdir(parents=True, exist_ok=True)
    store.mkdir(parents=True, exist_ok=True)
    scene = t["scene"]()
    scene.save(img_dir / "theme_ntp_background.png", optimize=True)
    make_frame(t).save(img_dir / "theme_frame.png", optimize=True)
    make_toolbar(t).save(img_dir / "theme_toolbar.png", optimize=True)
    manifest = {
        "manifest_version": 3,
        "name": t["name"],
        "version": t["version"],
        "description": t["description"],
        "theme": {
            "images": {
                "theme_frame": "images/theme_frame.png",
                "theme_toolbar": "images/theme_toolbar.png",
                "theme_ntp_background": "images/theme_ntp_background.png",
            },
            "colors": t["colors"],
            "properties": {"ntp_background_alignment": t["ntp_alignment"], "ntp_background_repeat": "no-repeat"},
        },
    }
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    make_icon(t, scene).save(store / "icon-128.png", optimize=True)
    mock_browser(t, scene).save(store / "screenshot-1280x800.png", optimize=True)
    make_promo(t, scene, (440, 280)).save(store / "promo-440x280.png", optimize=True)
    make_promo(t, scene, (1400, 560)).save(store / "marquee-1400x560.png", optimize=True)
    zpath = out / f"{t['slug']}.zip"
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for rel in ["manifest.json", "images/theme_frame.png", "images/theme_toolbar.png", "images/theme_ntp_background.png"]:
            zi = zipfile.ZipInfo(rel, date_time=(2026, 10, 27, 0, 0, 0))
            zi.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(zi, (out / rel).read_bytes())
    return zpath


if __name__ == "__main__":
    import sys
    wanted = sys.argv[1:]  # optional slugs; default: all
    for theme in THEMES:
        if not wanted or theme["slug"] in wanted:
            print("built", build(theme))
