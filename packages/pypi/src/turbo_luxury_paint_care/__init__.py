"""Paint protection chooser and scheduler for cars in hot, dusty climates."""

from .core import (
    PRODUCTS,
    Product,
    applications_per_year,
    choose,
    cost_per_year,
    due_date,
    polish_advice,
    reminder_dates,
)

__all__ = [
    "PRODUCTS",
    "Product",
    "applications_per_year",
    "choose",
    "cost_per_year",
    "due_date",
    "polish_advice",
    "reminder_dates",
]
__version__ = "1.0.0"
