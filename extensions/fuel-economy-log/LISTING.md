# Store listing: Fuel Economy Log

Nothing here has been submitted. Firefox AMO and Microsoft Edge Add-ons only (extensions are not offered on the Chrome Web Store; the Chrome store is used for the themes).
The extension's code, popup and descriptions contain **no link to or mention of any website**. The site URL appears only in the Homepage, Support and Privacy fields below.

## Common
| Field | Value |
|---|---|
| Name | Fuel Economy Log |
| Version | 1.0.0 |
| Licence | MIT |
| Summary | Log fill-ups to see litres per 100 km, km per litre and AED per km. Works offline and keeps your data in your browser. |
| Features | L/100 km, km/L and AED per km from full-tank to full-tank; Partial fills handled correctly; Checks that the odometer fits your earlier entries; CSV export; No network access, no account |
| Single purpose | Record fuel fill-ups and show the resulting fuel consumption and cost per kilometre. |
| Homepage URL | https://turboluxurycarwash.ae/ |
| Support URL | https://github.com/nbkdevs/turbo-luxury/issues |
| Anchor used | none in text; the site is a plain URL in the Homepage field only |
| Target page | homepage |
| Data collected | none |
| Remote code | none |

### Detailed description
Fuel Economy Log turns your fill-ups into three numbers that matter: litres per 100 km, kilometres per litre, and what each kilometre costs you in AED.

Each time you fill up, enter the date, the odometer, the litres and (optionally) the price per litre, and tick "Filled the tank to full" if you topped up. Consumption is calculated between consecutive full tanks, partial fills in between are included automatically, so the figures are not skewed by half-fills.

The popup shows your overall average, your recent entries and lets you export everything as CSV. The spreadsheet-friendly export has one row per fill-up.

Privacy: data is kept in local extension storage. There is no account, no analytics and no network access.

### Permission justifications
| Permission | Justification |
|---|---|
| `storage` | Stores the list of fill-ups (date, odometer, litres, optional price) in local extension storage. |

## Firefox AMO
| Field | Value |
|---|---|
| Package | [dist/fuel-economy-log-firefox.zip](dist/fuel-economy-log-firefox.zip) |
| Add-on ID | `fuel-economy-log@nbkdevs.github.io` (neutral id; the client's domain is deliberately not used) |
| Minimum version | Firefox 140.0, Firefox for Android 142.0 |
| Data collection permissions | `required: ["none"]` |
| Category | Other |
| Tags | fuel, mileage, consumption, car, AED |
| Homepage | https://turboluxurycarwash.ae/ |
| Support site | https://github.com/nbkdevs/turbo-luxury/issues |
| Support email | (fill in at submission) |
| Privacy policy | leave blank (no data collected), fallback https://turboluxurycarwash.ae/privacy-policy/ |
| Licence | MIT |
| Notes to reviewer | Plain JavaScript, no build step: the zip is `extensions/fuel-economy-log/src` plus a generated `manifest.json` (`python extensions/_tools/build.py fuel-economy-log`). None. The extension makes no network requests and has no host permissions. |
| Screenshots | see below |
| Source code upload | not required (no minification or bundling) |

## Microsoft Edge Add-ons
| Field | Value |
|---|---|
| Package | [dist/fuel-economy-log-edge.zip](dist/fuel-economy-log-edge.zip) |
| Category | Productivity |
| Search terms | fuel economy, l per 100km, fuel log, mileage tracker |
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
- 9 `node:test` cases (segments, partial fills, summary totals, best and worst, unsorted input, monthly spend, validation, CSV): pass.
- `web-ext lint` on the Firefox build: 0 errors, 0 warnings, 0 notices.
- Package checks (`python -m unittest discover -s extensions/_tools`): manifest, referenced files, no inline or remote scripts, no site mention, zips match `src/`.
- Popup rendered in headless Chrome with demo data for the screenshots.
- Not tested: loading the unpacked extension in a real Firefox or Edge profile (not available on the box).
