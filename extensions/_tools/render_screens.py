"""Render each extension popup in headless Chrome with demo data and compose store images.

Needs: google-chrome, Pillow. Output per extension in <slug>/store/:
  screenshot-01-1280x800.png, screenshot-02-1280x800.png, promo-440x280.png (logo-300x300.png comes from make_icons.py)
Demo dates are relative to today, so the output changes day to day.
"""
import datetime as dt
import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
TMP = Path("/tmp/ext-render")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
today = dt.date.today()


def d(i):
    return (today + dt.timedelta(days=i)).isoformat()


def forecast():
    n = 7
    return {"daily": {
        "time": [d(i) for i in range(n)],
        "precipitation_probability_max": [0, 0, 5, 35, 70, 0, 0],
        "wind_speed_10m_max": [14, 18, 22, 33, 41, 16, 12],
        "temperature_2m_max": [36, 37, 38, 35, 34, 39, 41],
        "uv_index_max": [8, 8, 8, 7, 6, 8, 9]}}


def air():
    times, dust = [], []
    for i, peak in enumerate([20, 45, 80, 130, 210]):
        for h in (6, 12, 18):
            times.append(f"{d(i)}T{h:02d}:00")
            dust.append(peak * (0.5 if h == 6 else 1))
    return {"hourly": {"time": times, "dust": dust}}


def fuel_entries():
    rows = [(-70, 41200, 38.5, 2.77), (-52, 41690, 40.1, 2.82), (-33, 42160, 37.9, 2.88), (-15, 42655, 40.8, 2.91), (-2, 43120, 38.0, 2.95)]
    return [{"date": d(i), "odometer": o, "litres": l, "price": p, "full": True} for i, o, l, p in rows]


def care_entries():
    return [
        {"type": "wash", "date": d(-17), "note": ""},
        {"type": "oil", "date": d(-120), "odometer": 38200, "note": "synthetic 5W-30"},
        {"type": "tyres", "date": d(-150), "odometer": 33100, "note": ""},
        {"type": "polish", "date": d(-60), "note": ""},
        {"type": "ac", "date": d(-300), "note": "before summer"},
        {"type": "battery", "date": d(-100), "note": ""},
    ]


SPECS = {
    "wash-day-weather": {
        "title": "Wash Day Weather", "tag": "Pick the best day to wash your car",
        "caps": ["Seven days scored on rain, dust, wind and heat", "Choose your emirate; best day is picked for you"],
        "colors": ((22, 110, 160), (120, 190, 225)),
        "state": {"city": "abu-dhabi"}, "fetch": True, "open": [False, False],
    },
    "car-care-log": {
        "title": "Car Care Service Log", "tag": "Know what your car needs next",
        "caps": ["See every service that is overdue or due soon", "Log a service in seconds, export to CSV"],
        "colors": ((176, 112, 24), (240, 205, 140)),
        "state": {"entries": care_entries(), "settings": {}, "odometer": 43120}, "fetch": False, "open": [False, True],
    },
    "fuel-economy-log": {
        "title": "Fuel Economy Log", "tag": "L/100 km and AED per km from your fill-ups",
        "caps": ["Consumption and cost per kilometre at a glance", "Works offline, data stays in your browser"],
        "colors": ((24, 120, 78), (150, 215, 185)),
        "state": {"entries": fuel_entries()}, "fetch": False, "open": [True, True],
    },
}


def shim(spec):
    js = ("const __S=%s;window.chrome=window.chrome||{};"
          "chrome.storage={local:{get:(k,cb)=>{const o={};for(const x in k)o[x]=(x in __S)?__S[x]:k[x];cb&&cb(o)},"
          "set:(o,cb)=>{Object.assign(__S,o);cb&&cb()}}};" % json.dumps(spec["state"]))
    if spec["fetch"]:
        js += ("const __F=%s,__A=%s;window.fetch=async u=>({ok:true,status:200,json:async()=>String(u).includes('air-quality')?__A:__F});"
               % (json.dumps(forecast()), json.dumps(air())))
    return js


