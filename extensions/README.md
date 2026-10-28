# Browser extensions (Firefox AMO and Microsoft Edge Add-ons)

Three small, independent tools for car owners. **Only Wash Day Weather will be published** (Nazzal, 28 Oct 2026: one extension only); the other two are kept here but dropped. Each is a Manifest V3 extension in plain JavaScript with no dependencies. They are for Firefox AMO and Edge only; the Chrome Web Store gets the [themes](../themes).

| Extension | What it does | Permissions |
|---|---|---|
| [Wash Day Weather](wash-day-weather) (published) | scores the next 7 days for washing a car (rain, dust, wind, temperature) for any town or city the user searches | `storage` |
| [Car Care Service Log](car-care-log) (dropped) | service diary with overdue / due-soon list and a daily reminder | `storage`, `alarms`, `notifications` |
| [Fuel Economy Log](fuel-economy-log) (dropped) | L/100 km, km/L and AED per km from fill-ups | `storage` |

None of the extensions links to or mentions any website in code, UI or descriptions. The site URL only appears in the store Homepage / Support / Privacy fields recorded in each `LISTING.md`.

## Commands (from the repo root)
```
node --test extensions/wash-day-weather/test/ extensions/car-care-log/test/ extensions/fuel-economy-log/test/
python extensions/_tools/build.py                       # builds build/ and dist/*.zip, deterministic
python -m unittest discover -s extensions/_tools        # package checks
web-ext lint -s extensions/<slug>/build/firefox
python extensions/_tools/make_icons.py                  # needs Pillow
python extensions/_tools/render_screens.py [slug]       # needs Pillow and google-chrome
```
The Firefox and Edge zips differ only in `manifest.json`: Firefox gets `browser_specific_settings` (id `<slug>@nbkdevs.github.io`, `strict_min_version` 140.0, Android 142.0, `data_collection_permissions` from `build.py`: `locationInfo` for Wash Day Weather, `none` for the others) and `background.scripts`; Edge gets `background.service_worker`.

Edge reviewers get a `NOTES_FOR_CERTIFICATION.md` per extension with numbered test steps.
