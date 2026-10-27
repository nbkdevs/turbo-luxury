const test = require("node:test");
const assert = require("node:assert");
const L = require("../src/lib.js");

const base = [
  { date: "2026-09-01", odometer: 10000, litres: 40, price: 2.8, full: true },
  { date: "2026-09-15", odometer: 10500, litres: 50, price: 2.9, full: true },
  { date: "2026-10-01", odometer: 11100, litres: 60, price: 3.0, full: true }
];

test("segments between full fills", () => {
  const s = L.segments(base);
  assert.equal(s.length, 2);
  assert.equal(s[0].km, 500);
  assert.equal(s[0].lPer100, 10);
  assert.equal(s[0].cost, 145);
  assert.equal(s[0].costPerKm, 0.29);
  assert.equal(s[1].lPer100, 10);
  assert.equal(s[1].kmPerL, 10);
});

test("partial fills are folded into the next full segment", () => {
  const e = [
    { date: "2026-09-01", odometer: 1000, litres: 40, full: true },
    { date: "2026-09-05", odometer: 1200, litres: 10, full: false },
    { date: "2026-09-10", odometer: 1500, litres: 25, full: true }
  ];
  const s = L.segments(e);
  assert.equal(s.length, 1);
  assert.equal(s[0].litres, 35);
  assert.equal(s[0].lPer100, 7);
  assert.equal(s[0].cost, null);
});

test("no segments with fewer than two full fills", () => {
  assert.deepEqual(L.segments([base[0]]), []);
  assert.equal(L.summary([base[0]]), null);
  assert.equal(L.summary([{ date: "2026-09-01", odometer: 1, litres: 5, full: false }, { date: "2026-09-02", odometer: 50, litres: 5, full: false }]), null);
});

test("summary totals", () => {
  const s = L.summary(base);
  assert.equal(s.km, 1100);
  assert.equal(s.litres, 110);
  assert.equal(s.lPer100, 10);
  assert.equal(s.costPerKm, 0.295);
  assert.equal(s.avgPrice, 2.955);
});

test("best and worst segments", () => {
  const e = base.concat([{ date: "2026-10-20", odometer: 11600, litres: 35, price: 3, full: true }]);
  const s = L.summary(e);
  assert.equal(s.best.lPer100, 7);
  assert.equal(s.worst.lPer100, 10);
});

test("unsorted input is handled", () => {
  assert.equal(L.segments([base[2], base[0], base[1]]).length, 2);
});

test("monthly spend", () => {
  assert.deepEqual(L.monthlySpend(base), { "2026-09": 257, "2026-10": 180 });
});

test("validate", () => {
  const today = "2026-10-27";
  assert.ok(L.validate({ date: "bad", odometer: 1, litres: 1 }, [], today).error);
  assert.ok(L.validate({ date: "2026-11-01", odometer: 1, litres: 1 }, [], today).error);
  assert.ok(L.validate({ date: "2026-10-01", odometer: "", litres: 1 }, [], today).error);
  assert.ok(L.validate({ date: "2026-10-01", odometer: 1, litres: 0 }, [], today).error);
  assert.ok(L.validate({ date: "2026-10-01", odometer: 1, litres: 5, price: "abc" }, [], today).error);
  assert.ok(L.validate({ date: "2026-09-10", odometer: 12000, litres: 5 }, base, today).error);
  const ok = L.validate({ date: "2026-10-20", odometer: "11200.4", litres: "30.456", price: "2.95", full: true }, base, today);
  assert.deepEqual(ok.entry, { date: "2026-10-20", odometer: 11200, litres: 30.46, full: true, price: 2.95 });
});

test("csv", () => {
  assert.equal(L.toCsv([base[1], base[0]]), "date,odometer_km,litres,price_aed_per_litre,full_tank\n2026-09-01,10000,40,2.8,yes\n2026-09-15,10500,50,2.9,yes\n");
});
