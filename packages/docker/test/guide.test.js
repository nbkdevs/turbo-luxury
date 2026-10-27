'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { washWindow, calendar, MONTHS } = require('../lib/guide');
const { createServer } = require('../server');

test('calm mild conditions score good', () => {
  const r = washWindow({ temp: 25, wind: 8, dust: 20, humidity: 50 });
  assert.strictEqual(r.score, 100);
  assert.strictEqual(r.verdict, 'good');
});

test('summer midday heat and dust lower the score', () => {
  const r = washWindow({ temp: 42, wind: 35, dust: 200, humidity: 40 });
  assert.strictEqual(r.score, 10);
  assert.strictEqual(r.verdict, 'wait');
  assert.ok(r.tips.length >= 2);
});

test('partial input is accepted and bad input rejected', () => {
  assert.strictEqual(washWindow({ temp: 36 }).score, 85);
  assert.throws(() => washWindow({}), /at least one/);
  assert.throws(() => washWindow({ temp: 'hot' }), /temp must be/);
  assert.throws(() => washWindow({ humidity: 120 }), /humidity must be/);
});

test('calendar has twelve months and month lookup works', () => {
  assert.strictEqual(MONTHS.length, 12);
  assert.strictEqual(calendar(7).month, 'July');
  assert.throws(() => calendar(13), /1 to 12/);
});

test('http endpoints', async () => {
  const server = createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    let r = await fetch(`${base}/healthz`);
    assert.deepStrictEqual(await r.json(), { ok: true });
    r = await fetch(`${base}/api/wash-window?temp=25&wind=5`);
    assert.strictEqual((await r.json()).verdict, 'good');
    r = await fetch(`${base}/api/wash-window`);
    assert.strictEqual(r.status, 400);
    r = await fetch(`${base}/api/calendar?month=1`);
    assert.strictEqual((await r.json()).month, 'January');
    r = await fetch(`${base}/`);
    assert.match(await r.text(), /Abu Dhabi car care guide/);
    assert.strictEqual((await fetch(`${base}/nope`)).status, 404);
    assert.strictEqual((await fetch(`${base}/`, { method: 'POST' })).status, 405);
  } finally {
    server.close();
  }
});
