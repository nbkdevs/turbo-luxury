'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { pick, PACKAGES } = require('../picker.js');

test('upkeep defaults to Quick Shine', () => {
  const r = pick({ goal: 'upkeep' });
  assert.strictEqual(r.pkg.id, 'quick');
  assert.strictEqual(r.totalMin, 60);
  assert.strictEqual(r.totalMax, 70);
});

test('goals and specifics raise the tier', () => {
  assert.strictEqual(pick({ goal: 'refresh' }).pkg.id, 'golden');
  assert.strictEqual(pick({ goal: 'upkeep', engine: true }).pkg.id, 'diamond');
  assert.strictEqual(pick({ goal: 'refresh', hazy: true }).pkg.id, 'detailing');
  assert.strictEqual(pick({ goal: 'deep', smell: true }).pkg.id, 'detailing');
  assert.strictEqual(pick({ stains: true }).pkg.id, 'detailing');
});

test('visits are clamped and multiplied', () => {
  const r = pick({ goal: 'refresh', visits: 4 });
  assert.strictEqual(r.totalMin, 400);
  assert.strictEqual(r.totalMax, 480);
  assert.strictEqual(pick({ visits: 0 }).visits, 1);
  assert.strictEqual(pick({ visits: 999 }).visits, 52);
  assert.strictEqual(pick().visits, 1);
});

test('price list matches the published prices', () => {
  assert.deepStrictEqual(PACKAGES.map((p) => [p.min, p.max]), [[60, 70], [100, 120], [150, 170], [300, 300]]);
});
