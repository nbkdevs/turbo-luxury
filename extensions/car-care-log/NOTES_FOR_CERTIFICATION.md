# Notes for certification: Car Care Service Log 1.0.0

Paste into the "Notes for certification" box of the Microsoft Partner Center submission (written before submitting, so the reviewer can follow it without contacting us).

**What it does:** Keep a log of car services and remind the user when the next one is due.

**No sign-in is needed.** There is no account, no paid feature and no remote code. All scripts are inside the package. The popup has no inline scripts and loads no remote files.

**Permissions:** `storage`, `alarms`, `notifications`. Each is justified in the listing and below.

- `storage`: Keeps the service log, the current odometer and the date of the last reminder in local extension storage.
- `alarms`: Schedules one repeating 24-hour alarm that runs the due-date check.
- `notifications`: Shows the single daily "Car care reminder" notification when a service is overdue or due within 7 days.

**Network:** None. The extension makes no network requests and has no host permissions.

**Data:** no personal data is collected, sold or shared. Nothing leaves the browser except what is described under Network.

**How to test (about two minutes):**
1. Click the icon, open "Add a service", choose Car wash, enter a date 20 days ago and press Save. The wash row turns red and says "overdue 6 d".
2. Add Oil and filter with today's date and odometer 40000, then under Settings set the current odometer to 48000. The oil row shows "500 km over" in red.
3. Press Export CSV: a car-care-log.csv file downloads.
4. To see the notification without waiting a day, open the browser's extension page, inspect the background page / service worker, and run `chrome.alarms.create('daily-check',{delayInMinutes:0.1})`. A "Car care reminder" notification appears (once per day).

**Source:** plain JavaScript, not minified. The package is the `src/` folder of https://github.com/nbkdevs/turbo-luxury (`extensions/car-care-log/src`) plus a generated `manifest.json`.
