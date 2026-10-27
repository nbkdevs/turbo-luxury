# turbo_luxury_detailing

A pure Dart planner for a full car detailing job. Choose the services (or describe what you see on the
car), and it returns the steps in the correct working order, why each step exists, and a time estimate
that scales with vehicle size and how dirty the car is. It also ships a small command-line tool.

Maintained by Turbo Luxury Car Wash, the team behind [car detailing Abu Dhabi](https://turboluxurycarwash.ae/services/car-detailing-abu-dhabi/) with mobile service at the customer's location.

## Install

```sh
dart pub add turbo_luxury_detailing
dart pub global activate turbo_luxury_detailing   # for the CLI
```

## Library

```dart
import 'package:turbo_luxury_detailing/turbo_luxury_detailing.dart';

void main() {
  final services = suggestServices(swirlMarks: true, stainedSeats: true, hazyHeadlights: true);
  final plan = planDetailing(services, size: VehicleSize.suv, condition: Condition.heavy);
  print(plan.checklist());
  print(plan.totalMinutes); // minutes, rounded to 5
}
```

The planner enforces the order a detailer follows: wheels, wash, clay bar, polish, protection,
headlights, engine bay, interior vacuum, seats, interior restoration, AC sanitization, then glass
and the final walk-around. Choosing `Service.polish` automatically adds the wash, clay bar and
wax or sealant steps it depends on.

## CLI

```sh
dart run turbo_luxury_detailing plan --size suv --condition heavy polish seatDeepClean
dart run turbo_luxury_detailing package     # the Detailing Shine package
dart run turbo_luxury_detailing services
```

Times are planning estimates: base minutes for a normal sedan multiplied by size (compact 0.85,
sedan 1.0, SUV 1.25, large 1.5) and condition (light 0.85, normal 1.0, heavy 1.4).

## Tests

```sh
dart pub get && dart test
```

## Links

- Source: https://github.com/nbkdevs/turbo-luxury/tree/main/packages/pub
- Licence: MIT
