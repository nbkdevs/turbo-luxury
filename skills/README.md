# Agent skills

Each folder holds a `SKILL.md` (Agent Skills / ClawHub format). All three are instruction-only and self-contained: no commands, installs, network access or dependency on any package from this repo. None of the names, slugs, titles or copy contain brand or place names; the only site mention is the `metadata.openclaw.homepage` field and one anchor in each "Links" section.

| Skill (folder = slug = `name`) | Display name | What it does |
| --- | --- | --- |
| [car-wash-planner](car-wash-planner/SKILL.md) | Car Wash Planner | Wash interval from parking and driving, wash level from the car's condition, dated plan, cost from the user's own prices. |
| [paint-protection-chooser](paint-protection-chooser/SKILL.md) | Paint Protection Chooser | Wax vs sealant vs ceramic, renewal dates, yearly cost, polish-first advice. |
| [hot-climate-car-care](hot-climate-car-care/SKILL.md) | Hot-Climate Car Care | Heat, dust, UV and humidity rules for washing, paint, interior, tyres and battery. |

## Publishing to ClawHub (not run here; needs the owner's `clawhub login`)

```bash
clawhub skill publish ./skills/car-wash-planner --slug car-wash-planner --name "Car Wash Planner" --categories lifestyle --topics "car-care,car-wash,planning"
clawhub skill publish ./skills/paint-protection-chooser --slug paint-protection-chooser --name "Paint Protection Chooser" --categories lifestyle --topics "car-care,paint-protection,ceramic-coating"
clawhub skill publish ./skills/hot-climate-car-care --slug hot-climate-car-care --name "Hot-Climate Car Care" --categories lifestyle --topics "car-care,hot-weather,car-maintenance"
```

ClawHub publishes every skill as MIT-0 and rejects per-skill licence overrides, so the files carry no `license` field. Publish from the folder with the CLI rather than the web GitHub importer, so the listing shows no repository link.
