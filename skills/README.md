# Agent skills

Each folder holds a `SKILL.md` (Agent Skills format) that lets an AI agent answer car care questions for Abu Dhabi, either by running one of the tools in this repo or from built-in rules.

| Skill | What it does | Uses |
| --- | --- | --- |
| [turbo-luxury-wash-planner](turbo-luxury-wash-planner/SKILL.md) | Package recommendation, wash interval and dated plan with AED cost range. | `npx turbo-luxury-wash-advisor` |
| [turbo-luxury-paint-care](turbo-luxury-paint-care/SKILL.md) | Wax vs sealant vs ceramic, renewal dates, yearly cost, polish-first advice. | `pipx run turbo-luxury-paint-care` |
| [turbo-luxury-uae-car-care](turbo-luxury-uae-car-care/SKILL.md) | Heat, dust and humidity rules for washing, paint and interior, plus how to book. | Instruction only |

Install one with any skills-compatible client, for example `npx skills add https://github.com/nbkdevs/turbo-luxury --skill turbo-luxury-wash-planner`, or copy the folder into your agent's skills directory.

Publishing to ClawHub uses `clawhub publish <folder>` with the owner's login (not run here). Each skill has one link to the website in its Links section.