def render_popup(slug, spec, variant):
    dst = TMP / f"{slug}-{variant}"
    shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(ROOT / slug / "src", dst)
    (dst / "shim.js").write_text(shim(spec))
    html = (dst / "popup.html").read_text()
    html = html.replace('<script src="lib.js">', '<script src="shim.js"></script>\n  <script src="lib.js">', 1)
    if spec["open"][variant]:
        html = html.replace("<details>", "<details open>")
    (dst / "popup.html").write_text(html)
    png = TMP / f"{slug}-{variant}.png"
    subprocess.run(["google-chrome", "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
                    "--force-device-scale-factor=2", "--window-size=340,1100", "--virtual-time-budget=3000",
                    f"--screenshot={png}", f"file://{dst}/popup.html"], check=True, capture_output=True)
    im = Image.open(png).convert("RGB")
    bg = im.getpixel((2, im.height - 2))
    px = im.load()
    last = 0
    for y in range(im.height - 1, 0, -1):
        if any(px[x, y] != bg for x in range(0, im.width, 3)):
            last = y
            break
    return im.crop((0, 0, im.width, min(im.height, last + 28)))


def gradient(size, c1, c2):
    w, h = size
    im = Image.new("RGB", size)
    dr = ImageDraw.Draw(im)
    for y in range(h):
        t = y / (h - 1)
        dr.line((0, y, w, y), fill=tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)))
    return im


def wrap(text, font, width, dr):
    lines, cur = [], ""
    for word in text.split():
        trial = (cur + " " + word).strip()
        if dr.textlength(trial, font=font) <= width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    lines.append(cur)
    return lines


def compose_screenshot(spec, popup, caption, icon):
    im = gradient((1280, 800), *spec["colors"])
    dr = ImageDraw.Draw(im)
    tf, cf = ImageFont.truetype(BOLD, 52), ImageFont.truetype(FONT, 30)
    p = popup
    maxh = 700
    if p.height > maxh:
        p = p.resize((int(p.width * maxh / p.height), maxh), Image.LANCZOS)
    else:
        s = min(1.6, maxh / p.height)
        p = p.resize((int(p.width * s), int(p.height * s)), Image.LANCZOS)
    x, y = 110, (800 - p.height) // 2
    dr.rounded_rectangle((x - 6, y - 6, x + p.width + 6, y + p.height + 6), radius=18, fill=(255, 255, 255))
    im.paste(p, (x, y))
    tx = x + p.width + 90
    width = 1280 - tx - 60
    y2 = 270
    for line in wrap(spec["title"], tf, width, dr):
        dr.text((tx, y2), line, font=tf, fill=(255, 255, 255))
        y2 += 64
    y2 += 12
    for line in wrap(caption, cf, width, dr):
        dr.text((tx, y2), line, font=cf, fill=(255, 255, 255))
        y2 += 40
    ic = icon.resize((96, 96), Image.LANCZOS)
    im.paste(ic, (tx, 150), ic)
    return im


def compose_promo(spec, icon):
    im = gradient((440, 280), *spec["colors"])
    dr = ImageDraw.Draw(im)
    ic = icon.resize((84, 84), Image.LANCZOS)
    im.paste(ic, (28, 28), ic)
    dr.text((28, 135), spec["title"], font=ImageFont.truetype(BOLD, 30), fill=(255, 255, 255))
    dr.text((28, 185), spec["tag"], font=ImageFont.truetype(FONT, 15), fill=(255, 255, 255))
    return im


def main():
    TMP.mkdir(parents=True, exist_ok=True)
    for slug, spec in SPECS.items():
        store = ROOT / slug / "store"
        store.mkdir(parents=True, exist_ok=True)
        icon = Image.open(ROOT / slug / "src/icons/icon-128.png").convert("RGBA")
        for v in (0, 1):
            popup = render_popup(slug, spec, v)
            compose_screenshot(spec, popup, spec["caps"][v], icon).save(store / f"screenshot-0{v + 1}-1280x800.png", optimize=True)
        compose_promo(spec, icon).save(store / "promo-440x280.png", optimize=True)
        print("rendered", slug)


if __name__ == "__main__":
    main()
