(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var entries = [];

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  $("date").value = todayIso();

  function tile(value, label) {
    var t = document.createElement("div");
    t.className = "tile";
    var b = document.createElement("div"); b.className = "big"; b.textContent = value;
    var l = document.createElement("div"); l.className = "lbl"; l.textContent = label;
    t.appendChild(b); t.appendChild(l);
    return t;
  }

  function render() {
    var box = $("summary");
    box.textContent = "";
    var s = FuelLib.summary(entries);
    if (!s) {
      var p = document.createElement("p");
      p.className = "none";
      p.textContent = "Log two full-tank fill-ups to see your consumption.";
      box.appendChild(p);
    } else {
      box.appendChild(tile(s.lPer100.toFixed(1), "L / 100 km"));
      box.appendChild(tile(s.kmPerL.toFixed(1), "km per litre"));
      box.appendChild(tile(s.costPerKm === null ? "–" : s.costPerKm.toFixed(2), "AED per km"));
    }
    var list = $("recent");
    list.textContent = "";
    entries.slice().sort(function (a, b) { return b.odometer - a.odometer; }).slice(0, 5).forEach(function (e) {
      var li = document.createElement("li");
      var a = document.createElement("span"); a.textContent = e.date + " · " + e.odometer + " km";
      var b = document.createElement("span"); b.textContent = e.litres + " L" + (e.price ? " · " + (e.litres * e.price).toFixed(2) + " AED" : "") + (e.full ? "" : " (part)");
      li.appendChild(a); li.appendChild(b);
      list.appendChild(li);
    });
  }

  $("form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var r = FuelLib.validate({ date: $("date").value.trim(), odometer: $("odo").value.trim(), litres: $("litres").value.trim(), price: $("price").value.trim(), full: $("full").checked }, entries, todayIso());
    if (r.error) { $("error").textContent = r.error; return; }
    $("error").textContent = "";
    entries.push(r.entry);
    chrome.storage.local.set({ entries: entries }, function () {
      $("odo").value = ""; $("litres").value = "";
      render();
    });
  });

  $("export").addEventListener("click", function () {
    var blob = new Blob([FuelLib.toCsv(entries)], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fuel-economy-log.csv";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  chrome.storage.local.get({ entries: [] }, function (s) { entries = s.entries; render(); });
})();
