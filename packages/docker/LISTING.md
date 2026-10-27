# Docker Hub listing: iamnazzal/mobile-car-wash

| Field | Value |
|---|---|
| Registry | Docker Hub |
| Repository | `iamnazzal/mobile-car-wash` (exists and is empty; checked via hub.docker.com/v2/repositories/iamnazzal/mobile-car-wash/ on 2026-10-27) |
| Tags | `1.0.0`, `latest` |
| Source | https://github.com/nbkdevs/turbo-luxury/tree/main/packages/docker |
| Licence | MIT |
| Anchor used | [home car wash Abu Dhabi](https://turboluxurycarwash.ae/) (README intro, which is the Docker Hub full description) |

**Short description (max 100 chars):** Abu Dhabi car care guide: wash-window checker and monthly calendar. No dependencies.

**Full description:** paste `README.md`.

**Features:** wash window score from temperature, wind, dust and humidity; month-by-month Abu Dhabi calendar; JSON API; single small Node process; non-root; health check; OCI labels.

**Publish (not run, needs Docker and the owner's Docker Hub login):**
```sh
docker build -t iamnazzal/mobile-car-wash:1.0.0 -t iamnazzal/mobile-car-wash:latest packages/docker
docker push iamnazzal/mobile-car-wash:1.0.0 && docker push iamnazzal/mobile-car-wash:latest
```

**Tested here:** `npm test` (5 tests, including the HTTP endpoints) and a live `node server.js` curl. The image itself was **not built**, because the box has no Docker.
