# Store listing: Wash Day Weather

Nothing here has been submitted. Firefox AMO and Microsoft Edge Add-ons only (the theme goes to the other store).
The extension's code, popup and descriptions have **no link to or mention of any website, brand or place**. The site URL appears only in the Homepage / Website, Support and (Edge) Privacy fields below.

## Common
| Field | Value |
|---|---|
| Name | Wash Day Weather |
| Version | 1.0.0 |
| Licence | MIT |
| Summary | Find the best day this week to wash your car. Scores 7 days for any town or city on rain, dust, wind and temperature. |
| Features | Seven-day score from 0 to 100 for each day; Rain, dust, wind and temperature each shown with a short reason; Best day highlighted at the top; Search any town or city, your choice is remembered; °C and km/h or °F and mph; No account, no tracking, no ads |
| Single purpose | Show a seven-day forecast for one chosen town or city, scored for how good each day is for washing a car. |
| Homepage URL | https://turboluxurycarwash.ae/ |
| Support URL | https://turboluxurycarwash.ae/ |
| Anchor used | none in text; the site is a bare URL in the Homepage / Website and Support fields only |
| Target page | homepage |
| Data collected by the developer | none |
| Remote code | none |

### Detailed description
Nothing is more annoying than washing the car and watching rain, dust or wind undo it the next morning. Wash Day Weather looks at the next seven days wherever you live and gives each day a score from 0 to 100, so you can see the best day to wash at a glance.

How the score works: every day starts at 100 and loses points for a chance of rain, airborne dust, strong wind, extreme heat and freezing cold. Each day says why it lost points, for example "chance of rain (35%)", "dusty (130 µg/m³)" or "below freezing, water may freeze", and the best day is shown at the top.

Getting started: open the popup, type the name of your town or city and pick it from the list. Your choice is remembered, and you can change it at any time. Temperatures and wind can be shown in °C and km/h or in °F and mph.

Privacy: no account, no tracking, no analytics, no ads. The extension never reads your device's location. Only the place you search for and its approximate coordinates are sent to the free open weather service that provides the forecast, and nothing is sent to the developer.

### Permission justifications
| Permission | Justification |
|---|---|
| `storage` | Remembers the chosen place (its name and coordinates rounded to two decimals) and the °C/°F setting between sessions. Nothing else is stored. |
| Host permissions | none requested. The weather, air-quality and place-search APIs send CORS headers, so the popup can call them without host access. |

## Firefox AMO
| Field | Value |
|---|---|
| Package | [dist/wash-day-weather-firefox.zip](dist/wash-day-weather-firefox.zip) |
| Add-on ID | `wash-day-weather@nbkdevs.github.io` (neutral id; the client's site is deliberately not used) |
| Minimum version | Firefox 140.0, Firefox for Android 142.0 |
| Data collection permissions | `required: ["locationInfo"]` (the chosen place's rounded coordinates go to the forecast API; nothing goes to the developer) |
| Category | Other |
| Tags | car wash, weather, forecast, dust, planner, car care |
| Homepage | https://turboluxurycarwash.ae/ |
| Support site | https://turboluxurycarwash.ae/ |
| Support email | (fill in at submission) |
| Privacy policy | leave blank (the developer collects no data) |
| Licence | MIT |
| Notes to reviewer | Vanilla JavaScript, no build step: the zip is the `src` folder plus a generated `manifest.json`. Searching sends the typed text to `https://geocoding-api.open-meteo.com/v1/search`; the forecast calls `https://api.open-meteo.com/v1/forecast` and `https://air-quality-api.open-meteo.com/v1/air-quality` with the chosen place's latitude and longitude rounded to two decimals. All send CORS headers, so no host permission is needed. The browser's location is never read. No cookies, identifiers or other user data are sent. `locationInfo` is declared because the chosen place's coordinates go to that third-party API. |
| Screenshots | see below |
| Source code upload | not required (no minification or bundling) |

## Microsoft Edge Add-ons
| Field | Value |
|---|---|
| Package | [dist/wash-day-weather-edge.zip](dist/wash-day-weather-edge.zip) |
| Category | Productivity |
| Search terms | car wash weather, wash day, dust forecast, rain forecast, car care planner |
| Website URL | https://turboluxurycarwash.ae/ |
| Support URL | https://turboluxurycarwash.ae/ |
| Privacy policy URL | https://turboluxurycarwash.ae/privacy-policy/ |
| Store logo (300×300) | [store/logo-300x300.png](store/logo-300x300.png) |
| Small promo tile (440×280) | [store/promo-440x280.png](store/promo-440x280.png) |
| Notes for certification | [NOTES_FOR_CERTIFICATION.md](NOTES_FOR_CERTIFICATION.md) |

## Images
| Item | File |
|---|---|
| Icon 128 | [src/icons/icon-128.png](src/icons/icon-128.png) |
| Screenshot 1 | [store/screenshot-01-1280x800.png](store/screenshot-01-1280x800.png) (demo place "Your city", °C) |
| Screenshot 2 | [store/screenshot-02-1280x800.png](store/screenshot-02-1280x800.png) (search box open, °F) |
| Small promo 440×280 | [store/promo-440x280.png](store/promo-440x280.png) |
| Logo 300×300 | [store/logo-300x300.png](store/logo-300x300.png) |

## Tested here
- 14 `node:test` cases (scoring tiers incl. cold days, clamping, dust aggregation, merging both feeds, best-day choice, weekday, forecast and geocoding URLs, place parsing, stored-place validation, unit formatting, empty input): pass.
- `web-ext lint` on the Firefox build (28 Oct 2026): 0 errors, 0 warnings, 0 notices.
- Package checks (`python -m unittest discover -s extensions/_tools`): manifest, referenced files, no inline or remote scripts, no site, brand or place names, zips match `src/`.
- Popup rendered in a headless browser with demo data for the screenshots.
- Not tested: loading the unpacked extension in a real Firefox or Edge profile (not available on the box).
