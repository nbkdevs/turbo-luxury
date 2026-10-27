# Turbo Luxury: car care tools for Abu Dhabi

Small, free, open-source tools for car owners in the UAE, published by the team behind [mobile car wash Abu Dhabi](https://turboluxurycarwash.ae/) service Turbo Luxury Car Wash. Prices and packages in the examples come from the public price list: Quick Shine 60-70 AED, Golden 100-120 AED, Diamond 150-170 AED, Detailing 300 AED. Booking is by WhatsApp or phone on +971 56 989 2095.

Every tool works on its own and does something different. None of them needs the website, and the browser extensions and themes contain no link to it.

## What is in this repository

| Folder | What it does |
|---|---|
| [`packages/npm`](packages/npm) | Wash package and interval planner for a car profile (CLI and library). |
| [`packages/pypi`](packages/pypi) | Chooses wax, sealant or ceramic coating and gives renewal dates and cost. |
| [`composer.json`](composer.json), [`packages/packagist`](packages/packagist) | PHP builder for WhatsApp booking messages, with UAE phone validation. |
| [`packages/crates`](packages/crates) | Rust estimator of how hot a parked car gets. |
| [`packages/pub`](packages/pub) | Dart detailing job planner. |
| [`packages/nuget`](packages/nuget) | .NET estimator of the water used per wash. |
| [`packages/rubygems`](packages/rubygems) | Interior stain first-aid by stain and surface, with a CLI. |
| [`packages/docker`](packages/docker) | Small service that scores wash windows, with a guide page. |
| [`packages/smithery`](packages/smithery) | MCP server exposing the package picker, wash-window check and care tips to AI assistants. |
| [`packages/huggingface-space`](packages/huggingface-space) | Static page that suggests a package. |
| [`skills`](skills) | Three agent skills (SKILL.md) for car-care planning. |
| [`themes`](themes) | Three Chrome themes: Abu Dhabi Dusk, Fresh Foam, Midnight Detail. |
| [`extensions`](extensions) | Three Firefox and Edge extensions: Wash Day Weather, Car Care Service Log, Fuel Economy Log. |
| [`directory-kits`](directory-kits) | Copy and images for manual directory listings. |
| [`turbo_luxury_app`](turbo_luxury_app) | The existing Flutter app. |

See [`packages/README.md`](packages/README.md) for the full link map and test commands, [`STATUS.md`](STATUS.md) for what has been published, and [`PRIVACY.md`](PRIVACY.md) for data handling.

## Tests

```
(cd packages/npm && npm test)
(cd packages/pypi && pip install -e . pytest && pytest)
composer install && vendor/bin/phpunit -c packages/packagist/phpunit.xml
(cd packages/crates && cargo test)
(cd packages/pub && dart pub get && dart test)
(cd packages/nuget && dotnet test tests)
(cd packages/rubygems && ruby -Ilib -Itest test/stain_guide_test.rb)
(cd packages/docker && npm test)
(cd packages/smithery && npm ci && npm test)
(cd packages/huggingface-space && node --test test/)
(cd extensions && node --test */test/ && python3 _tools/test_extensions.py)
python3 -m unittest discover -s themes/_tools
```

## Licence

MIT, see [LICENSE](LICENSE).
