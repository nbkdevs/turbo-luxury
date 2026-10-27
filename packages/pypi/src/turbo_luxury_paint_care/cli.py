"""Command line interface: turbo-luxury-paint-care."""

from __future__ import annotations

import argparse
import sys
from datetime import date
from typing import List, Optional

from . import core


def _date(s: str) -> date:
    try:
        return date.fromisoformat(s)
    except ValueError:
        raise argparse.ArgumentTypeError("date must be YYYY-MM-DD, got %r" % s)


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="turbo-luxury-paint-care",
                                description="Paint protection chooser and scheduler for hot, dusty climates.")
    sub = p.add_subparsers(dest="cmd")
    sub.add_parser("products", help="list protections and typical UAE durability")
    c = sub.add_parser("choose", help="recommend a protection")
    c.add_argument("--parking", default="outdoor", choices=["outdoor", "covered", "garage"])
    c.add_argument("--keep-years", type=float, default=3)
    c.add_argument("--polished-recently", action="store_true")
    c.add_argument("--tight-budget", action="store_true")
    d = sub.add_parser("due", help="renewal dates for a protection")
    d.add_argument("--product", required=True, choices=list(core.PRODUCTS))
    d.add_argument("--applied", required=True, type=_date)
    d.add_argument("--harsh", action="store_true", help="outdoor parking all day (short end of range)")
    d.add_argument("--count", type=int, default=4)
    k = sub.add_parser("cost", help="yearly cost of staying protected")
    k.add_argument("--product", required=True, choices=list(core.PRODUCTS))
    k.add_argument("--price", required=True, type=float, help="price of one application")
    k.add_argument("--harsh", action="store_true")
    f = sub.add_parser("polish", help="should paint be polished first?")
    f.add_argument("--swirls", action="store_true")
    f.add_argument("--oxidation", action="store_true")
    f.add_argument("--water-spots", action="store_true")
    f.add_argument("--deep-scratches", action="store_true")
    return p


def main(argv: Optional[List[str]] = None, out=None) -> int:
    out = out or sys.stdout
    parser = build_parser()
    try:
        a = parser.parse_args(argv)
    except SystemExit as e:
        return int(e.code or 0)
    if not a.cmd:
        parser.print_help(out)
        return 1
    try:
        if a.cmd == "products":
            for p in core.PRODUCTS.values():
                print("%-16s %2d-%2d months  UV %d/5  %s" % (p.name, p.months_min, p.months_max, p.uv_resistance, p.note), file=out)
        elif a.cmd == "choose":
            r = core.choose(a.parking, a.keep_years, a.polished_recently, a.tight_budget)
            prod = r["product"]
            print("Recommended: %s (%d-%d months in UAE conditions)" % (prod.name, prod.months_min, prod.months_max), file=out)
            print("Ranking: " + " > ".join(r["ranking"]), file=out)
            for line in r["reasons"]:
                print("- " + line, file=out)
        elif a.cmd == "due":
            for d in core.reminder_dates(a.product, a.applied, a.harsh, a.count):
                print(d.isoformat(), file=out)
        elif a.cmd == "cost":
            n = core.applications_per_year(a.product, a.harsh)
            print("%s: %.2f applications a year, %.2f per year" % (core.PRODUCTS[a.product].name, n, core.cost_per_year(a.product, a.price, a.harsh)), file=out)
        elif a.cmd == "polish":
            print(core.polish_advice(a.swirls, a.oxidation, a.water_spots, a.deep_scratches), file=out)
    except ValueError as e:
        print("error: %s" % e, file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
