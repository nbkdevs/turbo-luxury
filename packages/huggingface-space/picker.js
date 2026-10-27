(function (root) {
  'use strict';
  var PACKAGES = [
    { id: 'quick', name: 'Quick Shine', min: 60, max: 70, includes: ['Exterior wash', 'Interior clean', 'Windows, wheels and rims', 'Mats, dry and perfume'] },
    { id: 'golden', name: 'Golden Shine', min: 100, max: 120, includes: ['Everything in Quick Shine', 'Wax application', 'Deep interior cleaning'] },
    { id: 'diamond', name: 'Diamond Shine', min: 150, max: 170, includes: ['Everything in Golden Shine', 'Engine compartment', 'Interior sanitization'] },
    { id: 'detailing', name: 'Detailing Shine', min: 300, max: 300, includes: ['Seat deep cleaning', 'AC sanitization', 'Interior restoration', 'Front light polishing'] }
  ];

  // answers: { goal: 'upkeep'|'refresh'|'deep'|'restore', engine: bool, smell: bool, stains: bool, hazy: bool, visits: number }
  function pick(a) {
    a = a || {};
    var tier = 0;
    var why = [];
    function need(t, text) { if (t > tier) tier = t; why.push(text); }
    if (a.goal === 'refresh') need(1, 'You want a refresh with wax and a deeper interior clean.');
    if (a.goal === 'deep') need(2, 'You want engine bay and sanitization on top.');
    if (a.goal === 'restore') need(3, 'You want the most complete one-visit service.');
    if (a.engine) need(2, 'Engine compartment cleaning starts at Diamond Shine.');
    if (a.stains) need(3, 'Stained seats need the seat deep clean in Detailing Shine.');
    if (a.smell) need(3, 'AC smell is handled by AC sanitization in Detailing Shine.');
    if (a.hazy) need(3, 'Hazy headlights are covered by front light polishing in Detailing Shine.');
    if (!why.length) why.push('For regular upkeep the everyday package is enough.');
    var visits = Math.max(1, Math.min(52, Math.round(Number(a.visits) || 1)));
    var p = PACKAGES[tier];
    return {
      pkg: p, reasons: why, visits: visits,
      totalMin: p.min * visits, totalMax: p.max * visits
    };
  }

  var api = { PACKAGES: PACKAGES, pick: pick };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WashPicker = api;
})(typeof window !== 'undefined' ? window : globalThis);
