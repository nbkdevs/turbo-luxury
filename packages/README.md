# Packages: link map and commands

Every package is useful on its own and none depends on another. Each has a README, a `LISTING.md` (registry fields, publish command that was **not** run, what was tested) and its tests.

| Folder | Registry / name | Function | Anchor → page |
|---|---|---|---|
| [npm](npm) | npm `turbo-luxury-wash-advisor` | wash package and interval planner (CLI + library) | mobile car wash Abu Dhabi → homepage |
| [pypi](pypi) | PyPI `turbo-luxury-paint-care` | wax / sealant / ceramic chooser | car polishing Abu Dhabi → /services/car-polishing-abu-dhabi/ |
| [../composer.json](../composer.json), [packagist](packagist) | Packagist `turboluxury/whatsapp-booking` | WhatsApp booking message builder | mobile car wash Abu Dhabi → homepage (root README) |
| [crates](crates) | crates.io `turbo-luxury-cabin-heat` | cabin heat estimator | car wash at home Abu Dhabi → homepage |
| [pub](pub) | pub.dev `turbo_luxury_detailing` | detailing job planner | car detailing Abu Dhabi → /services/car-detailing-abu-dhabi/ |
| [nuget](nuget) | NuGet `TurboLuxury.WaterSaver` | water-per-wash estimator | home car wash Abu Dhabi → homepage |
| [rubygems](rubygems) | RubyGems `turbo_luxury_stain_guide` | interior stain guide + CLI | car interior cleaning Abu Dhabi → /services/car-interior-cleaning-abu-dhabi/ |
| [docker](docker) | Docker Hub `iamnazzal/mobile-car-wash` | wash-window API and guide page | home car wash Abu Dhabi → homepage |
| [smithery](smithery) | npm `turbo-luxury-mcp` + Smithery | MCP server | mobile car wash Abu Dhabi → homepage |
| [huggingface-space](huggingface-space) | HF Space `iamnazzal/mobile-car-wash-picker` | static package picker | home car wash Abu Dhabi → homepage |

Agent skills for ClawHub are in [../skills](../skills) (same layout as the reference repo, not `packages/clawhub`).

## Run the tests
```
(cd packages/npm && npm test)
(cd packages/pypi && pip install -e . pytest && pytest)
composer install && vendor/bin/phpunit -c packages/packagist/phpunit.xml
(cd packages/crates && cargo test)
(cd packages/pub && dart pub get && dart test)
(cd packages/nuget && dotnet test tests/*)
(cd packages/rubygems && ruby -Ilib -Itest -e 'Dir["test/*_test.rb"].each { |f| require "./#{f}" }')
(cd packages/docker && npm test)
(cd packages/smithery && npm ci && npm test)
(cd packages/huggingface-space && node --test test/)
```
