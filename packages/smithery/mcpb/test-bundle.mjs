// Unpack dist/*.mcpb to a temp dir, start it over stdio with a real MCP client, list tools and call two.
// Usage: node mcpb/test-bundle.mjs dist/turbo-luxury-mcp-1.0.0.mcpb
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const bundle = resolve(process.argv[2] ?? 'dist/turbo-luxury-mcp-1.0.0.mcpb');
const dir = mkdtempSync(join(tmpdir(), 'mcpb-'));
execFileSync('npx', ['-y', '@anthropic-ai/mcpb@2.1.2', 'unpack', bundle, dir], { stdio: 'ignore' });
const c = new Client({ name: 'bundle-test', version: '0' });
await c.connect(new StdioClientTransport({ command: 'node', args: [join(dir, 'src/index.js')], cwd: dir }));
console.log('serverInfo', JSON.stringify(c.getServerVersion()));
const { tools } = await c.listTools();
for (const t of tools) console.log('-', t.name);
if (tools.length !== 5) throw new Error(`expected 5 tools, got ${tools.length}`);
const r = await c.callTool({ name: 'recommend_package', arguments: { wantsWax: true } });
if (JSON.parse(r.content[0].text).package !== 'Golden Shine') throw new Error('recommend_package mismatch');
const m = await c.callTool({ name: 'monthly_care_tip', arguments: { month: 7 } });
console.log('monthly_care_tip(7):', JSON.parse(m.content[0].text).tip);
await c.close();
console.log('OK');
