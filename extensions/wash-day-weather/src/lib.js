/* Wash-day scoring. Pure functions; no DOM, no network. */
(function (root) {
  "use strict";

  var GEO = "https://geocoding-api.open-meteo.com/v1/search";

  /** Coordinates are rounded to 2 decimals (about 1 km): plenty for a forecast, never more precise. */
  function round2(n) { return Math.round(Number(n) * 100) / 100; }

  function geocodeUrl(query, lang) {
    return GEO + "?name=" + encodeURIComponent(String(query).trim()) + "&count=6&language=" +
      encodeURIComponent(lang || "en") + "&format=json";
  }

  /** "Name, Region, Country" without repeats or blanks. */
  function placeLabel(r) {
    var parts = [];
    [r.name, r.admin1, r.country].forEach(function (p) {
      if (p && parts.indexOf(p) === -1) parts.push(p);
    });
    return parts.join(", ");
  }

  /** Geocoding response -> [{ label, lat, lon }]. */
  function parsePlaces(json) {
    var res = (json && json.results) || [];
    return res.filter(function (r) {
      return r && typeof r.latitude === "number" && typeof r.longitude === "number" && r.name;
    }).map(function (r) {
      return { label: placeLabel(r), lat: round2(r.latitude), lon: round2(r.longitude) };
    });
  }

  /** A stored place is usable only if it has a label and valid coordinates. */
  function validPlace(p) {
    return !!(p && typeof p.label === "string" && p.label &&
      typeof p.lat === "number" && p.lat >= -90 && p.lat <= 90 &&
      typeof p.lon === "number" && p.lon >= -180 && p.lon <= 180);
  }

  function forecastUrl(place) {
    return "https://api.open-meteo.com/v1/forecast?latitude=" + round2(place.lat) + "&longitude=" + round2(place.lon) +
      "&daily=precipitation_probability_max,wind_speed_10m_max,temperature_2m_max,uv_index_max" +
      "&timezone=auto&forecast_days=7";
  }

  function dustUrl(place) {
    return "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + round2(place.lat) + "&longitude=" + round2(place.lon) +
      "&hourly=dust&timezone=auto&forecast_days=5";
  }

  /** Highest hourly dust (ug/m3) per local date from an air-quality response. */
  function dailyDust(air) {
    var out = {};
    if (!air || !air.hourly || !air.hourly.time) return out;
    var t = air.hourly.time, d = air.hourly.dust || [];
    for (var i = 0; i < t.length; i++) {
      var v = d[i];
      if (typeof v !== "number") continue;
      var day = String(t[i]).slice(0, 10);
      if (out[day] === undefined || v > out[day]) out[day] = v;
    }
    return out;
  }

  /** Score one day 0-100 and say why. Inputs are metric (°C, km/h).
      dust may be undefined (beyond the 5-day air-quality range). */
  function scoreDay(day) {
    var score = 100, reasons = [];
    var rain = day.rain, dust = day.dust, wind = day.wind, temp = day.temp;
    if (rain >= 60) { score -= 55; reasons.push("rain likely (" + rain + "%)"); }
    else if (rain >= 30) { score -= 30; reasons.push("chance of rain (" + rain + "%)"); }
    else if (rain >= 10) { score -= 8; reasons.push("small chance of rain (" + rain + "%)"); }
    if (typeof dust === "number") {
      if (dust >= 200) { score -= 45; reasons.push("heavy dust (" + Math.round(dust) + " µg/m³)"); }
      else if (dust >= 100) { score -= 30; reasons.push("dusty (" + Math.round(dust) + " µg/m³)"); }
      else if (dust >= 50) { score -= 12; reasons.push("some dust (" + Math.round(dust) + " µg/m³)"); }
    }
    if (wind >= 40) { score -= 25; reasons.push("strong wind"); }
    else if (wind >= 30) { score -= 15; reasons.push("windy"); }
    if (temp >= 45) { score -= 10; reasons.push("very hot, wash early in the morning"); }
    else if (temp >= 40) { score -= 4; reasons.push("hot, wash early or after sunset"); }
    else if (temp <= 0) { score -= 35; reasons.push("below freezing, water may freeze"); }
    else if (temp <= 4) { score -= 10; reasons.push("cold, slow to dry"); }
    if (score < 0) score = 0;
    var verdict = score >= 80 ? "great" : score >= 55 ? "ok" : "skip";
    return { score: score, verdict: verdict, reasons: reasons };
  }

  /** Combine the two API responses into scored days. */
  function buildDays(forecast, air) {
    var dust = dailyDust(air);
    var d = (forecast && forecast.daily) || {};
    var dates = d.time || [];
    return dates.map(function (date, i) {
      var day = {
        date: date,
        rain: num(d.precipitation_probability_max, i),
        wind: num(d.wind_speed_10m_max, i),
        temp: num(d.temperature_2m_max, i),
        uv: num(d.uv_index_max, i),
        dust: dust[date]
      };
      var s = scoreDay(day);
      day.score = s.score; day.verdict = s.verdict; day.reasons = s.reasons;
      return day;
    });
  }

  function num(arr, i) {
    var v = arr && arr[i];
    return typeof v === "number" ? v : 0;
  }

  /** The best day, ties going to the earliest. */
  function bestDay(days) {
    var best = null;
    days.forEach(function (d) { if (!best || d.score > best.score) best = d; });
    return best;
  }

  /** Weekday label for an ISO date, computed in UTC so it never shifts. */
  function weekday(iso) {
    var p = iso.split("-");
    var dt = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dt.getUTCDay()];
  }

  /** Display helpers: the API is always queried in metric; imperial is converted for display only. */
  function fmtTemp(c, units) {
    return units === "imperial" ? Math.round(c * 9 / 5 + 32) + "°F" : Math.round(c) + "°C";
  }

  function fmtWind(kmh, units) {
    return units === "imperial" ? Math.round(kmh / 1.609344) + " mph" : Math.round(kmh) + " km/h";
  }

  var api = { geocodeUrl: geocodeUrl, placeLabel: placeLabel, parsePlaces: parsePlaces, validPlace: validPlace,
    forecastUrl: forecastUrl, dustUrl: dustUrl, dailyDust: dailyDust, scoreDay: scoreDay, buildDays: buildDays,
    bestDay: bestDay, weekday: weekday, fmtTemp: fmtTemp, fmtWind: fmtWind };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.WashLib = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
