(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var state = { entries: [], settings: {}, odometer: null };

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  Object.keys(CareLib.TYPES).forEach(function (k) {
    var o = document.createElement("option");
    o.value = k; o.textContent = CareLib.TYPES[k].label;
    $("type").appendChild(o);
  });
  $("date").value = todayIso();

  function save(cb) {
    chrome.storage.local.set({ entries: state.entries, settings: state.settings, odometer: state.odometer }, cb);
  }

  function render() {
    var list = $("due");
    list.textContent = "";
    var due = CareLib.dueList(state.entries, todayIso(), state.settings, state.odometer);
    if (!due.length) {
      var li = document.createElement("li");
      li.className = "empty";
      li.textContent = "No services logged yet. Add one below.";
      list.appendChild(li);
      return;
    }
    due.forEach(function (d) {
      var li = document.createElement("li");
      li.className = d.status;
      var name = document.createElement("span");
      name.textContent = d.label;
      var when = document.createElement("span");
      when.className = "when";
      var text = d.daysLeft < 0 ? "overdue " + (-d.daysLeft) + " d" : d.daysLeft === 0 ? "due today" : "in " + d.daysLeft + " d";
      if (d.kmLeft !== null) text += d.kmLeft < 0 ? " · " + (-d.kmLeft) + " km over" : " · " + d.kmLeft + " km left";
      when.textContent = text + " (" + d.dueDate + ")";
      li.appendChild(name); li.appendChild(when);
      list.appendChild(li);
    });
  }

  $("form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var r = CareLib.makeEntry({ type: $("type").value, date: $("date").value.trim(), odometer: $("odo").value.trim(), note: $("note").value }, todayIso());
    if (r.error) { $("error").textContent = r.error; return; }
    $("error").textContent = "";
    state.entries.push(r.entry);
    if (r.entry.odometer !== undefined && (state.odometer === null || r.entry.odometer > state.odometer)) {
      state.odometer = r.entry.odometer;
      $("current").value = state.odometer;
    }
    save(function () { $("odo").value = ""; $("note").value = ""; render(); });
  });

  $("current").addEventListener("change", function () {
    var v = Number($("current").value);
    state.odometer = isFinite(v) && $("current").value !== "" ? Math.round(v) : null;
    save(render);
  });

  $("export").addEventListener("click", function () {
    var blob = new Blob([CareLib.toCsv(state.entries)], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "car-care-log.csv";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  chrome.storage.local.get({ entries: [], settings: {}, odometer: null }, function (s) {
    state = { entries: s.entries, settings: s.settings, odometer: s.odometer };
    if (state.odometer !== null) $("current").value = state.odometer;
    render();
  });
})();
