/* Daily check: notify when a service is due soon or overdue. */
importScriptsIfWorker();

function importScriptsIfWorker() {
  if (typeof importScripts === "function") importScripts("lib.js");
}

var ALARM = "daily-check";

function todayIso() {
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function schedule() {
  chrome.alarms.get(ALARM, function (a) {
    if (!a) chrome.alarms.create(ALARM, { delayInMinutes: 1, periodInMinutes: 24 * 60 });
  });
}

function check() {
  chrome.storage.local.get({ entries: [], settings: {}, odometer: null, lastNotified: "" }, function (s) {
    var today = todayIso();
    if (s.lastNotified === today) return;
    var items = CareLib.notifiable(CareLib.dueList(s.entries, today, s.settings, s.odometer));
    if (!items.length) return;
    chrome.notifications.create("care-due", {
      type: "basic",
      iconUrl: "icons/icon-128.png",
      title: "Car care reminder",
      message: CareLib.notificationText(items)
    });
    chrome.storage.local.set({ lastNotified: today });
  });
}

chrome.runtime.onInstalled.addListener(schedule);
chrome.runtime.onStartup.addListener(schedule);
chrome.alarms.onAlarm.addListener(function (a) { if (a.name === ALARM) check(); });
