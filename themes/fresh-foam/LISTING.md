# Chrome Web Store listing: Fresh Foam

Nothing here has been submitted. Paste each field into the developer dashboard.

| Field | Value |
|---|---|
| Item type | Theme |
| Name | Fresh Foam |
| Version | 1.0.0 |
| Package | [`fresh-foam.zip`](fresh-foam.zip) |
| Category | Themes |
| Language | English |
| Summary (132 max) | A bright, clean theme of soft blue water, drifting bubbles and gentle waves. |
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
Fresh Foam is a light theme built from soft blues, floating bubbles and layered waves. The toolbar is near-white so the address bar and tabs have strong contrast, and the New Tab page shows a calm water scene that stays out of the way of your shortcuts. It suits anyone who likes a bright browser with a clean look.

## Features
- Light blue frame with a near-white toolbar
- Bubble and wave artwork on the New Tab page
- Dark navy text for high contrast
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
