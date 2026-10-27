# Chrome Web Store listing: Abu Dhabi Dusk

Nothing here has been submitted. Paste each field into the developer dashboard.

| Field | Value |
|---|---|
| Item type | Theme |
| Name | Abu Dhabi Dusk |
| Version | 1.0.0 |
| Package | [`abu-dhabi-dusk.zip`](abu-dhabi-dusk.zip) |
| Category | Themes |
| Language | English |
| Summary (132 max) | A warm desert sunset theme: indigo sky fading to gold behind a stylised skyline and dunes. |
| Store icon (128×128) | [store/icon-128.png](store/icon-128.png) |
| Screenshot (1280×800) | [store/screenshot-1280x800.png](store/screenshot-1280x800.png) |
| Small promo tile (440×280) | [store/promo-440x280.png](store/promo-440x280.png) |
| Marquee (1400×560) | [store/marquee-1400x560.png](store/marquee-1400x560.png) |
| Homepage URL | https://turboluxurycarwash.ae/ |
| Support URL | https://github.com/nbkdevs/turbo-luxury/issues |
| Privacy policy URL | leave blank (no data collected); fallback https://turboluxurycarwash.ae/privacy-policy/ |
| Anchor used | none in text. The site appears only in the Homepage URL field, as a plain URL, so the theme's code and description carry no link. |
| Target page | homepage |

## Detailed description
Abu Dhabi Dusk gives Chrome the colours of the hour after sunset in the UAE capital. The window frame is deep indigo, the toolbar and active tab are warm cream so text stays easy to read, and the New Tab page shows a hand-drawn skyline with a mosque dome and minarets over rolling dunes. Stars come out in the upper sky and a low sun glows on the horizon. Colours were chosen for contrast: dark text on the cream toolbar and light text on the indigo tab strip.

## Features
- Indigo frame with a cream toolbar for readable tabs and address bar
- Full-size New Tab artwork: skyline, dunes, low sun and stars
- Matching colours for bookmarks, links and the search box
- No permissions, no scripts, no tracking

## Single purpose
Changes the colours and artwork of the Chrome window and the New Tab page.

## Permissions
None requested. The theme has no scripts and no host access, so there is nothing to justify.

## Data usage
No data is collected, stored or transmitted. In the Privacy practices tab tick none of the data types and certify the three required statements.

## Tested here
- `python -m unittest discover -s themes/_tools`: manifest limits (name ≤ 45, description ≤ 132), every image size, zip layout, no site mention in shipped files. Passed.
- Screenshot and marquee were inspected by eye after generation.
- Not tested: loading in a real Chrome profile. The Chrome build on the box refuses `--load-extension`.
