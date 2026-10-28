(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var state = { place: null, units: "metric", days: null };

  function getJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  function render() {
    var list = $("days");
    list.textContent = "";
    var days = state.days || [];
    days.forEach(function (d) {
      var li = document.createElement("li");
      li.className = d.verdict;
      var day = document.createElement("span");
      day.className = "d";
      day.textContent = WashLib.weekday(d.date) + " " + d.date.slice(8);
      var mid = document.createElement("span");
      var line = document.createElement("div");
      line.textContent = WashLib.fmtTemp(d.temp, state.units) + " · rain " + d.rain + "% · wind " + WashLib.fmtWind(d.wind, state.units);
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

  function load() {
    var place = state.place;
    $("place").textContent = place.label;
    $("status").textContent = "";
    $("best").textContent = "Loading forecast…";
    $("days").textContent = "";
    Promise.all([
      getJson(WashLib.forecastUrl(place)),
      getJson(WashLib.dustUrl(place)).catch(function () { return null; })
    ]).then(function (res) {
      state.days = WashLib.buildDays(res[0], res[1]);
      render();
    }).catch(function (e) {
      $("best").textContent = "Could not load the forecast.";
      $("status").textContent = String(e && e.message || e);
    });
  }

  function choose(place) {
    state.place = place;
    chrome.storage.local.set({ place: place });
    $("results").textContent = "";
    $("q").value = "";
    $("where").open = false;
    load();
  }

  $("search").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var q = $("q").value.trim();
    var out = $("results");
    out.textContent = "";
    $("status").textContent = "";
    if (q.length < 2) return;
    var lang = (navigator.language || "en").slice(0, 2);
    getJson(WashLib.geocodeUrl(q, lang)).then(function (json) {
      var places = WashLib.parsePlaces(json);
      if (!places.length) {
        var none = document.createElement("li");
        none.className = "none";
        none.textContent = "No place found. Try another spelling.";
        out.appendChild(none);
        return;
      }
      places.forEach(function (p) {
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = p.label;
        b.addEventListener("click", function () { choose(p); });
        li.appendChild(b);
        out.appendChild(li);
      });
    }).catch(function (e) {
      $("status").textContent = "Search failed: " + String(e && e.message || e);
    });
  });

  $("units").addEventListener("change", function () {
    state.units = $("units").value === "imperial" ? "imperial" : "metric";
    chrome.storage.local.set({ units: state.units });
    if (state.days) render();
  });

  chrome.storage.local.get({ place: null, units: "metric" }, function (s) {
    state.units = s.units === "imperial" ? "imperial" : "metric";
    $("units").value = state.units;
    if (WashLib.validPlace(s.place)) {
      state.place = s.place;
      load();
    } else {
      $("where").open = true;
      $("q").focus();
    }
  });
})();
