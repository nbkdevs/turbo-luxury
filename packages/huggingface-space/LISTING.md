# Hugging Face Space listing: mobile-car-wash-picker

| Field | Value |
|---|---|
| Registry | Hugging Face Spaces |
| Planned name | `iamnazzal/mobile-car-wash-picker` (huggingface.co/api/spaces/iamnazzal/mobile-car-wash-picker returned 401 on 2026-10-27, which is what HF returns for a missing repo; an existing Space such as iamnazzal/ps2-bios-assistant returns 200. Private repos also give 401, so confirm at creation) |
| SDK | static |
| Licence | MIT |
| Anchor used | [home car wash Abu Dhabi](https://turboluxurycarwash.ae/) (README intro, which is the Space card) |

**Short description (max 60 chars):** Pick the right mobile car wash package and cost in AED

**Upload:** `README.md`, `index.html`, `picker.js`. Not run: needs the owner's HF login.

**Tested here:** `node --test test/` (4 tests); page rendered in headless Chrome (default answers render Quick Shine 60-70 AED).
