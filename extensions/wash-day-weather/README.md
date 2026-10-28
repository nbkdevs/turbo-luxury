# Wash Day Weather

Find the best day this week to wash your car. Search any town or city and every one of the next seven days gets a score from 0 to 100 based on rain, dust, wind and temperature.

![popup](store/screenshot-01-1280x800.png)

## Layout
- `src/`: the extension (plain HTML, CSS and JavaScript, no dependencies, no build step). `lib.js` holds the logic and is unit-tested.
- `test/lib.test.js`: unit tests.
- `dist/wash-day-weather-firefox.zip` and `dist/wash-day-weather-edge.zip`: upload packages made by `../_tools/build.py` (the two differ only in `manifest.json`).
- `store/`: screenshots (1280×800), small promo tile (440×280) and 300×300 logo.
- `LISTING.md`: every store field. `NOTES_FOR_CERTIFICATION.md`: the Edge reviewer notes.

## Permissions
| Permission | Why |
|---|---|
| `storage` | Remembers the chosen place (its name and coordinates rounded to two decimals) and the °C/°F setting between sessions. Nothing else is stored. |

No host permissions: all three endpoints send `Access-Control-Allow-Origin: *`, so the popup can call them with plain `fetch`.

There is no "use my location" button on purpose: it would need the `geolocation` permission, which shows a "know your location" warning at install. Searching for a place gives the same result without it.

Network: when you search, the popup sends the text you typed to `https://geocoding-api.open-meteo.com/v1/search`. For the forecast it sends the chosen place's latitude and longitude, rounded to two decimals (about 1 km), to `https://api.open-meteo.com/v1/forecast` and `https://air-quality-api.open-meteo.com/v1/air-quality`. No cookies, identifiers or other data are sent, and nothing is sent to the developer. Because a place's coordinates go to a third-party API, the Firefox manifest declares `data_collection_permissions.required: ["locationInfo"]`.

## Develop and test
```
node --test extensions/wash-day-weather/test/
python extensions/_tools/build.py wash-day-weather
python extensions/_tools/render_screens.py wash-day-weather
web-ext lint -s extensions/wash-day-weather/build/firefox
```
14 `node:test` cases (scoring tiers incl. cold days, clamping, dust aggregation, merging both feeds, best-day choice, weekday, forecast and geocoding URLs, place parsing, stored-place validation, unit formatting, empty input).

Licence: MIT.
