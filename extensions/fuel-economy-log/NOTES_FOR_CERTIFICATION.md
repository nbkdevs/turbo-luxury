# Notes for certification: Fuel Economy Log 1.0.0

Paste into the "Notes for certification" box of the Microsoft Partner Center submission (written before submitting, so the reviewer can follow it without contacting us).

**What it does:** Record fuel fill-ups and show the resulting fuel consumption and cost per kilometre.

**No sign-in is needed.** There is no account, no paid feature and no remote code. All scripts are inside the package. The popup has no inline scripts and loads no remote files.

**Permissions:** `storage`. Each is justified in the listing and below.

- `storage`: Stores the list of fill-ups (date, odometer, litres, optional price) in local extension storage.

**Network:** None. The extension makes no network requests and has no host permissions.

**Data:** no personal data is collected, sold or shared. Nothing leaves the browser except what is described under Network.

**How to test (about two minutes):**
1. Click the icon. Enter odometer 10000, litres 40, leave "Filled the tank to full" ticked and press Save. The summary still asks for two full fill-ups.
2. Enter odometer 10500, litres 50, price 2.9 and press Save. The tiles show 10.0 L/100 km and 10.0 km per litre.
3. Try an odometer of 9000 with a later date: an error says the odometer does not fit.
4. Press Export CSV: fuel-economy-log.csv downloads.

**Source:** plain JavaScript, not minified. The package is the `src/` folder of https://github.com/nbkdevs/turbo-luxury (`extensions/fuel-economy-log/src`) plus a generated `manifest.json`.
