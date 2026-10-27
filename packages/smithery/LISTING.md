# Smithery and npm listing: turbo-luxury-mcp

| Field | Value |
|---|---|
| Registries | npm (package), Smithery (server listing, from this GitHub folder) |
| npm name | `turbo-luxury-mcp` (checked free via registry.npmjs.org on 2026-10-27, 404) |
| Smithery | Add from GitHub repo `nbkdevs/turbo-luxury`, base directory `packages/smithery` (uses `smithery.yaml`: container runtime, HTTP at `/mcp`) |
| Version | 1.0.0 |
| Licence | MIT |
| Homepage | https://turboluxurycarwash.ae/ |
| Repository | https://github.com/nbkdevs/turbo-luxury/tree/main/packages/smithery |
| Anchor used | [mobile car wash Abu Dhabi](https://turboluxurycarwash.ae/) (README intro) |

**Display name:** Turbo Luxury Car Wash (Abu Dhabi)

**Short description:** Mobile car wash packages, recommendations, wash-window check, monthly tips and a WhatsApp booking link for Abu Dhabi.

**Tools:** `list_packages`, `recommend_package`, `wash_window_check`, `monthly_care_tip`, `booking_link`. All read-only, no network access, no auth, no config.

**Publish (not run):** `cd packages/smithery && npm publish` (needs npm login), then add the server on smithery.ai (needs GitHub login).

**Tested here:** unit tests plus end-to-end MCP client tests over stdio and Streamable HTTP (3 tests). The Dockerfile was not built (no Docker on the box).
