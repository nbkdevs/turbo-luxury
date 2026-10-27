// Pure logic for the Turbo Luxury Car Wash MCP server. No network access.

export const PACKAGES = [
  { id: 'quick', name: 'Quick Shine', min: 60, max: 70, includes: ['Exterior wash', 'Interior clean', 'Windows, wheels and rims', 'Mats, dry and perfume'] },
  { id: 'golden', name: 'Golden Shine', min: 100, max: 120, includes: ['Everything in Quick Shine', 'Wax application', 'Deep interior cleaning'] },
  { id: 'diamond', name: 'Diamond Shine', min: 150, max: 170, includes: ['Everything in Golden Shine', 'Engine compartment', 'Interior sanitization'] },
  { id: 'detailing', name: 'Detailing Shine', min: 300, max: 300, includes: ['Seat deep cleaning', 'AC sanitization', 'Interior restoration', 'Front light polishing'] }
];

export const BOOKING_PHONE = '+971569892095';

export const MONTH_TIPS = [
  'Mild and the best month for outdoor washing. After rain or fog, dry the car before waxing.',
  'Pleasant. On windy shamal days dust is in the air, so wash once the wind drops.',
  'First sand and dust days. Rinse dust off with plenty of water instead of wiping it dry.',
  'Hot afternoons and dusty spells. Wash early morning or evening, in shade.',
  'Panels get hot enough to bake soap and water spots into paint. Wash before 9am or after 6pm.',
  'Extreme heat. Park in shade before washing and keep panels wet while you work.',
  'Hot and humid, so drying is slow. Use a drying towel and dry glass by hand.',
  'Peak heat and humidity. Keep sessions short, in shade, and dry thoroughly.',
  'Still hot. Evening washes work best. A good time to renew wax or sealant before winter.',
  'Heat eases. Good time for a full detail, paint correction and interior deep clean.',
  'Comfortable and low dust. Ideal for polishing and waxing.',
  'Cool. Wash any time of day, and dry fully if the night is damp.'
];

export function listPackages() {
  return PACKAGES.map((p) => ({ ...p, price: p.min === p.max ? `${p.min} AED` : `${p.min}-${p.max} AED` }));
}

/** Pick a package from simple needs. */
export function recommendPackage({ wantsWax = false, interiorDirty = false, wantsEngineClean = false, wantsSanitization = false,
  seatsStained = false, acSmell = false, hazyHeadlights = false, justMaintenance = false } = {}) {
  const reasons = [];
  let tier = 0;
  const need = (t, why) => { tier = Math.max(tier, t); reasons.push(why); };
  if (seatsStained) need(3, 'Seat deep cleaning is part of Detailing Shine.');
  if (acSmell) need(3, 'AC sanitization is part of Detailing Shine.');
  if (hazyHeadlights) need(3, 'Front light polishing is part of Detailing Shine.');
  if (wantsEngineClean) need(2, 'Engine compartment cleaning starts at Diamond Shine.');
  if (wantsSanitization) need(2, 'Interior sanitization starts at Diamond Shine.');
  if (wantsWax) need(1, 'Wax application starts at Golden Shine.');
  if (interiorDirty) need(1, 'A deep interior clean starts at Golden Shine.');
  if (reasons.length === 0) {
    reasons.push(justMaintenance ? 'Regular upkeep is covered by Quick Shine.' : 'No special needs given, so the everyday package fits.');
  }
  const p = PACKAGES[tier];
  return { package: p.name, price: p.min === p.max ? `${p.min} AED` : `${p.min}-${p.max} AED`, includes: p.includes, reasons };
}

const num = (v, name, lo, hi) => {
  if (v === undefined) return undefined;
  if (!Number.isFinite(v) || v < lo || v > hi) throw new RangeError(`${name} must be between ${lo} and ${hi}`);
  return v;
};

/** Score a wash window 0-100 from temperature (C), wind (km/h), dust PM10 (ug/m3) and humidity (%). */
export function washWindow({ temp, wind, dust, humidity } = {}) {
  temp = num(temp, 'temp', -10, 60);
  wind = num(wind, 'wind', 0, 200);
  dust = num(dust, 'dust', 0, 5000);
  humidity = num(humidity, 'humidity', 0, 100);
  if ([temp, wind, dust, humidity].every((v) => v === undefined)) throw new RangeError('Provide at least one input');
  let score = 100;
  const reasons = [];
  const tips = [];
  if (temp !== undefined) {
    if (temp > 45) { score -= 55; reasons.push('Extreme heat'); tips.push('Do not wash outdoors in direct sun.'); }
    else if (temp > 38) { score -= 35; reasons.push('Very hot'); tips.push('Wash in full shade, panel by panel.'); }
    else if (temp > 32) { score -= 15; reasons.push('Hot'); tips.push('Prefer shade and small sections.'); }
    else if (temp < 8) { score -= 15; reasons.push('Cold'); tips.push('Dry the car fully.'); }
  }
  if (wind !== undefined) {
    if (wind > 45) { score -= 40; reasons.push('Strong wind'); tips.push('Wind will throw dust onto a wet car. Wait.'); }
    else if (wind > 30) { score -= 25; reasons.push('Windy'); tips.push('Use a sheltered spot or wait.'); }
    else if (wind > 20) { score -= 10; reasons.push('Breezy'); }
  }
  if (dust !== undefined) {
    if (dust > 500) { score -= 50; reasons.push('Heavy dust'); tips.push('Wash after the dust settles.'); }
    else if (dust > 150) { score -= 30; reasons.push('Dusty'); tips.push('A wash now will not last.'); }
    else if (dust > 50) { score -= 10; reasons.push('Some dust'); }
  }
  if (humidity !== undefined) {
    if (humidity > 85) { score -= 20; reasons.push('Very humid'); tips.push('Use a drying towel; dry glass by hand.'); }
    else if (humidity > 70) { score -= 8; reasons.push('Humid'); }
  }
  score = Math.max(0, Math.min(100, score));
  const verdict = score >= 80 ? 'good' : score >= 55 ? 'okay' : score >= 30 ? 'poor' : 'wait';
  if (!reasons.length) reasons.push('Conditions are fine');
  return { score, verdict, reasons, tips };
}

export function monthTip(month) {
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new RangeError('month must be an integer from 1 to 12');
  return MONTH_TIPS[month - 1];
}

/** Build a wa.me booking link with a prefilled message. */
export function bookingLink({ packageId = 'quick', area, vehicle, preferredTime } = {}) {
  const pkg = PACKAGES.find((p) => p.id === String(packageId).toLowerCase());
  if (!pkg) throw new RangeError(`packageId must be one of ${PACKAGES.map((p) => p.id).join(', ')}`);
  const parts = [`Hello, I would like to book the ${pkg.name} package.`];
  if (vehicle) parts.push(`Vehicle: ${vehicle}.`);
  if (area) parts.push(`Location: ${area}, Abu Dhabi.`);
  if (preferredTime) parts.push(`Preferred time: ${preferredTime}.`);
  const message = parts.join(' ');
  return {
    package: pkg.name,
    message,
    whatsappUrl: `https://wa.me/${BOOKING_PHONE.slice(1)}?text=${encodeURIComponent(message)}`,
    phone: BOOKING_PHONE
  };
}
