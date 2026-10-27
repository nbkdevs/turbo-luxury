/* Wash-day scoring. Pure functions; no DOM, no network. */
(function (root) {
  "use strict";

  var CITIES = {
    "abu-dhabi": { label: "Abu Dhabi", lat: 24.4539, lon: 54.3773 },
    dubai: { label: "Dubai", lat: 25.2048, lon: 55.2708 },
    "al-ain": { label: "Al Ain", lat: 24.2075, lon: 55.7447 },
    sharjah: { label: "Sharjah", lat: 25.3463, lon: 55.4209 },
    "ras-al-khaimah": { label: "Ras Al Khaimah", lat: 25.6741, lon: 55.9804 }
  };

  function forecastUrl(city) {
    return "https://api.open-meteo.com/v1/forecast?latitude=" + city.lat + "&longitude=" + city.lon +
      "&daily=precipitation_probability_max,wind_speed_10m_max,temperature_2m_max,uv_index_max" +
      "&timezone=auto&forecast_days=7";
  }

  function dustUrl(city) {
    return "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + city.lat + "&longitude=" + city.lon +
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

  /** Score one day 0-100 and say why. dust may be undefined (beyond the 5-day air-quality range). */
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
    if (wind >= 40) { score -= 25; reasons.push("strong wind (" + Math.round(wind) + " km/h)"); }
    else if (wind >= 30) { score -= 15; reasons.push("windy (" + Math.round(wind) + " km/h)"); }
    if (temp >= 45) { score -= 10; reasons.push("very hot, wash before 9 am"); }
    else if (temp >= 40) { score -= 4; reasons.push("hot, wash early or after sunset"); }
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

  var api = { CITIES: CITIES, forecastUrl: forecastUrl, dustUrl: dustUrl, dailyDust: dailyDust,
    scoreDay: scoreDay, buildDays: buildDays, bestDay: bestDay, weekday: weekday };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.WashLib = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
