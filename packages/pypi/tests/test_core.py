import io
from datetime import date

import pytest

from turbo_luxury_paint_care import PRODUCTS, applications_per_year, choose, cost_per_year, due_date, polish_advice, reminder_dates
from turbo_luxury_paint_care.cli import main


def run(*args):
    buf = io.StringIO()
    code = main(list(args), out=buf)
    return code, buf.getvalue()


def test_products_durability_order():
    assert PRODUCTS["wax"].months_max < PRODUCTS["sealant"].months_min
    assert PRODUCTS["sealant"].months_max < PRODUCTS["ceramic"].months_min
    assert PRODUCTS["ceramic"].needs_polish_first and not PRODUCTS["wax"].needs_polish_first


def test_applications_and_cost():
    assert applications_per_year("wax") == 8.0  # 12 / 1.5
    assert applications_per_year("wax", harsh=True) == 12.0
    assert applications_per_year("ceramic") == 0.67
    assert cost_per_year("wax", 110, harsh=True) == 1320.0


def test_due_date_and_month_end():
    assert due_date("sealant", date(2026, 8, 31), harsh=True) == date(2026, 11, 30)
    assert due_date("ceramic", date(2026, 1, 15)) == date(2027, 7, 15)  # 18 months typical


def test_reminders_are_evenly_spaced():
    r = reminder_dates("sealant", date(2026, 1, 10), harsh=True, count=3)
    assert r == [date(2026, 4, 10), date(2026, 7, 10), date(2026, 10, 10)]
    with pytest.raises(ValueError):
        reminder_dates("wax", date(2026, 1, 1), count=0)


def test_choose_by_parking_and_ownership():
    assert choose("outdoor", 4, polished_recently=True)["product"].id == "ceramic"
    assert choose("garage", 1)["product"].id == "wax"
    assert choose("covered", 2)["product"].id == "sealant"
    r = choose("outdoor", 3, polished_recently=False, diy_budget=True)
    assert r["product"].id in ("sealant", "wax")
    assert len(r["ranking"]) == 3


def test_validation():
    with pytest.raises(ValueError):
        choose("street")
    with pytest.raises(ValueError):
        choose(keep_years=0)
    with pytest.raises(ValueError):
        applications_per_year("glaze")
    with pytest.raises(ValueError):
        cost_per_year("wax", -1)


def test_polish_advice():
    assert "not needed" in polish_advice()
    assert "swirl marks, oxidation" in polish_advice(swirl_marks=True, oxidation=True)
    assert "fingernail" in polish_advice(scratches_catch_nail=True)


def test_cli():
    code, out = run("choose", "--parking", "outdoor", "--keep-years", "4", "--polished-recently")
    assert code == 0 and "Recommended: Ceramic coating" in out
    code, out = run("due", "--product", "sealant", "--applied", "2026-01-10", "--harsh", "--count", "2")
    assert out.split() == ["2026-04-10", "2026-07-10"]
    code, out = run("cost", "--product", "wax", "--price", "110", "--harsh")
    assert "1320.00 per year" in out
    assert run("products")[0] == 0
    assert run("polish", "--swirls")[1].startswith("Polish first")
    assert run()[0] == 1
    assert run("due", "--product", "wax", "--applied", "nope")[0] == 2
