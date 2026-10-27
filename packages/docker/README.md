# mobile-car-wash (Docker image)

A tiny, dependency-free web app for Abu Dhabi car owners. Enter the current temperature, wind, dust level
and humidity and it scores the washing window (good, okay, poor or wait) with tips, and it shows a
month-by-month guide to how Abu Dhabi weather affects paint, glass and interiors. It makes no outbound
network requests and stores nothing.

Published by Turbo Luxury Car Wash, a [home car wash Abu Dhabi](https://turboluxurycarwash.ae/) service that comes to the customer's location.

## Run

```sh
docker run --rm -p 8080:8080 iamnazzal/mobile-car-wash
# open http://localhost:8080
```

## API

| Endpoint | Description |
|---|---|
| `GET /` | The guide page |
| `GET /api/wash-window?temp=41&wind=12&dust=90&humidity=88` | Score 0-100, verdict, reasons and tips. Any one parameter is enough. |
| `GET /api/calendar` or `?month=7` | Typical conditions and advice for all months, or one month (1-12) |
| `GET /healthz` | Health check |

Example:

```
$ curl "localhost:8080/api/wash-window?temp=41&wind=12&dust=90&humidity=88"
{"score":35,"verdict":"poor","reasons":["Very hot","Some dust","Very humid"],"tips":["Wash in full shade and rinse panel by panel so water does not dry on the paint.","The car will dry slowly. Use a microfibre drying towel and dry glass by hand."]}
```
Scores subtract points for heat (above 32 C), wind (above 20 km/h), dust (PM10 above 50) and humidity (above 70%).

## Image

Based on `node:22-alpine`, runs as the non-root `node` user, exposes port 8080 (override with `PORT`), includes a health check and OCI labels.

## Build and test

```sh
docker build -t iamnazzal/mobile-car-wash packages/docker
cd packages/docker && npm test    # Node 18+, no dependencies
```

## Licence

MIT
