# turbo-luxury-mcp

A Model Context Protocol (MCP) server that lets an AI assistant answer mobile car wash questions for Abu Dhabi:
what the packages cost and include, which one fits a car's needs, whether the weather suits washing outdoors
right now, what to do this month, and a ready-to-send WhatsApp booking message. It has no outbound network
calls and no credentials.

Run by Turbo Luxury Car Wash, a [mobile car wash Abu Dhabi](https://turboluxurycarwash.ae/) service that comes to the customer's location.

## Tools

| Tool | What it does |
|---|---|
| `list_packages` | The four packages with AED prices and inclusions |
| `recommend_package` | Cheapest package covering the stated needs (wax, deep interior, engine bay, sanitization, stained seats, AC smell, hazy headlights) |
| `wash_window_check` | Scores an outdoor wash 0-100 from temperature, wind, dust and humidity |
| `monthly_care_tip` | Abu Dhabi climate tip for a month (1-12) |
| `booking_link` | Builds a `wa.me` link with a prefilled message. The user sends it; nothing is sent automatically. |

All tools are read-only.

## Use

Claude Desktop, Cursor and other stdio clients:

```json
{ "mcpServers": { "turbo-luxury": { "command": "npx", "args": ["-y", "turbo-luxury-mcp"] } } }
```

Streamable HTTP (set `PORT`; the endpoint is `/mcp`, with `/healthz` for health checks):

```sh
PORT=8081 npx turbo-luxury-mcp
```

## Smithery

`smithery.yaml` and `Dockerfile` are included for Smithery's container runtime (HTTP at `/mcp`).

## Tests

```sh
npm install && npm test
```

The tests call every tool through the official MCP client over both stdio and Streamable HTTP.

## Licence

MIT
