(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var citySel = $("city");

  Object.keys(WashLib.CITIES).forEach(function (k) {
    var o = document.createElement("option");
    o.value = k; o.textContent = WashLib.CITIES[k].label;
    citySel.appendChild(o);
  });

  function getJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  function render(days) {
    var list = $("days");
    list.textContent = "";
    days.forEach(function (d) {
      var li = document.createElement("li");
      li.className = d.verdict;
      var day = document.createElement("span");
      day.className = "d";
      day.textContent = WashLib.weekday(d.date) + " " + d.date.slice(8);
      var mid = document.createElement("span");
      var line = document.createElement("div");
      line.textContent = Math.round(d.temp) + "°C · rain " + d.rain + "% · wind " + Math.round(d.wind) + " km/h";
      var why = document.createElement("div");
      why.className = "why";
      why.textContent = d.reasons.length ? d.reasons.join(", ") : "clear, calm and dry";
      mid.appendChild(line); mid.appendChild(why);
      var pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = d.score;
      li.appendChild(day); li.appendChild(mid); li.appendChild(pill);
      list.appendChild(li);
    });
    var best = WashLib.bestDay(days);
    $("best").textContent = best
      ? "Best day to wash: " + WashLib.weekday(best.date) + " " + best.date.slice(8) + " (score " + best.score + ")"
      : "No forecast available.";
  }

  function load(key) {
    var city = WashLib.CITIES[key];
    $("status").textContent = "";
    $("best").textContent = "Loading forecast…";
    Promise.all([
      getJson(WashLib.forecastUrl(city)),
      getJson(WashLib.dustUrl(city)).catch(function () { return null; })
    ]).then(function (res) {
      render(WashLib.buildDays(res[0], res[1]));
    }).catch(function (e) {
      $("best").textContent = "Could not load the forecast.";
      $("status").textContent = String(e && e.message || e);
    });
  }

  citySel.addEventListener("change", function () {
    chrome.storage.local.set({ city: citySel.value });
    load(citySel.value);
  });

  chrome.storage.local.get({ city: "abu-dhabi" }, function (s) {
    var key = WashLib.CITIES[s.city] ? s.city : "abu-dhabi";
    citySel.value = key;
    load(key);
  });
})();
