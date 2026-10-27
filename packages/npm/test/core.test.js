'use strict';
const test = require('node:test');
const assert = require('node:assert');
const lib = require('../lib/index.js');
const { main, parse } = require('../bin/cli.js');

function run(args) {
  let out = '', err = '';
  const code = main(args, { write: (s) => { out += s; } }, { write: (s) => { err += s; } });
  return { code, out, err };
}

test('package prices match the published ranges', () => {
  assert.deepStrictEqual([lib.PACKAGES.quick.min, lib.PACKAGES.quick.max], [60, 70]);
  assert.deepStrictEqual([lib.PACKAGES.golden.min, lib.PACKAGES.golden.max], [100, 120]);
  assert.deepStrictEqual([lib.PACKAGES.diamond.min, lib.PACKAGES.diamond.max], [150, 170]);
  assert.deepStrictEqual([lib.PACKAGES.detailing.min, lib.PACKAGES.detailing.max], [300, 300]);
});

test('default profile gets Quick Shine every 7 days', () => {
  const r = lib.recommend({});
  assert.strictEqual(r.package.id, 'quick');
  assert.strictEqual(r.intervalDays, 7);
});

test('wash interval: parking and driving', () => {
  assert.strictEqual(lib.washIntervalDays({ parking: 'garage' }), 14);
  assert.strictEqual(lib.washIntervalDays({ parking: 'covered' }), 10);
  assert.strictEqual(lib.washIntervalDays({ parking: 'outdoor', driving: 'desert' }), 4);
  assert.strictEqual(lib.washIntervalDays({ parking: 'garage', driving: 'mixed' }), 13);
});

test('old wax triggers Golden Shine, sooner for premium paint', () => {
  assert.strictEqual(lib.recommend({ monthsSinceWax: 3 }).package.id, 'golden');
  assert.strictEqual(lib.recommend({ monthsSinceWax: 2 }).package.id, 'quick');
  assert.strictEqual(lib.recommend({ vehicle: 'luxury', monthsSinceWax: 2 }).package.id, 'golden');
});

test('engine bay and sanitization trigger Diamond Shine', () => {
  assert.strictEqual(lib.recommend({ monthsSinceEngineClean: 12 }).package.id, 'diamond');
  assert.strictEqual(lib.recommend({ pets: true, monthsSinceDeepInterior: 6 }).package.id, 'diamond');
  assert.strictEqual(lib.recommend({ pets: true, monthsSinceDeepInterior: 4 }).package.id, 'golden');
});

test('stains, AC smell, hazy lights and year-old interior trigger Detailing', () => {
  for (const p of [{ seatStains: true }, { acSmell: true }, { hazyHeadlights: true }, { monthsSinceDeepInterior: 12 }]) {
    assert.strictEqual(lib.recommend(p).package.id, 'detailing');
  }
});

test('highest trigger wins and reasons explain it', () => {
  const r = lib.recommend({ monthsSinceWax: 5, acSmell: true });
  assert.strictEqual(r.package.id, 'detailing');
  assert.ok(r.reasons.some((x) => /AC/.test(x)));
  assert.ok(r.reasons.some((x) => /Wax/.test(x)));
});

test('invalid input is rejected', () => {
  assert.throws(() => lib.recommend({ vehicle: 'tank' }), RangeError);
  assert.throws(() => lib.recommend({ monthsSinceWax: -1 }), RangeError);
  assert.throws(() => lib.plan({}, { start: '27-10-2026' }), RangeError);
});

test('plan: dates, rotation and totals', () => {
  const pl = lib.plan({ parking: 'outdoor' }, { months: 1, start: '2026-11-01' });
  assert.strictEqual(pl.intervalDays, 7);
  assert.deepStrictEqual(pl.visits.map((v) => v.date), ['2026-11-01', '2026-11-08', '2026-11-15', '2026-11-22', '2026-11-29']);
  assert.deepStrictEqual(pl.visits.map((v) => v.package), ['quick', 'quick', 'quick', 'quick', 'golden']);
  assert.strictEqual(pl.totalMin, 4 * 60 + 100);
  assert.strictEqual(pl.totalMax, 4 * 70 + 120);
});

test('addDays crosses month and year boundaries', () => {
  assert.strictEqual(lib.addDays('2026-12-30', 3), '2027-01-02');
  assert.strictEqual(lib.addDays('2028-02-28', 1), '2028-02-29');
});

test('cli: recommend, plan, packages, json and errors', () => {
  let r = run(['recommend', '--vehicle', 'suv', '--driving', 'desert', '--months-since-engine-clean', '14']);
  assert.strictEqual(r.code, 0);
  assert.match(r.out, /Recommended: Diamond Shine \(150-170 AED\)/);
  r = run(['plan', '--months', '1', '--start', '2026-11-01', '--json']);
  assert.strictEqual(JSON.parse(r.out).visits.length, 5);
  r = run(['packages']);
  assert.match(r.out, /Detailing Shine\s+300 AED/);
  r = run(['recommend', '--vehicle', 'tank']);
  assert.strictEqual(r.code, 2);
  assert.match(r.err, /vehicle must be one of/);
  assert.strictEqual(run(['nope']).code, 2);
  assert.strictEqual(run([]).code, 1);
  assert.strictEqual(parse(['--pets', '--months-since-wax', '4']).monthsSinceWax, '4');
});
