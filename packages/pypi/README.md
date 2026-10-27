# turbo-luxury-paint-care

A small, dependency-free Python library and CLI for car paint protection in hot, dusty climates. It
helps you choose between wax, sealant and ceramic coating, tells you when each one is due again, works
out what staying protected costs per year, and says whether the paint needs polishing first.

Maintained by Turbo Luxury Car Wash, the team behind [car polishing Abu Dhabi](https://turboluxurycarwash.ae/services/car-polishing-abu-dhabi/) and mobile washing across the emirate.

## Install

```sh
pip install turbo-luxury-paint-care
```

## CLI

```sh
turbo-luxury-paint-care products
turbo-luxury-paint-care choose --parking outdoor --keep-years 4 --polished-recently
turbo-luxury-paint-care due --product sealant --applied 2026-11-01 --harsh --count 3
turbo-luxury-paint-care cost --product wax --price 110 --harsh
turbo-luxury-paint-care polish --swirls --oxidation
```

```text
$ turbo-luxury-paint-care cost --product wax --price 110 --harsh
Carnauba wax: 12.00 applications a year, 1320.00 per year
```

## Library

```python
from datetime import date
from turbo_luxury_paint_care import choose, due_date, cost_per_year, polish_advice

choose("outdoor", keep_years=4, polished_recently=True)["product"].name   # 'Ceramic coating'
due_date("sealant", date(2026, 11, 1), harsh=True)                       # date(2027, 2, 1)
cost_per_year("wax", 110, harsh=True)                                    # 1320.0 (e.g. a wax visit every month)
polish_advice(swirl_marks=True)                                          # 'Polish first (swirl marks), then ...'
```

## Durability figures

Planning estimates for UAE sun, heat and dust, deliberately shorter than product labels written for
cooler climates. They are not lab results.

| Protection | Months in UAE conditions | UV resistance |
|---|---|---|
| Carnauba wax | 1-2 | 2/5 |
| Paint sealant | 3-6 | 3/5 |
| Ceramic coating | 12-24 (polish first) | 5/5 |

`harsh=True` (all-day outdoor parking) uses the short end of the range; otherwise the middle is used.
Prices are never assumed: you pass what one application costs you.

## Tests

```sh
pip install pytest && pytest
```

## Links

- Source: https://github.com/nbkdevs/turbo-luxury/tree/main/packages/pypi
- Licence: MIT
