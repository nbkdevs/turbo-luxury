'use strict';
/**
 * turbo-luxury-wash-advisor
 * Pick the right mobile car wash package and wash frequency for a car in the UAE climate.
 * Dependency-free CommonJS, Node >= 18.
 */

const PACKAGES = Object.freeze({
  quick: Object.freeze({
    id: 'quick', name: 'Quick Shine', min: 60, max: 70, tier: 0,
    summary: 'Everyday exterior and interior upkeep at your location.',
    includes: ['Exterior wash', 'Interior clean', 'Windows, wheels and rims', 'Mats, dry and perfume'],
  }),
  golden: Object.freeze({
    id: 'golden', name: 'Golden Shine', min: 100, max: 120, tier: 1,
    summary: 'Adds wax and a deeper interior clean.',
    includes: ['Everything in Quick Shine', 'Wax application', 'Deep interior cleaning'],
  }),
  diamond: Object.freeze({
    id: 'diamond', name: 'Diamond Shine', min: 150, max: 170, tier: 2,
    summary: 'Engine bay cleaning and interior sanitization.',
    includes: ['Everything in Golden Shine', 'Engine compartment', 'Interior sanitization'],
  }),
  detailing: Object.freeze({
    id: 'detailing', name: 'Detailing Shine', min: 300, max: 300, tier: 3,
    summary: 'The most complete mobile package in one visit.',
    includes: ['Seat deep cleaning', 'AC sanitization', 'Interior restoration', 'Front light polishing'],
  }),
});

const ORDER = ['quick', 'golden', 'diamond', 'detailing'];
const VEHICLES = ['sedan', 'suv', 'luxury', 'sports'];
const PARKING = ['outdoor', 'covered', 'garage'];
const DRIVING = ['city', 'mixed', 'desert'];

function num(v, fallback) {
  if (v === undefined || v === null || v === '') return fallback;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) throw new RangeError('Expected a non-negative number, got ' + JSON.stringify(v));
  return n;
}

function oneOf(v, list, fallback, label) {
  if (v === undefined || v === null || v === '') return fallback;
  const s = String(v).toLowerCase();
  if (!list.includes(s)) throw new RangeError(label + ' must be one of ' + list.join(', ') + ' (got ' + JSON.stringify(v) + ')');
  return s;
}

/** Normalise and validate a car profile. */
function normalizeProfile(input) {
  const p = input || {};
  return {
    vehicle: oneOf(p.vehicle, VEHICLES, 'sedan', 'vehicle'),
    parking: oneOf(p.parking, PARKING, 'outdoor', 'parking'),
    driving: oneOf(p.driving, DRIVING, 'city', 'driving'),
    smoker: !!p.smoker,
    pets: !!p.pets,
    kids: !!p.kids,
    seatStains: !!p.seatStains,
    acSmell: !!p.acSmell,
    hazyHeadlights: !!p.hazyHeadlights,
    monthsSinceWax: num(p.monthsSinceWax, null),
    monthsSinceDeepInterior: num(p.monthsSinceDeepInterior, null),
    monthsSinceEngineClean: num(p.monthsSinceEngineClean, null),
  };
}

/** Days between washes: parking sets the base, dusty driving shortens it. Clamped to 4..21. */
function washIntervalDays(profile) {
  const p = normalizeProfile(profile);
  const base = { outdoor: 7, covered: 10, garage: 14 }[p.parking];
  const dust = { city: 0, mixed: -1, desert: -3 }[p.driving];
  return Math.min(21, Math.max(4, base + dust));
}

const atLeast = (v, n) => v !== null && v >= n;

/**
 * Recommend a package. Returns { package, alternatives, intervalDays, reasons, triggers }.
 * The package is the lowest tier that covers every trigger found in the profile.
 */
