# Store listing: Wash Day Weather

Nothing here has been submitted. Firefox AMO and Microsoft Edge Add-ons only (extensions are not offered on the Chrome Web Store; the Chrome store is used for the themes).
The extension's code, popup and descriptions contain **no link to or mention of any website**. The site URL appears only in the Homepage, Support and Privacy fields below.

## Common
| Field | Value |
|---|---|
| Name | Wash Day Weather |
| Version | 1.0.0 |
| Licence | MIT |
| Summary | Seven-day car wash planner for the UAE. Scores every day on rain, dust, wind and heat and shows the best day to wash. |
| Features | Seven-day score from 0 to 100 for each day; Rain, dust, wind and heat each explained in plain words; Best day highlighted at the top; Five UAE cities; No account, no tracking, no ads |
| Single purpose | Show a seven-day forecast for one UAE city, scored for how good each day is for washing a car. |
| Homepage URL | https://turboluxurycarwash.ae/ |
| Support URL | https://github.com/nbkdevs/turbo-luxury/issues |
| Anchor used | none in text; the site is a plain URL in the Homepage field only |
| Target page | homepage |
| Data collected | none |
| Remote code | none |

### Detailed description
Washing a car and then watching dust or rain undo it is the most common car-care complaint in the UAE. Wash Day Weather checks the next seven days for your emirate and gives each day a score from 0 to 100.

How the score works: it starts at 100 and loses points for chance of rain, airborne dust (from the Open-Meteo air-quality model), strong wind and extreme heat. The popup tells you why a day lost points ("heavy dust (210 µg/m³)", "very hot, wash before 9 am") and highlights the best day.

Cities: Abu Dhabi, Dubai, Al Ain, Sharjah and Ras Al Khaimah. Your choice is remembered.

Privacy: no account, no tracking, no analytics. The popup asks Open-Meteo for the forecast of the city you picked. Only the city's fixed coordinates are sent, never your location.

### Permission justifications
| Permission | Justification |
|---|---|
| `storage` | Remembers the selected city between sessions (one short string). Nothing else is stored. |

## Firefox AMO
| Field | Value |
|---|---|
| Package | [dist/wash-day-weather-firefox.zip](dist/wash-day-weather-firefox.zip) |
| Add-on ID | `wash-day-weather@nbkdevs.github.io` (neutral id; the client's domain is deliberately not used) |
| Minimum version | Firefox 140.0, Firefox for Android 142.0 |
| Data collection permissions | `required: ["none"]` |
| Category | Other |
| Tags | car wash, weather, UAE, dust, forecast, planner |
| Homepage | https://turboluxurycarwash.ae/ |
| Support site | https://github.com/nbkdevs/turbo-luxury/issues |
| Support email | (fill in at submission) |
| Privacy policy | leave blank (no data collected), fallback https://turboluxurycarwash.ae/privacy-policy/ |
| Licence | MIT |
| Notes to reviewer | Plain JavaScript, no build step: the zip is `extensions/wash-day-weather/src` plus a generated `manifest.json` (`python extensions/_tools/build.py wash-day-weather`). The popup calls `https://api.open-meteo.com/v1/forecast` and `https://air-quality-api.open-meteo.com/v1/air-quality` (both send CORS headers, so no host permission is needed). The request contains the fixed latitude and longitude of the chosen city. No cookies, identifiers or user data are sent. |
| Screenshots | see below |
| Source code upload | not required (no minification or bundling) |

## Microsoft Edge Add-ons
| Field | Value |
|---|---|
| Package | [dist/wash-day-weather-edge.zip](dist/wash-day-weather-edge.zip) |
| Category | Productivity |
| Search terms | car wash weather, dust forecast, uae weather, wash day |
| Website URL | https://turboluxurycarwash.ae/ |
| Support URL | https://github.com/nbkdevs/turbo-luxury/issues |
| Privacy policy URL | https://turboluxurycarwash.ae/privacy-policy/ |
| Store logo (300×300) | [store/logo-300x300.png](store/logo-300x300.png) |
| Small promo tile (440×280) | [store/promo-440x280.png](store/promo-440x280.png) |
| Notes for certification | [NOTES_FOR_CERTIFICATION.md](NOTES_FOR_CERTIFICATION.md) |

## Images
| Item | File |
|---|---|
| Icon 128 | [src/icons/icon-128.png](src/icons/icon-128.png) |
| Screenshot 1 | [store/screenshot-01-1280x800.png](store/screenshot-01-1280x800.png) |
| Screenshot 2 | [store/screenshot-02-1280x800.png](store/screenshot-02-1280x800.png) |
| Small promo 440×280 | [store/promo-440x280.png](store/promo-440x280.png) |
| Logo 300×300 | [store/logo-300x300.png](store/logo-300x300.png) |

## Tested here
- 9 `node:test` cases (scoring tiers, clamping, dust aggregation, merging both feeds, best-day choice, weekday, URLs, empty input): pass.
- `web-ext lint` on the Firefox build: 0 errors, 0 warnings, 0 notices.
- Package checks (`python -m unittest discover -s extensions/_tools`): manifest, referenced files, no inline or remote scripts, no site mention, zips match `src/`.
- Popup rendered in headless Chrome with demo data for the screenshots.
- Not tested: loading the unpacked extension in a real Firefox or Edge profile (not available on the box).
