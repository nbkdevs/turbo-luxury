"""Core logic. All durability figures are planning estimates for UAE sun, heat and dust,
shorter than the label claims you see in cooler climates. They are not lab results."""

from __future__ import annotations

import calendar
from dataclasses import dataclass
from datetime import date
from typing import Dict, List, Optional


@dataclass(frozen=True)
class Product:
    id: str
    name: str
    months_min: int  # realistic protection in UAE conditions
    months_max: int
    uv_resistance: int  # 1 (low) .. 5 (high)
    gloss: str
    needs_polish_first: bool
    note: str

    @property
    def months_typical(self) -> float:
        return (self.months_min + self.months_max) / 2


PRODUCTS: Dict[str, Product] = {
    "wax": Product("wax", "Carnauba wax", 1, 2, 2, "warm, deep gloss", False,
                   "Easy to reapply and the cheapest per visit, but heat strips it quickly."),
    "sealant": Product("sealant", "Paint sealant", 3, 6, 3, "sharp, reflective gloss", False,
                       "Synthetic polymer: lasts several times longer than wax and handles heat better."),
    "ceramic": Product("ceramic", "Ceramic coating", 12, 24, 5, "hard, glassy gloss", True,
                       "Best UV and chemical resistance. Paint should be polished and decontaminated first."),
}


def _product(pid: str) -> Product:
    try:
        return PRODUCTS[pid.lower()]
    except KeyError:
        raise ValueError("unknown product %r, choose from %s" % (pid, ", ".join(PRODUCTS))) from None


def applications_per_year(pid: str, harsh: bool = False) -> float:
    """How many applications keep paint continuously protected. `harsh` (outdoor parking
    all day) uses the short end of the durability range, otherwise the typical value."""
    p = _product(pid)
    months = p.months_min if harsh else p.months_typical
    return round(12 / months, 2)


def cost_per_year(pid: str, price_per_application: float, harsh: bool = False) -> float:
    """Yearly cost to stay protected, given what one application costs you (any currency)."""
    if price_per_application < 0:
        raise ValueError("price must not be negative")
    return round(applications_per_year(pid, harsh) * price_per_application, 2)


def _add_months(d: date, months: int) -> date:
    idx = d.month - 1 + months
    year, month = d.year + idx // 12, idx % 12 + 1
    return date(year, month, min(d.day, calendar.monthrange(year, month)[1]))


def due_date(pid: str, applied: date, harsh: bool = False) -> date:
    """Date the protection should be renewed."""
    p = _product(pid)
    months = p.months_min if harsh else int(round(p.months_typical))
    return _add_months(applied, months)


def reminder_dates(pid: str, applied: date, harsh: bool = False, count: int = 4) -> List[date]:
    """The next `count` renewal dates, one durability period apart."""
    if count < 1:
        raise ValueError("count must be at least 1")
    p = _product(pid)
    months = p.months_min if harsh else int(round(p.months_typical))
    return [_add_months(applied, months * (i + 1)) for i in range(count)]


def polish_advice(swirl_marks: bool = False, oxidation: bool = False,
                  water_spots: bool = False, scratches_catch_nail: bool = False) -> str:
    """Whether machine polishing should come before any protection."""
    if scratches_catch_nail:
        return ("Deep scratches (a fingernail catches): polishing will only soften them. "
                "Have a professional assess, and polish the surrounding paint before protecting.")
    problems = [n for n, flag in (("swirl marks", swirl_marks), ("oxidation", oxidation),
                                   ("water spots", water_spots)) if flag]
    if problems:
        return "Polish first (" + ", ".join(problems) + "), then apply protection so it bonds to clean paint."
    return "Paint looks healthy: wash, decontaminate and apply protection; polishing is not needed yet."


def choose(parking: str = "outdoor", keep_years: float = 3, polished_recently: bool = False,
           diy_budget: bool = False) -> Dict[str, object]:
    """Pick a protection. Returns {'product', 'reasons', 'ranking'}."""
    parking = parking.lower()
    if parking not in ("outdoor", "covered", "garage"):
        raise ValueError("parking must be outdoor, covered or garage")
    if keep_years <= 0:
        raise ValueError("keep_years must be positive")
    reasons: List[str] = []
    scores = {"wax": 0.0, "sealant": 0.0, "ceramic": 0.0}

    if parking == "outdoor":
        scores["ceramic"] += 3
        scores["sealant"] += 2
        reasons.append("Outdoor parking means all-day UV and dust: favour the longest-lasting protection.")
    elif parking == "covered":
        scores["sealant"] += 3
        scores["ceramic"] += 1.5
        scores["wax"] += 1
        reasons.append("Covered parking cuts UV exposure; a sealant is the balanced choice.")
    else:
        scores["wax"] += 2.5
        scores["sealant"] += 2
        reasons.append("Garage parking keeps paint out of the sun, so wax lasts closer to its upper range.")

    if keep_years >= 3:
        scores["ceramic"] += 2
        reasons.append("Keeping the car 3+ years spreads the cost of a ceramic coating.")
    elif keep_years < 1.5:
        scores["wax"] += 2
        scores["sealant"] += 1
        reasons.append("Under 18 months of ownership rarely repays a coating.")

    if diy_budget:
        scores["wax"] += 2
        scores["ceramic"] -= 3
        reasons.append("A tight budget favours products that are cheap per application.")
    if not polished_recently:
        scores["ceramic"] -= 1
        reasons.append("Ceramic needs freshly polished paint; budget for polishing first if you choose it.")

    ranking = sorted(scores, key=lambda k: (-scores[k], k))
    return {"product": PRODUCTS[ranking[0]], "reasons": reasons, "ranking": ranking}
