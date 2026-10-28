# Theme store listing: Desert Dusk

Nothing here has been submitted. Paste each field into the developer dashboard of the theme store.
The theme's files and description have **no link to or mention of any website, brand or place**. The site URL appears only in the Homepage and Support URL fields.

| Field | Value |
|---|---|
| Item type | Theme |
| Name | Desert Dusk |
| Version | 1.0.0 |
| Package | [`desert-dusk.zip`](desert-dusk.zip) |
| Category | Themes |
| Language | English |
| Summary (132 max) | A warm desert sunset theme: indigo sky and first stars fading to gold over a low sun and rolling dunes. |
| Store icon (128×128) | [store/icon-128.png](store/icon-128.png) |
| Screenshot (1280×800) | [store/screenshot-1280x800.png](store/screenshot-1280x800.png) |
| Small promo tile (440×280) | [store/promo-440x280.png](store/promo-440x280.png) |
| Marquee (1400×560) | [store/marquee-1400x560.png](store/marquee-1400x560.png) |
| Homepage URL | https://turboluxurycarwash.ae/ |
| Support URL | https://turboluxurycarwash.ae/ |
| Privacy policy URL | leave blank (no data collected) |
| Anchor used | none in text. The site appears only in the Homepage and Support URL fields, as a bare URL, so the theme's files and description carry no link. |
| Target page | homepage |

## Detailed description
Desert Dusk brings the calm of the hour after sunset to your browser. The window frame is deep indigo, the toolbar and active tab are warm cream so text stays easy to read, and the New Tab page shows rolling dunes under a low, glowing sun. Stars come out in the upper sky as the colours fade from gold to violet. Colours were chosen for contrast: dark text on the cream toolbar and light text on the indigo tab strip.

## Features
- Indigo frame with a cream toolbar for readable tabs and address bar
- Full-size New Tab artwork: rolling dunes, low sun and stars
- Matching colours for bookmarks, links and the search box
- No permissions, no scripts, no tracking

## Single purpose
Changes the colours and artwork of the browser window and the New Tab page.

## Permissions
None requested. The theme has no scripts and no host access, so there is nothing to justify.

## Data usage
No data is collected, stored or transmitted. In the Privacy practices tab tick none of the data types and certify the three required statements.

## Tested here
- `python -m unittest discover -s themes/_tools`: manifest limits (name ≤ 45, description ≤ 132), every image size, zip layout, no site, brand or place names in the shipped manifest. Passed.
- Screenshot, promo tile and icon were inspected by eye after generation (no buildings, landmarks or text other than the theme name).
- Not tested: loading in a real browser profile. The browser on the box refuses `--load-extension`.
