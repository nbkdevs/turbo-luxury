---
name: turbo-luxury-paint-care
description: "Choose between wax, sealant and ceramic coating for hot, dusty climates, work out renewal dates and yearly cost, and decide whether paint needs polishing first. Use when someone asks how often to wax a car in the UAE, whether ceramic is worth it, or when to reapply protection."
license: MIT
metadata: {"openclaw": {"requires": {"bins": ["pipx"]}, "homepage": "https://turboluxurycarwash.ae/services/car-polishing-abu-dhabi/"}}
---

# Paint care

## When to use

- "Wax, sealant or ceramic for a car parked outside in Abu Dhabi?"
- "I applied sealant on 1 September. When is it due again?"
- "Do I need to polish before protecting? There are swirl marks."
- "What does ceramic cost per year if I pay 1,500 AED?"

## Commands

Needs Python 3.9+ and pipx (or use `pip install turbo-luxury-paint-care`).

```bash
pipx run turbo-luxury-paint-care products
pipx run turbo-luxury-paint-care choose --parking outdoor --keep-years 3
pipx run turbo-luxury-paint-care due --product sealant --applied 2026-09-01 --harsh --count 2
pipx run turbo-luxury-paint-care cost --product ceramic --price 1500
pipx run turbo-luxury-paint-care polish --swirls --water-spots
```

## Notes

- `--harsh` means the car is parked outdoors all day, which uses the short end of the durability range.
- Durability figures are typical ranges for UAE heat and UV. Real life depends on product and washing habits.
- If the paint has swirls, oxidation or etched water spots, the tool advises polishing before any protection.

## Links

- Website: [car polishing Abu Dhabi](https://turboluxurycarwash.ae/services/car-polishing-abu-dhabi/)
- Source code: [https://github.com/nbkdevs/turbo-luxury](https://github.com/nbkdevs/turbo-luxury/tree/main/packages/pypi)
- Licence: MIT
