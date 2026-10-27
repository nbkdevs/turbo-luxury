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

test("urls target the right city", () => {
  const u = L.forecastUrl(L.CITIES["abu-dhabi"]);
  assert.match(u, /latitude=24\.4539&longitude=54\.3773/);
  assert.match(L.dustUrl(L.CITIES.dubai), /air-quality-api\.open-meteo\.com.*latitude=25\.2048/);
});

test("empty responses do not throw", () => {
  assert.deepEqual(L.buildDays(null, null), []);
  assert.equal(L.bestDay([]), null);
});
