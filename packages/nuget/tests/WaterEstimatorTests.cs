using TurboLuxury.WaterSaver;
using Xunit;

public class WaterEstimatorTests
{
    [Fact]
    public void MethodsAreOrderedByWaterUse()
    {
        Assert.Equal(
            new[] { WashMethod.Hose, WashMethod.PressureWasher, WashMethod.Bucket, WashMethod.Rinseless, WashMethod.Waterless },
            WaterEstimator.RankedByUse());
    }

    [Fact]
    public void RangesAreSane()
    {
        foreach (var m in Enum.GetValues<WashMethod>())
        {
            var r = WaterEstimator.PerWash(m);
            Assert.True(r.Min <= r.Typical && r.Typical <= r.Max, m.ToString());
        }
    }

    [Fact]
    public void AnnualLitresMultiplies()
    {
        Assert.Equal(250 * 52, WaterEstimator.AnnualLitres(WashMethod.Hose, 52));
        Assert.Equal(0, WaterEstimator.AnnualLitres(WashMethod.Bucket, 0));
        Assert.Throws<ArgumentOutOfRangeException>(() => WaterEstimator.AnnualLitres(WashMethod.Bucket, -1));
    }

    [Theory]
    [InlineData(7, 52)]
    [InlineData(14, 26)]
    [InlineData(30, 12)]
    [InlineData(365, 1)]
    [InlineData(1000, 1)]
    public void WashesPerYear(int days, int expected) => Assert.Equal(expected, WaterEstimator.WashesPerYear(days));

    [Fact]
    public void WashesPerYearRejectsZero() => Assert.Throws<ArgumentOutOfRangeException>(() => WaterEstimator.WashesPerYear(0));

    [Fact]
    public void CompareHoseToRinseless()
    {
        var c = WaterEstimator.Compare(WashMethod.Hose, WashMethod.Rinseless, 52);
        Assert.Equal(13000, c.FromLitres);
        Assert.Equal(624, c.ToLitres);
        Assert.Equal(12376, c.SavedLitres);
        Assert.Equal(95.2, c.SavedPercent);
        Assert.Equal(82.5, c.SavedBathtubs);
        Assert.Contains("12376 L", WaterEstimator.Describe(c));
    }

    [Fact]
    public void CompareWithZeroWashes()
    {
        var c = WaterEstimator.Compare(WashMethod.Hose, WashMethod.Bucket, 0);
        Assert.Equal(0, c.SavedPercent);
    }

    [Fact]
    public void CostUsesCubicMetres()
    {
        Assert.Equal(6.5, WaterEstimator.Cost(13000, 0.5));
        Assert.Throws<ArgumentOutOfRangeException>(() => WaterEstimator.Cost(-1, 1));
    }

    [Theory]
    [InlineData("hose", WashMethod.Hose)]
    [InlineData(" Waterless ", WashMethod.Waterless)]
    [InlineData("RINSELESS", WashMethod.Rinseless)]
    public void ParseMethod(string text, WashMethod expected) => Assert.Equal(expected, WaterEstimator.ParseMethod(text));

    [Theory]
    [InlineData("steam")]
    [InlineData("")]
    [InlineData("9")]
    public void ParseMethodRejectsUnknown(string text) => Assert.Throws<FormatException>(() => WaterEstimator.ParseMethod(text));
}
