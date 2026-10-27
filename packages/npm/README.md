# turbo-luxury-wash-advisor

Tell it about your car and how it is used, and it recommends one of four mobile-wash packages, a wash
interval that suits the UAE sun and dust, and a dated visit plan with an AED cost range. Zero
dependencies, works as a CLI and as a Node library.

Maintained by Turbo Luxury Car Wash, the [mobile car wash Abu Dhabi](https://turboluxurycarwash.ae/) team that cleans and details cars at the customer's own parking spot.

## Install

```sh
npm install turbo-luxury-wash-advisor      # library
npx turbo-luxury-wash-advisor packages     # or run the CLI directly
```

## CLI

```sh
turbo-luxury-wash-advisor recommend --vehicle suv --driving desert --months-since-engine-clean 14
turbo-luxury-wash-advisor plan --months 3 --start 2026-11-01 --parking covered --pets
turbo-luxury-wash-advisor packages --json
```

Example:

```text
$ turbo-luxury-wash-advisor recommend --vehicle luxury --months-since-wax 2 --pets --months-since-deep-interior 7
Recommended: Diamond Shine (150-170 AED)
Engine bay cleaning and interior sanitization.
Includes: Everything in Golden Shine; Engine compartment; Interior sanitization

- Wax is 2 month(s) old; premium paint wears it off, so a wax coat is due.
- Pets, kids or smoking load the cabin, and the last deep interior clean was 7 months ago.
- Interior sanitization is worthwhile after 7 months of pet or smoke exposure.
- Wash every 7 days (outdoor parking, city driving).
```

Options: `--vehicle sedan|suv|luxury|sports`, `--parking outdoor|covered|garage`,
`--driving city|mixed|desert`, `--smoker`, `--pets`, `--kids`, `--seat-stains`, `--ac-smell`,
`--hazy-headlights`, `--months-since-wax N`, `--months-since-deep-interior N`,
`--months-since-engine-clean N`, `--months N`, `--start YYYY-MM-DD`, `--json`.

## Library

```js
const { recommend, plan, PACKAGES } = require('turbo-luxury-wash-advisor');

const rec = recommend({ vehicle: 'suv', parking: 'outdoor', driving: 'desert', monthsSinceWax: 4 });
console.log(rec.package.name, rec.intervalDays); // Golden Shine 4

const p = plan({ parking: 'covered' }, { months: 3, start: '2026-11-01' });
console.log(p.totalMin, p.totalMax, p.currency); // AED range for the whole plan
```

## How it decides

| Trigger | Package |
|---|---|
| Wax older than 3 months (2 for luxury and sports cars) | Golden Shine |
| Pets, kids or smoking and no deep interior clean for 3+ months | Golden Shine |
| Engine bay not cleaned for 12+ months, or pets/smoking and 6+ months without sanitization | Diamond Shine |
| Seat stains, AC smell, hazy headlights, or no deep interior work for 12+ months | Detailing Shine |
| Anything else | Quick Shine |

The recommendation is the lowest tier that covers every trigger. Wash interval: outdoor 7 days,
covered 10, garage 14, minus 1 for mixed driving or 3 for desert driving (never below 4 days).
Prices are the published AED ranges: Quick 60-70, Golden 100-120, Diamond 150-170, Detailing 300.
A plan uses the recommended package for the first visit, then Quick Shine with a Golden Shine every
fourth visit.

## Tests

```sh
npm test
```

## Links

- Source: https://github.com/nbkdevs/turbo-luxury/tree/main/packages/npm
- Licence: MIT
