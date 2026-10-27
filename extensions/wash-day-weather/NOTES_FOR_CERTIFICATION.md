# Notes for certification: Wash Day Weather 1.0.0

Paste into the "Notes for certification" box of the Microsoft Partner Center submission (written before submitting, so the reviewer can follow it without contacting us).

**What it does:** Show a seven-day forecast for one UAE city, scored for how good each day is for washing a car.

**No sign-in is needed.** There is no account, no paid feature and no remote code. All scripts are inside the package. The popup has no inline scripts and loads no remote files.

**Permissions:** `storage`. Each is justified in the listing and below.

- `storage`: Remembers the selected city between sessions (one short string). Nothing else is stored.

**Network:** The popup calls `https://api.open-meteo.com/v1/forecast` and `https://air-quality-api.open-meteo.com/v1/air-quality` (both send CORS headers, so no host permission is needed). The request contains the fixed latitude and longitude of the chosen city. No cookies, identifiers or user data are sent.

**Data:** no personal data is collected, sold or shared. Nothing leaves the browser except what is described under Network.

**How to test (about two minutes):**
1. Click the toolbar icon. The popup lists seven days with a green, amber or red score and a line saying why.
2. Open the city drop-down and choose Dubai. The list reloads with different values.
3. Close and reopen the popup: Dubai is still selected.
4. Turn the network off and reopen: the popup says "Could not load the forecast." and shows the error, with no crash.

**Source:** plain JavaScript, not minified. The package is the `src/` folder of https://github.com/nbkdevs/turbo-luxury (`extensions/wash-day-weather/src`) plus a generated `manifest.json`.
