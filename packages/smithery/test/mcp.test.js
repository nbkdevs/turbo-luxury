import test from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { listPackages, recommendPackage, washWindow, monthTip, bookingLink } from '../src/core.js';

const entry = fileURLToPath(new URL('../src/index.js', import.meta.url));
const TOOLS = ['booking_link', 'list_packages', 'monthly_care_tip', 'recommend_package', 'wash_window_check'];

test('core: packages, recommendation, window, month, link', () => {
  assert.strictEqual(listPackages().length, 4);
  assert.strictEqual(listPackages()[3].price, '300 AED');
  assert.strictEqual(recommendPackage({}).package, 'Quick Shine');
  assert.strictEqual(recommendPackage({ wantsWax: true }).package, 'Golden Shine');
  assert.strictEqual(recommendPackage({ wantsWax: true, wantsEngineClean: true }).package, 'Diamond Shine');
  assert.strictEqual(recommendPackage({ acSmell: true, wantsWax: true }).package, 'Detailing Shine');
  assert.strictEqual(washWindow({ temp: 25, wind: 5 }).verdict, 'good');
  assert.strictEqual(washWindow({ temp: 42, wind: 35, dust: 200, humidity: 40 }).score, 10);
  assert.throws(() => washWindow({}), /at least one/);
  assert.throws(() => washWindow({ humidity: 101 }), /humidity/);
  assert.match(monthTip(1), /best month/);
  assert.throws(() => monthTip(0));
  const l = bookingLink({ packageId: 'golden', area: 'Khalifa City', vehicle: 'Nissan Patrol' });
  assert.ok(l.whatsappUrl.startsWith('https://wa.me/971569892095?text='));
  assert.match(decodeURIComponent(l.whatsappUrl), /Golden Shine.*Khalifa City/);
  assert.throws(() => bookingLink({ packageId: 'x' }));
});

async function exercise(client) {
  const { tools } = await client.listTools();
  assert.deepStrictEqual(tools.map((t) => t.name).sort(), TOOLS);
  let r = await client.callTool({ name: 'recommend_package', arguments: { seatsStained: true } });
  assert.match(r.content[0].text, /Detailing Shine/);
  r = await client.callTool({ name: 'wash_window_check', arguments: { temp: 25 } });
  assert.strictEqual(JSON.parse(r.content[0].text).verdict, 'good');
  r = await client.callTool({ name: 'wash_window_check', arguments: {} });
  assert.strictEqual(r.isError, true);
  r = await client.callTool({ name: 'booking_link', arguments: { packageId: 'quick' } });
  assert.match(r.content[0].text, /wa\.me\/971569892095/);
}

test('stdio transport', async () => {
  const client = new Client({ name: 'test', version: '0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [entry], env: { PATH: process.env.PATH } }));
  try { await exercise(client); } finally { await client.close(); }
});

test('streamable HTTP transport at /mcp', async () => {
  const port = 20000 + Math.floor(Math.random() * 20000);
  const child = spawn(process.execPath, [entry], { env: { PATH: process.env.PATH, PORT: String(port) }, stdio: ['ignore', 'ignore', 'pipe'] });
  try {
    await new Promise((resolve, reject) => {
      child.stderr.on('data', (d) => String(d).includes('listening') && resolve());
      child.on('exit', () => reject(new Error('server exited')));
      setTimeout(() => reject(new Error('timeout')), 8000);
    });
    assert.strictEqual((await fetch(`http://127.0.0.1:${port}/healthz`)).status, 200);
    assert.strictEqual((await fetch(`http://127.0.0.1:${port}/mcp`)).status, 405);
    const client = new Client({ name: 'test', version: '0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${port}/mcp`)));
    try { await exercise(client); } finally { await client.close(); }
  } finally {
    child.kill();
  }
});
