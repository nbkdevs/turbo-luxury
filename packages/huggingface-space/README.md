---
title: Mobile Car Wash Package Picker
emoji: 🚗
colorFrom: blue
colorTo: gray
sdk: static
pinned: false
license: mit
short_description: Pick the right mobile car wash package and cost in AED
---

# Mobile Car Wash Package Picker (Abu Dhabi)

A static page that asks four quick questions and tells you which mobile car wash package fits, what it
includes, and what it costs per visit and for several visits, in AED. It runs entirely in the browser:
no tracking, no network calls, no data stored.

Turbo Luxury Car Wash publishes this as a small helper for anyone comparing a [home car wash Abu Dhabi](https://turboluxurycarwash.ae/) service.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page |
| `picker.js` | The package logic, shared with the Node tests |
| `test/picker.test.js` | Unit tests (`node --test test/`) |

## Deploy

Create a Space with SDK **Static**, upload `README.md`, `index.html` and `picker.js`. (The `test/` folder is optional.)

## Licence

MIT
