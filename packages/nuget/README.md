# TurboLuxury.WaterSaver

A small .NET library for estimating how much water car washing uses and how much a different method
saves. Pick a method (hose, pressure washer, two buckets, rinseless or waterless), a number of
washes a year, and it returns litres per year, the saving between two methods, bathtub equivalents
and, if you supply a tariff, the cost.

Maintained by Turbo Luxury Car Wash, a [home car wash Abu Dhabi](https://turboluxurycarwash.ae/) service for people who would rather not wash the car in the driveway.

## Install

```sh
dotnet add package TurboLuxury.WaterSaver
```

Targets `netstandard2.0` and `net8.0`.

## Usage

```csharp
using TurboLuxury.WaterSaver;

int washes = WaterEstimator.WashesPerYear(intervalDays: 7);          // 52
var c = WaterEstimator.Compare(WashMethod.Hose, WashMethod.Rinseless, washes);

Console.WriteLine(WaterEstimator.Describe(c));
// 52 washes a year: Hose uses 13000 L, Rinseless uses 624 L. Saving 12376 L (95.2%), about 82.5 bathtubs.

double aed = WaterEstimator.Cost(c.FromLitres, pricePerCubicMetre: 0.5);   // use your own tariff
```

## Planning figures (litres per wash, average sedan)

| Method | Min | Typical | Max |
|---|---|---|---|
| Hose left running | 150 | 250 | 400 |
| Pressure washer | 70 | 100 | 150 |
| Two buckets | 30 | 40 | 60 |
| Rinseless | 8 | 12 | 20 |
| Waterless | 1 | 2 | 4 |

These are planning ranges, not measurements. A bathtub is taken as 150 L. No tariff is assumed:
`Cost` multiplies by whatever price per cubic metre you pass in.

## Tests

```sh
dotnet test tests/TurboLuxury.WaterSaver.Tests.csproj
dotnet pack src/TurboLuxury.WaterSaver.csproj -c Release
```

## Links

- Source: https://github.com/nbkdevs/turbo-luxury/tree/main/packages/nuget
- Licence: MIT
