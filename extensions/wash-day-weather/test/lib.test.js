const test = require("node:test");
const assert = require("node:assert");
const L = require("../src/lib.js");

test("clear calm day scores 100", () => {
  const s = L.scoreDay({ rain: 0, wind: 10, temp: 30, dust: 10 });
  assert.equal(s.score, 100);
  assert.equal(s.verdict, "great");
  assert.deepEqual(s.reasons, []);
});

test("rain tiers", () => {
  assert.equal(L.scoreDay({ rain: 15, wind: 0, temp: 25 }).score, 92);
  assert.equal(L.scoreDay({ rain: 40, wind: 0, temp: 25 }).score, 70);
  assert.equal(L.scoreDay({ rain: 80, wind: 0, temp: 25 }).score, 45);
});

test("dust and wind lower the score, undefined dust is ignored", () => {
  assert.equal(L.scoreDay({ rain: 0, wind: 0, temp: 25, dust: 120 }).score, 70);
  assert.equal(L.scoreDay({ rain: 0, wind: 35, temp: 25 }).score, 85);
  assert.equal(L.scoreDay({ rain: 0, wind: 0, temp: 25, dust: undefined }).score, 100);
});

test("score is clamped at zero and verdict is skip", () => {
  const s = L.scoreDay({ rain: 90, wind: 50, temp: 47, dust: 300 });
  assert.equal(s.score, 0);
  assert.equal(s.verdict, "skip");
  assert.ok(s.reasons.length >= 4);
});

test("daily dust takes the max per date", () => {
  const d = L.dailyDust({ hourly: { time: ["2026-10-27T00:00", "2026-10-27T01:00", "2026-10-28T00:00"], dust: [10, 60, null] } });
  assert.deepEqual(d, { "2026-10-27": 60 });
});

test("buildDays merges both feeds and bestDay picks the highest", () => {
  const forecast = { daily: {
    time: ["2026-10-27", "2026-10-28", "2026-10-29"],
    precipitation_probability_max: [0, 70, 0],
    wind_speed_10m_max: [10, 10, 10],
    temperature_2m_max: [33, 33, 33],
    uv_index_max: [8, 8, 8] } };
  const air = { hourly: { time: ["2026-10-27T12:00", "2026-10-29T12:00"], dust: [150, 5] } };
  const days = L.buildDays(forecast, air);
  assert.equal(days.length, 3);
  assert.equal(days[0].dust, 150);
  assert.equal(days[1].dust, undefined);
  assert.equal(L.bestDay(days).date, "2026-10-29");
});

test("weekday is stable", () => {
  assert.equal(L.weekday("2026-10-27"), "Tue");
});

test("forecast and dust urls use the chosen place, rounded to 2 decimals", () => {
  const place = { label: "Demo", lat: 12.34567, lon: -45.6789 };
  assert.match(L.forecastUrl(place), /api\.open-meteo\.com\/v1\/forecast\?latitude=12\.35&longitude=-45\.68&/);
  assert.match(L.dustUrl(place), /air-quality-api\.open-meteo\.com.*latitude=12\.35&longitude=-45\.68/);
});

test("geocode url encodes the query and language", () => {
  const u = L.geocodeUrl("  São Paulo & co ", "pt");
  assert.equal(u, "https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo%20%26%20co&count=6&language=pt&format=json");
});

test("parsePlaces builds labels, rounds coordinates and drops bad rows", () => {
  const places = L.parsePlaces({ results: [
    { name: "Northtown", admin1: "North Region", country: "Exampleland", latitude: 10.123456, longitude: 20.987654 },
    { name: "Same", admin1: "Same", country: "Country", latitude: 1, longitude: 2 },
    { name: "Broken", latitude: "x", longitude: 3 }
  ] });
  assert.deepEqual(places, [
    { label: "Northtown, North Region, Exampleland", lat: 10.12, lon: 20.99 },
    { label: "Same, Country", lat: 1, lon: 2 }
  ]);
  assert.deepEqual(L.parsePlaces({}), []);
  assert.deepEqual(L.parsePlaces(null), []);
});

test("validPlace accepts only a label with in-range coordinates", () => {
  assert.equal(L.validPlace({ label: "A", lat: 0, lon: 0 }), true);
  assert.equal(L.validPlace({ label: "", lat: 0, lon: 0 }), false);
  assert.equal(L.validPlace({ label: "A", lat: 95, lon: 0 }), false);
  assert.equal(L.validPlace({ label: "A", lat: 0, lon: "1" }), false);
  assert.equal(L.validPlace(null), false);
  assert.equal(L.validPlace("old-city-key"), false);
});

test("cold days lose points", () => {
  assert.equal(L.scoreDay({ rain: 0, wind: 0, temp: -2 }).score, 65);
  assert.equal(L.scoreDay({ rain: 0, wind: 0, temp: 3 }).score, 90);
  assert.equal(L.scoreDay({ rain: 0, wind: 0, temp: 5 }).score, 100);
});

test("units format for display", () => {
  assert.equal(L.fmtTemp(30, "metric"), "30°C");
  assert.equal(L.fmtTemp(30, "imperial"), "86°F");
  assert.equal(L.fmtWind(32.2, "metric"), "32 km/h");
  assert.equal(L.fmtWind(32.2, "imperial"), "20 mph");
});

test("empty responses do not throw", () => {
  assert.deepEqual(L.buildDays(null, null), []);
  assert.equal(L.bestDay([]), null);
});
