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
| [`themes`](themes) | Three Chrome themes: Desert Dusk (the one to publish), Fresh Foam and Midnight Detail (dropped). |
| [`extensions`](extensions) | Three Firefox and Edge extensions: Wash Day Weather (the one to publish), Car Care Service Log and Fuel Economy Log (dropped). |
| [`directory-kits`](directory-kits) | Copy and images for manual directory listings. |
| [`turbo_luxury_app`](turbo_luxury_app) | The existing Flutter app. |

See [`packages/README.md`](packages/README.md) for the full link map and test commands, [`STATUS.md`](STATUS.md) for what has been published, and [`PRIVACY.md`](PRIVACY.md) for data handling.

## Find the tools elsewhere

The tools in this repository are also published on the usual package registries and app stores, so you can install them with whatever your project already uses.

### Packages

- [npm: turbo-luxury-wash-advisor](https://www.npmjs.com/package/turbo-luxury-wash-advisor): wash package and interval planner.
- [PyPI: turbo-luxury-paint-care](https://pypi.org/project/turbo-luxury-paint-care/): wax, sealant or ceramic coating chooser.
- [Packagist: turboluxury/whatsapp-booking](https://packagist.org/packages/turboluxury/whatsapp-booking): PHP builder for WhatsApp booking messages.
- [crates.io: turbo-luxury-cabin-heat](https://crates.io/crates/turbo-luxury-cabin-heat): Rust parked-car heat estimator.
- [pub.dev: turbo_luxury_detailing](https://pub.dev/packages/turbo_luxury_detailing): Dart detailing job planner.
- [NuGet: TurboLuxury.WaterSaver](https://www.nuget.org/packages/TurboLuxury.WaterSaver/1.0.0): .NET water-per-wash estimator.
- [RubyGems: turbo_luxury_stain_guide](https://rubygems.org/gems/turbo_luxury_stain_guide): interior stain first-aid, with a CLI.
- [Docker Hub: iamnazzal/mobile-car-wash](https://hub.docker.com/r/iamnazzal/mobile-car-wash): the wash-window scoring service as a container image.
- [npm: turbo-luxury-mcp](https://www.npmjs.com/package/turbo-luxury-mcp): MCP server so AI assistants can use the planners.

### Demos and apps

- [Hugging Face Space: turboluxurycarwash](https://huggingface.co/spaces/usus1223/turboluxurycarwash): a browser demo.
- [Hugging Face Space: mobile-car-wash-picker](https://huggingface.co/spaces/iamnazzal/mobile-car-wash-picker): a small page that suggests which package to use.
- Turbo Luxury on the Amazon Appstore: [US](https://www.amazon.com/gp/product/B0HL8FDQLD), [UK](https://www.amazon.co.uk/gp/product/B0HL8FDQLD), [Germany](https://www.amazon.de/gp/product/B0HL8FDQLD), [Italy](https://www.amazon.it/gp/product/B0HL8FDQLD), [France](https://www.amazon.fr/gp/product/B0HL8FDQLD), [Spain](https://www.amazon.es/gp/product/B0HL8FDQLD), [Japan](https://www.amazon.co.jp/gp/product/B0HL8FDQLD), [Canada](https://www.amazon.ca/gp/product/B0HL8FDQLD), [Brazil](https://www.amazon.com.br/gp/product/B0HL8FDQLD), [Mexico](https://www.amazon.com.mx/gp/product/B0HL8FDQLD), [Australia](https://www.amazon.com.au/gp/product/B0HL8FDQLD).

### Directories and downloads

- [Product Hunt: Turbo Luxury Car Wash](https://www.producthunt.com/products/turbo-luxury-car-wash)
- [Design Nominees: Turbo Luxury Car Wash](https://www.designnominees.com/sites/turbo-luxury-car-wash)
- [SourceForge: Abu Dhabi Car Care Guide](https://sourceforge.net/projects/abu-dhabi-car-care-guide/): downloads and project page.

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
