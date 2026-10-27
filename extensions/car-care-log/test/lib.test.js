const test = require("node:test");
const assert = require("node:assert");
const L = require("../src/lib.js");

test("date helpers", () => {
  assert.equal(L.addDays("2026-10-27", 14), "2026-11-10");
  assert.equal(L.addDays("2026-12-25", 10), "2027-01-04");
  assert.equal(L.daysBetween("2026-10-01", "2026-10-27"), 26);
  assert.equal(L.isValidDate("2026-02-30"), false);
  assert.equal(L.isValidDate("2026-02-28"), true);
  assert.equal(L.isValidDate("27/10/2026"), false);
});

test("latestByType keeps the newest", () => {
  const l = L.latestByType([{ type: "wash", date: "2026-10-01" }, { type: "wash", date: "2026-10-20" }, { type: "oil", date: "2026-06-01" }]);
  assert.equal(l.wash.date, "2026-10-20");
  assert.equal(l.oil.date, "2026-06-01");
});

test("dueList: wash overdue, oil ok, sorted worst first", () => {
  const entries = [{ type: "oil", date: "2026-10-01", odometer: 50000 }, { type: "wash", date: "2026-10-01" }];
  const due = L.dueList(entries, "2026-10-27", {}, 50500);
  assert.equal(due[0].type, "wash");
  assert.equal(due[0].status, "overdue");
  assert.equal(due[0].daysLeft, -12);
  assert.equal(due[1].status, "ok");
  assert.equal(due[1].kmLeft, 7000);
});

test("dueList: kilometres can make a service overdue and custom interval is honoured", () => {
  const entries = [{ type: "oil", date: "2026-10-20", odometer: 40000 }, { type: "wash", date: "2026-10-20" }];
  const due = L.dueList(entries, "2026-10-27", { intervals: { wash: 30 } }, 48000);
  const oil = due.find((d) => d.type === "oil");
  const wash = due.find((d) => d.type === "wash");
  assert.equal(oil.status, "overdue");
  assert.equal(oil.kmLeft, -500);
  assert.equal(wash.dueDate, "2026-11-19");
  assert.equal(wash.status, "ok");
});

test("soon threshold is 7 days", () => {
  const due = L.dueList([{ type: "wash", date: "2026-10-20" }], "2026-10-27", {});
  assert.equal(due[0].daysLeft, 7);
  assert.equal(due[0].status, "soon");
});

test("notifications", () => {
  const due = L.dueList([{ type: "wash", date: "2026-10-01" }, { type: "ac", date: "2026-10-01" }], "2026-10-27", {});
  const items = L.notifiable(due);
  assert.equal(items.length, 1);
  assert.equal(L.notificationText(items), "Car wash overdue by 12 d");
  assert.equal(L.notificationText([]), "");
});

test("csv escaping and ordering", () => {
  const csv = L.toCsv([{ type: "wash", date: "2026-10-02", note: 'said "ok", fine' }, { type: "oil", date: "2026-10-01", odometer: 5000, note: "" }]);
  assert.equal(csv, 'date,type,odometer_km,note\n2026-10-01,oil,5000,\n2026-10-02,wash,,"said ""ok"", fine"\n');
});

test("makeEntry validation", () => {
  assert.ok(L.makeEntry({ type: "nope", date: "2026-10-01" }, "2026-10-27").error);
  assert.ok(L.makeEntry({ type: "wash", date: "2026-13-01" }, "2026-10-27").error);
  assert.ok(L.makeEntry({ type: "wash", date: "2026-11-01" }, "2026-10-27").error);
  assert.ok(L.makeEntry({ type: "oil", date: "2026-10-01", odometer: "-5" }, "2026-10-27").error);
  const ok = L.makeEntry({ type: "oil", date: "2026-10-01", odometer: "12345.6", note: "x" }, "2026-10-27");
  assert.equal(ok.entry.odometer, 12346);
  assert.equal(L.makeEntry({ type: "wash", date: "2026-10-01", odometer: "" }, "2026-10-27").entry.odometer, undefined);
});
