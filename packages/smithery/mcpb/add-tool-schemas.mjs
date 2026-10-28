// Smithery's publish API needs every manifest tool to carry an MCP `inputSchema` (its server card follows the
// MCP Tool type), but the MCPB 0.3 strict schema used by `mcpb validate/pack` only allows name + description.
// So after packing, start the staged server over stdio, read tools/list, and write title/inputSchema/annotations
// into manifest.json inside the packed .mcpb. MCPB clients read manifests with the loose schema, which ignores
// the extra keys. Usage: node mcpb/add-tool-schemas.mjs <stage-dir> <bundle.mcpb>
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const [stage, bundle] = process.argv.slice(2).map((p) => resolve(p));
const manifest = JSON.parse(readFileSync(join(stage, 'manifest.json'), 'utf8'));
const c = new Client({ name: 'add-tool-schemas', version: '0' });
await c.connect(new StdioClientTransport({ command: 'node', args: [join(stage, 'src/index.js')], cwd: stage }));
const { tools } = await c.listTools();
await c.close();
manifest.tools = manifest.tools.map((t) => {
  const live = tools.find((x) => x.name === t.name);
  if (!live) throw new Error(`tool ${t.name} not served`);
  const { $schema, ...inputSchema } = live.inputSchema;
  return { name: t.name, title: live.title, description: t.description, inputSchema, annotations: live.annotations };
});
if (manifest.tools.length !== tools.length) throw new Error('manifest/server tool count mismatch');
const out = join(stage, '..', 'manifest.smithery.json');
writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
execFileSync('python3', ['-c', `
import sys, zipfile, shutil, os
src, man = sys.argv[1], sys.argv[2]
tmp = src + '.tmp'
with zipfile.ZipFile(src) as zi, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zo:
    for info in zi.infolist():
        data = open(man, 'rb').read() if info.filename == 'manifest.json' else zi.read(info.filename)
        zo.writestr(info, data, compress_type=zipfile.ZIP_DEFLATED)
os.replace(tmp, src)
`, bundle, out], { stdio: 'inherit' });
console.log(`added inputSchema to ${manifest.tools.length} tools in ${bundle}`);
