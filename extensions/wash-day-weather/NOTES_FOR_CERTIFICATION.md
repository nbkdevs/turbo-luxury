# Notes for certification: Wash Day Weather 1.0.0

Paste into the "Notes for certification" box of the Microsoft Partner Center submission (written before submitting, so the reviewer can follow it without contacting us).

**What it does:** Shows a seven-day forecast for a town or city the user searches for, with each day scored for how good it is for washing a car.

**No sign-in is needed.** There is no account, no paid feature and no remote code. All scripts are inside the package. The popup has no inline scripts and loads no remote files.

**Permissions:** `storage` only. No host permissions.

- `storage`: Remembers the chosen place (name and coordinates rounded to two decimals) and the °C/°F setting between sessions. Nothing else is stored.

**Network:** Searching sends the typed text to `https://geocoding-api.open-meteo.com/v1/search`. The forecast calls `https://api.open-meteo.com/v1/forecast` and `https://air-quality-api.open-meteo.com/v1/air-quality` with the chosen place's latitude and longitude rounded to two decimals. All three are free, keyless public APIs that send CORS headers, so no host permission is needed. No cookies, identifiers or user data are sent, and nothing is sent to the developer.

**Data:** no personal data is collected, sold or shared by the developer. The browser's own location is never read (the extension does not request `geolocation`).

**How to test (about two minutes):**
1. Click the toolbar icon. On first run the place box is open with a search field.
2. Type any town or city name (for example the reviewer's own) and press Search. Pick one of the results.
3. The popup lists seven days with a green, amber or red score and a line saying why, and the best day at the top.
4. Switch the units menu to °F, mph: the values change without a reload.
5. Close and reopen the popup: the same place and units are still selected.
6. Click Change, search for a different place and pick it: the list reloads with different values.
7. Turn the network off and reopen: the popup says "Could not load the forecast." and shows the error, with no crash.

**Source:** vanilla JavaScript, not minified or bundled. The package contents are the source.
