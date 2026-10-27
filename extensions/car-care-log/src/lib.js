/* Service-log logic. Pure functions; dates are ISO yyyy-mm-dd strings. */
(function (root) {
  "use strict";

  var TYPES = {
    wash: { label: "Car wash", days: 14 },
    oil: { label: "Oil and filter", days: 180, km: 7500 },
    tyres: { label: "Tyre rotation", days: 180, km: 10000 },
    battery: { label: "Battery check", days: 365 },
    ac: { label: "AC service", days: 365 },
    brakes: { label: "Brake check", days: 365, km: 20000 },
    polish: { label: "Polish and wax", days: 120 },
    registration: { label: "Registration / inspection", days: 365 }
  };

  var DAY = 86400000;

  function toUtc(iso) {
    var p = String(iso).split("-");
    return Date.UTC(+p[0], +p[1] - 1, +p[2]);
  }

  function fromUtc(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function addDays(iso, n) { return fromUtc(toUtc(iso) + n * DAY); }

  function daysBetween(a, b) { return Math.round((toUtc(b) - toUtc(a)) / DAY); }

  function isValidDate(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso))) return false;
    return fromUtc(toUtc(iso)) === iso;
  }

  /** Latest entry of each type. */
  function latestByType(entries) {
    var out = {};
    entries.forEach(function (e) {
      var cur = out[e.type];
      if (!cur || e.date > cur.date || (e.date === cur.date && e.odometer > cur.odometer)) out[e.type] = e;
    });
    return out;
  }

  /**
   * Status of every service type that has at least one entry.
   * settings.intervals may override days per type. currentOdometer is optional.
   */
  function dueList(entries, today, settings, currentOdometer) {
    var intervals = (settings && settings.intervals) || {};
    var latest = latestByType(entries);
    var list = [];
    Object.keys(latest).forEach(function (type) {
      var def = TYPES[type];
      if (!def) return;
      var last = latest[type];
      var days = positiveInt(intervals[type]) || def.days;
      var dueDate = addDays(last.date, days);
      var daysLeft = daysBetween(today, dueDate);
      var kmLeft = null;
      if (def.km && isNum(last.odometer) && isNum(currentOdometer)) {
        kmLeft = last.odometer + def.km - currentOdometer;
      }
      var overdue = daysLeft < 0 || (kmLeft !== null && kmLeft < 0);
      var soon = !overdue && (daysLeft <= 7 || (kmLeft !== null && kmLeft <= 500));
      list.push({ type: type, label: def.label, lastDate: last.date, dueDate: dueDate, daysLeft: daysLeft,
        kmLeft: kmLeft, status: overdue ? "overdue" : soon ? "soon" : "ok" });
    });
    var rank = { overdue: 0, soon: 1, ok: 2 };
    list.sort(function (a, b) { return rank[a.status] - rank[b.status] || a.daysLeft - b.daysLeft; });
    return list;
  }

  /** Items that should trigger a notification today. */
  function notifiable(due) {
    return due.filter(function (d) { return d.status !== "ok"; });
  }

  function notificationText(items) {
    if (!items.length) return "";
    var parts = items.slice(0, 3).map(function (d) {
      return d.label + (d.daysLeft < 0 ? " overdue by " + (-d.daysLeft) + " d" : d.daysLeft === 0 ? " due today" : " due in " + d.daysLeft + " d");
    });
    if (items.length > 3) parts.push("+" + (items.length - 3) + " more");
    return parts.join("; ");
  }

  function csvEscape(v) {
    var s = v === undefined || v === null ? "" : String(v);
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function toCsv(entries) {
    var rows = ["date,type,odometer_km,note"];
    entries.slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; }).forEach(function (e) {
      rows.push([e.date, e.type, e.odometer === undefined ? "" : e.odometer, e.note].map(csvEscape).join(","));
    });
    return rows.join("\n") + "\n";
  }

  /** Validate and normalise a form submission. Returns {entry} or {error}. */
  function makeEntry(input, today) {
    if (!TYPES[input.type]) return { error: "Choose a service type." };
    if (!isValidDate(input.date)) return { error: "Enter the date as yyyy-mm-dd." };
    if (input.date > today) return { error: "The date is in the future." };
    var entry = { type: input.type, date: input.date, note: String(input.note || "").slice(0, 120) };
    if (input.odometer !== "" && input.odometer !== undefined && input.odometer !== null) {
      var od = Number(input.odometer);
      if (!isFinite(od) || od < 0 || od > 2000000) return { error: "Odometer must be between 0 and 2,000,000 km." };
      entry.odometer = Math.round(od);
    }
    return { entry: entry };
  }

  function isNum(v) { return typeof v === "number" && isFinite(v); }
  function positiveInt(v) { v = Math.round(Number(v)); return v > 0 ? v : 0; }

  var api = { TYPES: TYPES, addDays: addDays, daysBetween: daysBetween, isValidDate: isValidDate,
    latestByType: latestByType, dueList: dueList, notifiable: notifiable, notificationText: notificationText,
    toCsv: toCsv, makeEntry: makeEntry };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CareLib = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
