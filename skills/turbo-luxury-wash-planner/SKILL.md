---
name: turbo-luxury-wash-planner
description: "Pick a mobile car wash package for a car in the UAE and build a dated wash plan with a cost range in AED. Use when someone asks how often to wash their car in Abu Dhabi or Dubai, which wash package they need, or what a few months of washing will cost."
license: MIT
metadata: {"openclaw": {"requires": {"bins": ["npx"]}, "homepage": "https://turboluxurycarwash.ae/"}}
---

# Wash planner

## When to use

- "How often should I wash my SUV if it is parked outside in Abu Dhabi?"
- "Which wash package do I need? The seats are stained and the AC smells."
- "What will three months of washing cost?"

## Commands

Run with Node 18+ (no install needed). Add `--json` for machine-readable output.

```bash
npx -y turbo-luxury-wash-advisor packages
npx -y turbo-luxury-wash-advisor recommend --vehicle suv --parking outdoor --driving desert --pets --seat-stains
npx -y turbo-luxury-wash-advisor plan --months 3 --start 2026-11-01 --parking outdoor
```

Options: `--vehicle sedan|suv|luxury|sports`, `--parking outdoor|covered|garage`, `--driving city|mixed|desert`,
`--smoker --pets --kids --seat-stains --ac-smell --hazy-headlights`,
`--months-since-wax N --months-since-deep-interior N --months-since-engine-clean N`.

## Notes

- Packages and prices (AED): Quick Shine 60-70, Golden Shine 100-120, Diamond Shine 150-170, Detailing Shine 300.
- The wash interval is based on parking and driving (outdoor parking and desert driving shorten it) and is clamped between 4 and 21 days.
- Costs are ranges from the published price list, not a quote. Bookings are made by WhatsApp or phone on +971 56 989 2095.

## Links

- Website: [mobile car wash Abu Dhabi](https://turboluxurycarwash.ae/)
- Source code: [https://github.com/nbkdevs/turbo-luxury](https://github.com/nbkdevs/turbo-luxury/tree/main/packages/npm)
- Licence: MIT
