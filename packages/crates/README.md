# turbo-luxury-cabin-heat

A zero-dependency Rust library and command-line tool that estimates how hot a parked car gets in hot,
sunny weather like a UAE summer: cabin air, dashboard, steering wheel, seats and body panels, a risk
level, burn hazards, minutes until the cabin reaches a temperature, and whether the paint is cool
enough to wash.

Maintained by Turbo Luxury Car Wash, a [car wash at home Abu Dhabi](https://turboluxurycarwash.ae/) service that washes cars where they are parked.

## Install

```sh
cargo install turbo-luxury-cabin-heat      # CLI
cargo add turbo-luxury-cabin-heat          # library
```

## CLI

```text
$ turbo-luxury-cabin-heat --ambient 45 --minutes 60 --until 50
Ambient 45.0 C, parked 60 min
Cabin air:          71.2 C (dangerous)
Dashboard:          76.2 C
Steering wheel:     69.6 C
Dark leather seat:  68.0 C
Fabric seat:        61.4 C
Body panel:         56.4 C
Cabin reaches 50 C after about 6 min
Cabin is in the danger range: never leave children or pets inside, even briefly. Burn risk on contact: dashboard, steering wheel, dark leather seat, fabric seat. Body panels are too hot to wash: wait for shade, early morning or evening to avoid water spots.
```

Flags: `--ambient C`, `--minutes N`, `--shade`, `--tint`, `--cracked`, `--dark-paint`, `--until C`.

## Library

```rust
use turbo_luxury_cabin_heat::{estimate, risk_for_cabin, panel_cool_enough_to_wash, Conditions};

let c = Conditions { ambient_c: 44.0, minutes: 30.0, shaded: false, ..Conditions::default() };
let e = estimate(&c);
println!("{} C cabin, {}", e.cabin_c, risk_for_cabin(e.cabin_c).label());
assert!(!panel_cool_enough_to_wash(&c));
```

## Model and limits

Cabin air follows an exponential warm-up (time constant 35 minutes) toward a maximum rise of 32 C in
full sun. Shade multiplies the rise by 0.35, tint by 0.85 and open windows by 0.8. Surfaces use
larger sun-exposed rises (dashboard +38 C, steering wheel +30 C, dark leather +28 C, fabric +20 C).
Skin burns quickly above 60 C. Body panels are treated as washable below 40 C.

These are rule-of-thumb planning figures, not measurements. Never use them to decide whether it is
safe to leave a child or pet in a car: it never is.

## Tests

```sh
cargo test
```

## Links

- Source: https://github.com/nbkdevs/turbo-luxury/tree/main/packages/crates
- Licence: MIT