function recommend(profile) {
  const p = normalizeProfile(profile);
  const triggers = [];
  const add = (tier, reason) => triggers.push({ tier, reason });

  const premium = p.vehicle === 'luxury' || p.vehicle === 'sports';
  if (atLeast(p.monthsSinceWax, premium ? 2 : 3)) {
    add(1, 'Wax is ' + p.monthsSinceWax + ' month(s) old; ' + (premium ? 'premium paint' : 'UAE sun and dust') + ' wears it off, so a wax coat is due.');
  }
  const heavyInterior = p.pets || p.kids || p.smoker;
  if (heavyInterior && atLeast(p.monthsSinceDeepInterior, 3)) {
    add(1, 'Pets, kids or smoking load the cabin, and the last deep interior clean was ' + p.monthsSinceDeepInterior + ' months ago.');
  }
  if (atLeast(p.monthsSinceEngineClean, 12)) {
    add(2, 'The engine bay has not been cleaned for ' + p.monthsSinceEngineClean + ' months; desert dust builds up under the bonnet.');
  }
  if ((p.pets || p.smoker) && atLeast(p.monthsSinceDeepInterior, 6)) {
    add(2, 'Interior sanitization is worthwhile after ' + p.monthsSinceDeepInterior + ' months of pet or smoke exposure.');
  }
  if (p.seatStains) add(3, 'Seat stains need a seat deep clean.');
  if (p.acSmell) add(3, 'An AC smell points to the vents, so AC sanitization is the fix.');
  if (p.hazyHeadlights) add(3, 'Hazy headlights call for front light polishing.');
  if (atLeast(p.monthsSinceDeepInterior, 12)) add(3, 'No deep interior work for ' + p.monthsSinceDeepInterior + ' months; a full interior restoration is overdue.');

  const tier = triggers.reduce((m, t) => Math.max(m, t.tier), 0);
  const chosen = PACKAGES[ORDER[tier]];
  const intervalDays = washIntervalDays(p);
  const reasons = triggers.length
    ? triggers.map((t) => t.reason)
    : ['No deep-clean triggers: a regular Quick Shine keeps a ' + p.vehicle + ' in good shape.'];
  reasons.push('Wash every ' + intervalDays + ' days (' + p.parking + ' parking, ' + p.driving + ' driving).');

  const alternatives = ORDER.filter((id) => PACKAGES[id].tier !== tier).map((id) => PACKAGES[id]);
  return { package: chosen, alternatives, intervalDays, reasons, triggers };
}

function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

function assertIsoDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '') || Number.isNaN(Date.parse(iso + 'T00:00:00Z'))) {
    throw new RangeError('Date must be YYYY-MM-DD, got ' + JSON.stringify(iso));
  }
}

/**
 * Build a visit plan for the next N months. First visit uses the recommended package,
 * after that Quick Shine with a Golden Shine every 4th visit (wax and deep interior).
 */
function plan(profile, options) {
  const o = options || {};
  const months = num(o.months, 3);
  const start = o.start || new Date().toISOString().slice(0, 10);
  assertIsoDate(start);
  const rec = recommend(profile);
  const horizon = Math.round(months * 30);
  const visits = [];
  for (let day = 0, i = 0; day <= horizon; day += rec.intervalDays, i += 1) {
    let pkg = PACKAGES.quick;
    if (i === 0) pkg = rec.package;
    else if (i % 4 === 0) pkg = PACKAGES.golden;
    visits.push({ date: addDays(start, day), package: pkg.id, name: pkg.name, min: pkg.min, max: pkg.max });
  }
  const totalMin = visits.reduce((s, v) => s + v.min, 0);
  const totalMax = visits.reduce((s, v) => s + v.max, 0);
  const perMonthMin = Math.round((totalMin / months) * 10) / 10;
  const perMonthMax = Math.round((totalMax / months) * 10) / 10;
  return { intervalDays: rec.intervalDays, months, visits, totalMin, totalMax, perMonthMin, perMonthMax, currency: 'AED' };
}

function formatPrice(pkg) {
  return pkg.min === pkg.max ? pkg.min + ' AED' : pkg.min + '-' + pkg.max + ' AED';
}

function formatRecommendation(rec) {
  const lines = [];
  lines.push('Recommended: ' + rec.package.name + ' (' + formatPrice(rec.package) + ')');
  lines.push(rec.package.summary);
  lines.push('Includes: ' + rec.package.includes.join('; '));
  lines.push('');
  rec.reasons.forEach((r) => lines.push('- ' + r));
  return lines.join('\n');
}

function formatPlan(pl) {
  const lines = ['Wash plan: every ' + pl.intervalDays + ' days for ' + pl.months + ' month(s)'];
  pl.visits.forEach((v) => lines.push('  ' + v.date + '  ' + v.name + ' (' + (v.min === v.max ? v.min : v.min + '-' + v.max) + ' AED)'));
  lines.push('Total: ' + pl.totalMin + '-' + pl.totalMax + ' AED (about ' + pl.perMonthMin + '-' + pl.perMonthMax + ' AED per month)');
  return lines.join('\n');
}

module.exports = {
  PACKAGES, ORDER, VEHICLES, PARKING, DRIVING,
  normalizeProfile, washIntervalDays, recommend, plan, addDays,
  formatPrice, formatRecommendation, formatPlan,
};
