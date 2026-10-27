# Privacy

Draft policy for the tools in this repository. Host it at an HTTPS URL before using it as a store privacy-policy field. Until then the stores can use the business privacy policy at https://turboluxurycarwash.ae/privacy-policy/.

_Last updated: 27 October 2026._

## Summary
None of the tools in this repository collects, sells or shares personal data. There are no accounts, no analytics and no advertising. The only network request any of them makes is described under "Wash Day Weather".

## Chrome themes (Abu Dhabi Dusk, Fresh Foam, Midnight Detail)
Themes are images and colours. They request no permissions and run no code.

## Firefox and Edge extensions
| Extension | Permissions | Data |
|---|---|---|
| Wash Day Weather | `storage` | Stores your chosen city locally. Sends that city's fixed coordinates (not your location, no identifiers) to the Open-Meteo weather API to get a 7-day forecast. Open-Meteo's own policy applies to that request. |
| Car Care Service Log | `storage`, `alarms`, `notifications` | Your service entries, dates and odometer readings stay in local extension storage. The daily reminder is a local notification. CSV export is created on your device. |
| Fuel Economy Log | `storage` | Your fill-up entries stay in local extension storage. CSV export is created on your device. |

Removing an extension deletes its stored data. Nothing is sent to the publisher.

## Packages, skills, Docker image and MCP server
The libraries and command-line tools run entirely on your machine and make no network requests. The Docker image and the MCP server process each request in memory, write nothing to disk and keep no logs of your input. The booking helpers only build a WhatsApp link; they do not send anything.

## Contact
Questions or deletion requests: open an issue at https://github.com/nbkdevs/turbo-luxury/issues. The car wash business can be reached on WhatsApp or phone at +971 56 989 2095; booking details are on the [business site](https://turboluxurycarwash.ae/privacy-policy/).
