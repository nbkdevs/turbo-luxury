#!/usr/bin/env node
'use strict';
const lib = require('../lib/index.js');

const HELP = `turbo-luxury-wash-advisor - pick a mobile car wash package and wash frequency (UAE climate)

Usage:
  turbo-luxury-wash-advisor recommend [options]   Recommend a package and interval
  turbo-luxury-wash-advisor plan [options]        Build a visit plan with a cost range
  turbo-luxury-wash-advisor packages              List packages and AED price ranges

Options:
  --vehicle sedan|suv|luxury|sports     (default sedan)
  --parking outdoor|covered|garage      (default outdoor)
  --driving city|mixed|desert           (default city)
  --smoker --pets --kids                cabin load
  --seat-stains --ac-smell --hazy-headlights
  --months-since-wax N  --months-since-deep-interior N  --months-since-engine-clean N
  --months N        plan length in months (default 3)    --start YYYY-MM-DD
  --json            machine-readable output
  -h, --help        show this help
`;

const BOOL = new Set(['smoker', 'pets', 'kids', 'seat-stains', 'ac-smell', 'hazy-headlights', 'json', 'help']);

function camel(s) { return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); }

function parse(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '-h') { out.help = true; continue; }
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const key = a.slice(2);
    if (BOOL.has(key)) { out[camel(key)] = true; continue; }
    const val = argv[i + 1];
    if (val === undefined || val.startsWith('--')) throw new Error('Missing value for --' + key);
    out[camel(key)] = val;
    i += 1;
  }
  return out;
}

function main(argv, stdout, stderr) {
  let args;
  try { args = parse(argv); } catch (e) { stderr.write(e.message + '\n'); return 2; }
  const cmd = args._[0];
  if (args.help || !cmd) { stdout.write(HELP); return cmd || args.help ? 0 : 1; }
  try {
    if (cmd === 'packages') {
      if (args.json) { stdout.write(JSON.stringify(lib.ORDER.map((id) => lib.PACKAGES[id]), null, 2) + '\n'); return 0; }
      lib.ORDER.forEach((id) => {
        const p = lib.PACKAGES[id];
        stdout.write(p.name.padEnd(16) + lib.formatPrice(p).padEnd(12) + p.summary + '\n');
      });
      return 0;
    }
    if (cmd === 'recommend') {
      const rec = lib.recommend(args);
      stdout.write((args.json ? JSON.stringify(rec, null, 2) : lib.formatRecommendation(rec)) + '\n');
      return 0;
    }
    if (cmd === 'plan') {
      const pl = lib.plan(args, { months: args.months, start: args.start });
      stdout.write((args.json ? JSON.stringify(pl, null, 2) : lib.formatPlan(pl)) + '\n');
      return 0;
    }
    stderr.write('Unknown command: ' + cmd + '\n' + HELP);
    return 2;
  } catch (e) {
    stderr.write('Error: ' + e.message + '\n');
    return 2;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2), process.stdout, process.stderr);
}
module.exports = { main, parse };
