# Store listing: Car Care Service Log

Nothing here has been submitted. Firefox AMO and Microsoft Edge Add-ons only (extensions are not offered on the Chrome Web Store; the Chrome store is used for the themes).
The extension's code, popup and descriptions contain **no link to or mention of any website**. The site URL appears only in the Homepage, Support and Privacy fields below.

## Common
| Field | Value |
|---|---|
| Name | Car Care Service Log |
| Version | 1.0.0 |
| Licence | MIT |
| Summary | Log washes, oil changes, tyres, AC and more, see what is overdue or due soon, and get one daily reminder. Data stays in your browser. |
| Features | Eight service types with sensible hot-climate intervals; Overdue, due soon and OK states, worst first; Kilometres left when you enter the odometer; One daily reminder notification, only when needed; CSV export; No network access, no account |
| Single purpose | Keep a log of car services and remind the user when the next one is due. |
| Homepage URL | https://turboluxurycarwash.ae/ |
| Support URL | https://github.com/nbkdevs/turbo-luxury/issues |
| Anchor used | none in text; the site is a plain URL in the Homepage field only |
| Target page | homepage |
| Data collected | none |
| Remote code | none |

### Detailed description
Car Care Service Log is a small maintenance diary for your car. Pick the service (wash, oil and filter, tyre rotation, battery, AC, brakes, polish and wax, registration), enter the date and optionally the odometer, and the popup shows every service sorted by what needs attention first: overdue, due soon, or fine.

Default intervals suit hot-climate driving: wash 14 days, polish and wax 120 days, oil and tyres 180 days or 7,500 / 10,000 km, brakes 20,000 km, battery, AC and registration yearly. If you enter your current odometer the popup also shows kilometres left or over.

A reminder appears at most once a day, only when something is overdue or due within a week. Export your whole log to CSV any time.

Privacy: everything is stored in your browser's local extension storage. There is no account and no network access.

### Permission justifications
| Permission | Justification |
|---|---|
| `storage` | Keeps the service log, the current odometer and the date of the last reminder in local extension storage. |
| `alarms` | Schedules one repeating 24-hour alarm that runs the due-date check. |
| `notifications` | Shows the single daily "Car care reminder" notification when a service is overdue or due within 7 days. |

## Firefox AMO
| Field | Value |
|---|---|
| Package | [dist/car-care-log-firefox.zip](dist/car-care-log-firefox.zip) |
| Add-on ID | `car-care-log@nbkdevs.github.io` (neutral id; the client's domain is deliberately not used) |
| Minimum version | Firefox 140.0, Firefox for Android 142.0 |
| Data collection permissions | `required: ["none"]` |
| Category | Other |
| Tags | car, maintenance, service log, reminder, oil change |
| Homepage | https://turboluxurycarwash.ae/ |
| Support site | https://github.com/nbkdevs/turbo-luxury/issues |
| Support email | (fill in at submission) |
| Privacy policy | leave blank (no data collected), fallback https://turboluxurycarwash.ae/privacy-policy/ |
| Licence | MIT |
| Notes to reviewer | Plain JavaScript, no build step: the zip is `extensions/car-care-log/src` plus a generated `manifest.json` (`python extensions/_tools/build.py car-care-log`). None. The extension makes no network requests and has no host permissions. |
| Screenshots | see below |
| Source code upload | not required (no minification or bundling) |

## Microsoft Edge Add-ons
| Field | Value |
|---|---|
| Package | [dist/car-care-log-edge.zip](dist/car-care-log-edge.zip) |
| Category | Productivity |
| Search terms | car maintenance, service log, oil change, car reminder |
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
- 8 `node:test` cases (date maths, latest-per-type, overdue by days and by km, custom intervals, soon threshold, notification text, CSV escaping, form validation): pass.
- `web-ext lint` on the Firefox build: 0 errors, 0 warnings, 0 notices.
- Package checks (`python -m unittest discover -s extensions/_tools`): manifest, referenced files, no inline or remote scripts, no site mention, zips match `src/`.
- Popup rendered in headless Chrome with demo data for the screenshots.
- Not tested: loading the unpacked extension in a real Firefox or Edge profile (not available on the box).
