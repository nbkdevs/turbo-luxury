'use strict';

// Typical Abu Dhabi conditions by month (approximate average daytime highs in C).
const MONTHS = [
  { month: 'January', high: 24, note: 'Mild and the best month for outdoor washing. Occasional rain and fog: wait for the car to dry before waxing.' },
  { month: 'February', high: 26, note: 'Pleasant. Shamal wind days can lift dust, so wash after the wind drops.' },
  { month: 'March', high: 30, note: 'Warming up with the first sand and dust days. Rinse dust off with water, never wipe it dry.' },
  { month: 'April', high: 35, note: 'Hot afternoons and dusty spells. Wash in the early morning or evening shade.' },
  { month: 'May', high: 40, note: 'Surfaces get hot enough to bake soap and water spots on paint. Wash before 9am or after 6pm.' },
  { month: 'June', high: 42, note: 'Extreme heat. Never wash a hot car in direct sun; park in shade first and keep panels wet while working.' },
  { month: 'July', high: 43, note: 'Hot and humid. Humidity slows drying, so use a drying towel and avoid leaving water on glass.' },
  { month: 'August', high: 43, note: 'Peak heat and humidity. Short sessions in shade, dry thoroughly and check tyre pressure after.' },
  { month: 'September', high: 40, note: 'Still hot. Evening washes work best, and this is a good time to renew wax or sealant before winter.' },
  { month: 'October', high: 36, note: 'Heat eases. Good time for a full detail, paint correction and interior deep clean.' },
  { month: 'November', high: 30, note: 'Comfortable weather and low dust. Ideal for polishing and waxing.' },
  { month: 'December', high: 26, note: 'Cool. Wash any time of day, and dry the car fully if the night is damp.' }
];

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function num(v, name, lo, hi) {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n < lo || n > hi) {
    const e = new Error(`${name} must be a number between ${lo} and ${hi}`);
    e.status = 400;
    throw e;
  }
  return n;
}

// Score a washing window (0-100) from air temperature (C), wind (km/h),
// airborne dust (PM10 in ug/m3) and relative humidity (%). Missing inputs are skipped.
function washWindow(input = {}) {
  const temp = num(input.temp, 'temp', -10, 60);
  const wind = num(input.wind, 'wind', 0, 200);
  const dust = num(input.dust, 'dust', 0, 5000);
  const humidity = num(input.humidity, 'humidity', 0, 100);
  if ([temp, wind, dust, humidity].every((v) => v === undefined)) {
    const e = new Error('Provide at least one of temp, wind, dust, humidity');
    e.status = 400;
    throw e;
  }

  let score = 100;
  const reasons = [];
  const tips = [];

  if (temp !== undefined) {
    if (temp > 45) { score -= 55; reasons.push('Extreme heat'); tips.push('Do not wash outdoors in direct sun; paint can be too hot to touch.'); }
    else if (temp > 38) { score -= 35; reasons.push('Very hot'); tips.push('Wash in full shade and rinse panel by panel so water does not dry on the paint.'); }
    else if (temp > 32) { score -= 15; reasons.push('Hot'); tips.push('Prefer shade, and work in small sections.'); }
    else if (temp < 8) { score -= 15; reasons.push('Cold'); tips.push('Dry the car fully to avoid water freezing in door seals.'); }
  }
  if (wind !== undefined) {
    if (wind > 45) { score -= 40; reasons.push('Strong wind'); tips.push('Wind will throw dust onto a wet car. Wait.'); }
    else if (wind > 30) { score -= 25; reasons.push('Windy'); tips.push('Choose a sheltered spot or wait for the wind to drop.'); }
    else if (wind > 20) { score -= 10; reasons.push('Breezy'); }
  }
  if (dust !== undefined) {
    if (dust > 500) { score -= 50; reasons.push('Heavy dust'); tips.push('Wash after the dust settles, and rinse before touching the paint.'); }
    else if (dust > 150) { score -= 30; reasons.push('Dusty'); tips.push('A wash now will not last. Wait for clearer air if you can.'); }
    else if (dust > 50) { score -= 10; reasons.push('Some dust'); }
  }
  if (humidity !== undefined) {
    if (humidity > 85) { score -= 20; reasons.push('Very humid'); tips.push('The car will dry slowly. Use a microfibre drying towel and dry glass by hand.'); }
    else if (humidity > 70) { score -= 8; reasons.push('Humid'); }
  }

  score = clamp(Math.round(score), 0, 100);
  const verdict = score >= 80 ? 'good' : score >= 55 ? 'okay' : score >= 30 ? 'poor' : 'wait';
  if (reasons.length === 0) reasons.push('Conditions are fine');
  return { score, verdict, reasons, tips };
}

function calendar(monthIndex) {
  if (monthIndex === undefined) return MONTHS;
  const i = Number(monthIndex);
  if (!Number.isInteger(i) || i < 1 || i > 12) {
    const e = new Error('month must be an integer from 1 to 12');
    e.status = 400;
    throw e;
  }
  return MONTHS[i - 1];
}

module.exports = { MONTHS, washWindow, calendar };
