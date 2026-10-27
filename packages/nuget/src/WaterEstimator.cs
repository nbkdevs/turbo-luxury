using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace TurboLuxury.WaterSaver;

/// <summary>Typical litres per wash, a planning range for an average car.</summary>
public readonly record struct UsageRange(double Min, double Typical, double Max);

/// <summary>Result of comparing two methods over a year.</summary>
public sealed record Comparison(
    WashMethod From,
    WashMethod To,
    int WashesPerYear,
    double FromLitres,
    double ToLitres,
    double SavedLitres,
    double SavedPercent,
    double SavedBathtubs);

/// <summary>
/// Planning estimates of water used when washing a car. The figures are typical ranges for an
/// average sedan, not measurements; real use depends on nozzle, pressure and how long water runs.
/// </summary>
public static class WaterEstimator
{
    /// <summary>Litres in a standard bathtub, used for friendly comparisons.</summary>
    public const double BathtubLitres = 150;

    private static readonly IReadOnlyDictionary<WashMethod, UsageRange> Table = new Dictionary<WashMethod, UsageRange>
    {
        [WashMethod.Hose] = new(150, 250, 400),
        [WashMethod.PressureWasher] = new(70, 100, 150),
        [WashMethod.Bucket] = new(30, 40, 60),
        [WashMethod.Rinseless] = new(8, 12, 20),
        [WashMethod.Waterless] = new(1, 2, 4),
    };

    /// <summary>Litres used by one wash with the given method.</summary>
    public static UsageRange PerWash(WashMethod method) =>
        Table.TryGetValue(method, out var r) ? r : throw new ArgumentOutOfRangeException(nameof(method));

    /// <summary>Typical litres for a year of washes.</summary>
    public static double AnnualLitres(WashMethod method, int washesPerYear)
    {
        if (washesPerYear < 0) throw new ArgumentOutOfRangeException(nameof(washesPerYear), "must not be negative");
        return PerWash(method).Typical * washesPerYear;
    }

    /// <summary>Washes per year for a given interval in days (rounded, at least 1).</summary>
    public static int WashesPerYear(int intervalDays)
    {
        if (intervalDays < 1) throw new ArgumentOutOfRangeException(nameof(intervalDays), "must be at least 1 day");
        return Math.Max(1, (int)Math.Round(365.0 / intervalDays, MidpointRounding.AwayFromZero));
    }

    /// <summary>Compare switching from one method to another over a year.</summary>
    public static Comparison Compare(WashMethod from, WashMethod to, int washesPerYear)
    {
        var a = AnnualLitres(from, washesPerYear);
        var b = AnnualLitres(to, washesPerYear);
        var saved = a - b;
        var pct = a == 0 ? 0 : Math.Round(saved / a * 100, 1);
        return new Comparison(from, to, washesPerYear, a, b, saved, pct, Math.Round(saved / BathtubLitres, 1));
    }

    /// <summary>Water cost in the currency of <paramref name="pricePerCubicMetre"/> (1 m3 = 1000 L).</summary>
    public static double Cost(double litres, double pricePerCubicMetre)
    {
        if (litres < 0) throw new ArgumentOutOfRangeException(nameof(litres));
        if (pricePerCubicMetre < 0) throw new ArgumentOutOfRangeException(nameof(pricePerCubicMetre));
        return Math.Round(litres / 1000.0 * pricePerCubicMetre, 2);
    }

    /// <summary>Parse a method name, case-insensitive.</summary>
    public static WashMethod ParseMethod(string name)
    {
        if (Enum.TryParse<WashMethod>((name ?? string.Empty).Trim(), true, out var m) && Enum.IsDefined(typeof(WashMethod), m))
            return m;
        throw new FormatException("Unknown method '" + name + "'. Use: " + string.Join(", ", Enum.GetNames(typeof(WashMethod))));
    }

    /// <summary>One-paragraph summary of a comparison.</summary>
    public static string Describe(Comparison c)
    {
        var f = CultureInfo.InvariantCulture;
        return string.Format(f,
            "{0} washes a year: {1} uses {2:0} L, {3} uses {4:0} L. Saving {5:0} L ({6:0.#}%), about {7:0.#} bathtubs.",
            c.WashesPerYear, c.From, c.FromLitres, c.To, c.ToLitres, c.SavedLitres, c.SavedPercent, c.SavedBathtubs);
    }

    /// <summary>All methods ordered from most to least water.</summary>
    public static IReadOnlyList<WashMethod> RankedByUse() =>
        Table.OrderByDescending(kv => kv.Value.Typical).Select(kv => kv.Key).ToList();
}
