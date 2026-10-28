# Smithery listing for turbo-luxury-mcp (prepared 28 Oct 2026, NOT published)

The existing server is listed as is (brand and place names now allowed, Nazzal, 28 Oct 2026). Nothing has been
published, no Smithery account or login was used.

## Proposed listing

| Field | Value |
|---|---|
| Qualified name | `nbkdevs/turbo-luxury-mcp` → `https://smithery.ai/servers/nbkdevs/turbo-luxury-mcp` (fallback `iamnazzal/turbo-luxury-mcp`) |
| Display name | Turbo Luxury Car Wash |
| Short description | Mobile car wash in Abu Dhabi: packages and AED prices, package recommendation, outdoor wash-window score, monthly care tips and a prefilled WhatsApp booking link. |
| Homepage | https://turboluxurycarwash.ae/ |
| Repository | https://github.com/nbkdevs/turbo-luxury |
| License | MIT |
| Icon | none yet (optional: upload the site logo, PNG/SVG/WebP up to 1 MB, under the server's Settings) |
| Config | none (no API keys, no settings) |

Availability check (28 Oct 2026, `GET https://api.smithery.ai/servers/<ns>/<slug>`, no login; an existing
server such as `isdaniel/mcp_weather_server` returns 200): `nbkdevs/turbo-luxury-mcp`, `nbkdevs/turbo-luxury`,
`nbkdevs/mobile-car-wash`, `nbkdevs/turbo-luxury-car-wash` and the same four under `iamnazzal` all returned 404, so
none of these servers exist. Whether the namespace `nbkdevs` or `iamnazzal` itself is free or already owned can only be
seen after login (namespace search/create needs a token).

### Long description

Turbo Luxury Car Wash is a mobile car wash in Abu Dhabi that comes to the customer's home or office. This MCP server
lets an AI assistant answer its customers' everyday questions: it lists the four packages (Quick Shine, Golden Shine,
Diamond Shine and Detailing Shine) with AED prices and what each includes, recommends the cheapest package that
covers a car's needs (wax, deep interior clean, engine bay, sanitization, stained seats, AC smell, hazy headlights),
scores whether the weather suits washing outdoors right now from temperature, wind, dust and humidity, gives a car
care tip for each month of the Abu Dhabi climate, and builds a WhatsApp link with a prefilled booking message that
the user opens and sends themselves. All tools are read-only, with no API keys and no outbound network calls.
Website: https://turboluxurycarwash.ae/

## Tools (as Smithery's scan will show them; text from `src/server.js`)

| Tool | Title | Description | Inputs |
|---|---|---|---|
| `list_packages` | List mobile car wash packages | List the mobile car wash packages in Abu Dhabi with prices in AED and what each includes. | none |
| `recommend_package` | Recommend a package | Recommend the cheapest package that covers the stated needs (wax, deep interior clean, engine bay, sanitization, stained seats, AC smell, hazy headlights). | optional booleans: `wantsWax`, `interiorDirty`, `wantsEngineClean`, `wantsSanitization`, `seatsStained`, `acSmell`, `hazyHeadlights`, `justMaintenance` |
| `wash_window_check` | Is it a good time to wash the car? | Score the current outdoor washing window in Abu Dhabi from temperature (C), wind (km/h), dust PM10 (ug/m3) and humidity (%). Give at least one. | optional numbers: `temp`, `wind`, `dust`, `humidity` |
| `monthly_care_tip` | Car care tip for a month | Get the car care tip for a month in Abu Dhabi climate (1 = January, 12 = December). | `month` (integer 1-12) |
| `booking_link` | WhatsApp booking link | Build a WhatsApp link with a prefilled booking message for a package. The user opens it and sends the message; nothing is sent automatically. | optional: `packageId` (`quick`/`golden`/`diamond`/`detailing`), `area`, `vehicle`, `preferredTime` (strings, max 80) |

All tools carry `readOnlyHint: true, openWorldHint: false`. Server info: `turbo-luxury-mcp` 1.0.0.

## Where the site link shows on the Smithery page

The Homepage field is rendered in the right-hand info column of the server page, as a row labelled **Homepage**
(between Repository and Published / License), showing the bare domain `turboluxurycarwash.ae` with an external-link
icon. On current pages the anchor is `<a href="..." target="_blank" rel="noopener noreferrer">` (no `nofollow`;
checked on smithery.ai/servers/huggingface, 28 Oct 2026). The URL also appears in the long description above and in
the bundle manifest (`homepage`, `author.url`). The API also has a separate `backlinkUrl` field (PATCH
`/servers/{qualifiedName}`); its placement on the page is not documented.

## Publish route (current, checked 28 Oct 2026)

Smithery does not list from npm, and the old GitHub + `smithery.yaml` container flow is gone from the docs
(`smithery.yaml` and `Dockerfile` here are legacy). Routes now: (a) a public Streamable HTTP URL (none hosted), or
(b) an **MCPB bundle** for stdio servers, which fits this server with no hosting. Use (b):

```sh
cd packages/smithery
./mcpb/build.sh                                   # rebuilds dist/turbo-luxury-mcp-1.0.0.mcpb
node mcpb/test-bundle.mjs                         # unpack + stdio smoke test
npx -y @smithery/cli@4.11.1 auth login            # browser sign-in to Smithery (or export SMITHERY_API_KEY=...)
npx -y @smithery/cli@4.11.1 mcp publish ./dist/turbo-luxury-mcp-1.0.0.mcpb -n nbkdevs/turbo-luxury-mcp
```

Then on the server's page (Settings) set display name, description, homepage and repository to the values above if
the publish flow did not take them from the bundle manifest. Same fields via API: `PATCH
https://api.smithery.ai/servers/nbkdevs%2Fturbo-luxury-mcp` with `displayName`, `description`, `homepage`,
`repositoryUrl`. Web alternative: smithery.ai/new (login required).

Auth: publishing needs a Smithery credential, either `smithery auth login` (opens a browser sign-in; in a non-TTY it
prints an `auth_url` to open) or a `SMITHERY_API_KEY` env var (an API key from the Smithery dashboard, so also an
account). There is no anonymous publish.

## Bundle

- `dist/turbo-luxury-mcp-1.0.0.mcpb` (3.7 MB, 2374 files, unsigned), built with `@anthropic-ai/mcpb` 2.1.2 from
  `mcpb/manifest.json` (manifest_version 0.3, `server.type: node`, entry `src/index.js`, Node >= 18) plus
  production `node_modules`. Manifest validation passes.
- Test (28 Oct 2026, Node 20): unpacked the bundle, started `node src/index.js` over stdio with the official MCP
  client: serverInfo `turbo-luxury-mcp` 1.0.0, all 5 tools listed, `recommend_package {wantsWax:true}` → Golden
  Shine 100-120 AED, `monthly_care_tip {month:7}` and `booking_link` return as expected. `npm test` (3 tests, stdio
  and HTTP) passes.
