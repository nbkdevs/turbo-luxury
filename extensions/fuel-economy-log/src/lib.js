/* Fuel economy maths. Pure functions. Entries: {date, odometer (km), litres, price (AED per litre, optional), full (bool)} */
(function (root) {
  "use strict";

  function round(v, dp) { var m = Math.pow(10, dp); return Math.round(v * m) / m; }

  function sorted(entries) {
    return entries.slice().sort(function (a, b) { return a.odometer - b.odometer || (a.date < b.date ? -1 : a.date > b.date ? 1 : 0); });
  }

  /**
   * Trip segments between consecutive FULL fill-ups. The litres added at the later full fill
   * (plus any partial fills in between) are the fuel burned over the distance since the earlier full fill.
   */
  function segments(entries) {
    var list = sorted(entries), out = [], anchor = null, litres = 0, cost = 0, costKnown = true;
    list.forEach(function (e) {
      if (anchor) {
        litres += e.litres;
        if (typeof e.price === "number") cost += e.litres * e.price; else costKnown = false;
        if (e.full) {
          var km = e.odometer - anchor.odometer;
          if (km > 0) {
            out.push({
              from: anchor.date, to: e.date, km: km, litres: round(litres, 2),
              lPer100: round(litres / km * 100, 2),
              kmPerL: round(km / litres, 2),
              cost: costKnown ? round(cost, 2) : null,
              costPerKm: costKnown ? round(cost / km, 3) : null
            });
          }
          anchor = e; litres = 0; cost = 0; costKnown = true;
        }
      } else if (e.full) {
        anchor = e;
      }
    });
    return out;
  }

  function summary(entries) {
    var segs = segments(entries);
    if (!segs.length) return null;
    var km = 0, litres = 0, cost = 0, costKm = 0, costLitres = 0;
    segs.forEach(function (s) {
      km += s.km; litres += s.litres;
      if (s.cost !== null) { cost += s.cost; costKm += s.km; costLitres += s.litres; }
    });
    return {
      segments: segs.length, km: km, litres: round(litres, 2),
      lPer100: round(litres / km * 100, 2),
      kmPerL: round(km / litres, 2),
      costPerKm: costKm ? round(cost / costKm, 3) : null,
      avgPrice: costLitres ? round(cost / costLitres, 3) : null,
      best: segs.reduce(function (a, b) { return b.lPer100 < a.lPer100 ? b : a; }),
      worst: segs.reduce(function (a, b) { return b.lPer100 > a.lPer100 ? b : a; })
    };
  }

  /** Spend per calendar month ("yyyy-mm"), only for entries with a price. */
  function monthlySpend(entries) {
    var out = {};
    entries.forEach(function (e) {
      if (typeof e.price !== "number") return;
      var m = e.date.slice(0, 7);
      out[m] = round((out[m] || 0) + e.litres * e.price, 2);
    });
    return out;
  }

  function validate(input, entries, today) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(input.date)) || isNaN(Date.parse(input.date))) return { error: "Enter the date as yyyy-mm-dd." };
    if (input.date > today) return { error: "The date is in the future." };
    var od = Number(input.odometer), l = Number(input.litres);
    if (!isFinite(od) || input.odometer === "" || od < 0) return { error: "Enter the odometer reading in km." };
    if (!isFinite(l) || input.litres === "" || l <= 0 || l > 200) return { error: "Litres must be between 0 and 200." };
    var entry = { date: input.date, odometer: Math.round(od), litres: round(l, 2), full: !!input.full };
    if (input.price !== "" && input.price !== undefined && input.price !== null) {
      var p = Number(input.price);
      if (!isFinite(p) || p <= 0 || p > 50) return { error: "Price per litre must be between 0 and 50 AED." };
      entry.price = round(p, 3);
    }
    var later = entries.some(function (e) { return e.date > entry.date && e.odometer < entry.odometer; });
    var earlier = entries.some(function (e) { return e.date < entry.date && e.odometer > entry.odometer; });
    if (later || earlier) return { error: "The odometer does not fit the dates of your other entries." };
    return { entry: entry };
  }

  function csvEscape(v) { var s = v === undefined || v === null ? "" : String(v); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }

  function toCsv(entries) {
    var rows = ["date,odometer_km,litres,price_aed_per_litre,full_tank"];
    sorted(entries).forEach(function (e) {
      rows.push([e.date, e.odometer, e.litres, e.price === undefined ? "" : e.price, e.full ? "yes" : "no"].map(csvEscape).join(","));
    });
    return rows.join("\n") + "\n";
  }

  var api = { segments: segments, summary: summary, monthlySpend: monthlySpend, validate: validate, toCsv: toCsv };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.FuelLib = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
