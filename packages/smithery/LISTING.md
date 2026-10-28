# Smithery listing (prepared 28 Oct 2026, not published)

The npm package stays `turbo-luxury-mcp` (published 27 Oct 2026, left as is). This file is only about the Smithery server page, which must carry no brand, trademark or place names (Nazzal, 28 Oct 2026).

## Proposed listing

| Field | Value |
|---|---|
| Qualified name | `<namespace>/car-wash-helper` (URL `https://smithery.ai/servers/<namespace>/car-wash-helper`). The namespace is the owner's Smithery namespace, chosen at sign-up or with `smithery namespace create`; it must not be brand-named. `iamnazzal/car-wash-helper` and `nbkdevs/car-wash-helper` both returned 404 (free) from `api.smithery.ai/servers/...` on 28 Oct 2026. |
| Display name | Car Wash Helper |
| Description | Answers everyday car-wash questions: compares wash packages and what they include, recommends the lowest package that covers a car's needs (wax, deep interior, engine bay, stained seats, AC smell, hazy headlights), scores whether the weather suits washing outdoors from temperature, wind, dust and humidity, gives a seasonal care tip for the month, and drafts a booking message the user sends themselves. Read-only, no API keys, no outbound network calls. |
| Homepage field | https://turboluxurycarwash.ae/ (the only site mention) |
| Repository field | leave empty (the repo name contains the brand) |
| Icon | none, or a generic car/water-drop icon |

## How Smithery lists servers now (checked 28 Oct 2026 on smithery.ai/docs)

- Smithery does **not** list from npm. The current publish routes are (1) **URL**: a public HTTPS Streamable HTTP endpoint you host, entered at smithery.ai/new or `smithery mcp publish "https://host/mcp" -n <namespace>/car-wash-helper`; (2) **MCPB bundle** for local stdio: `smithery mcp publish ./server.mcpb -n <namespace>/car-wash-helper`; (3) a hosted JS-module release through the API/CLI. A GitHub repo is not required for any of these. The old GitHub + `smithery.yaml` container flow is no longer in the docs (its page now 404s), so `smithery.yaml`/`Dockerfile` here are probably legacy.
- The qualified name (namespace/slug) and the display name, description, homepage and repository are chosen by the publisher and can be edited later (`PATCH /servers/{qualifiedName}`); they do not come from the npm package name.

## Blocker: the server itself is not brand-free

Smithery scans the server and shows its `serverInfo` name, tool list and tool descriptions on the page. The current code (`src/server.js`, `src/core.js`) would show:

- `serverInfo.name` = `turbo-luxury-mcp`
- tool descriptions with "Abu Dhabi" (`list_packages`, `wash_window_check`, `monthly_care_tip`) and prices in AED
- the client's own package names (Quick Shine, Golden Shine, Diamond Shine, Detailing Shine), the client's phone number in `booking_link`, and "Location: ..., Abu Dhabi." in the booking message

So a brand-free listing is possible for the name, slug and description, but **not with the current build**: the scanned tools would still carry brand and place names. Options (needs Nazzal's decision):

1. Build a neutral variant only for Smithery (MCPB bundle or a hosted URL): server name `car-wash-helper`, generic package tiers (basic / wash and wax / deep clean / full detail) with no prices or with user-supplied prices, location-neutral tool descriptions and tips, and either drop `booking_link` or make it build a message to any number the user gives. The npm package stays as is.
2. Skip Smithery.

Option 1 via URL also needs hosting (none set up). Via MCPB it needs no hosting: build `server.mcpb` from the neutral variant and publish with the CLI after `smithery auth login`.

## Tested here (27 Oct 2026)

Unit tests plus end-to-end MCP client tests over stdio and Streamable HTTP (3 tests) for the npm build. The Dockerfile was not built. No neutral variant has been built yet.
