# turbo_luxury_stain_guide

Step-by-step first aid for car interior stains. Give it a stain (coffee, grease, ink, blood or vomit,
pet accident, mud, chocolate, dye transfer) and the surface (fabric, leather, vinyl, plastic, carpet),
and it returns the supplies, the steps in order, what to avoid, how urgent it is and whether the job is
better left to a professional. Pure Ruby, no dependencies, with a command-line tool.

Maintained by Turbo Luxury Car Wash, the team behind [car interior cleaning Abu Dhabi](https://turboluxurycarwash.ae/services/car-interior-cleaning-abu-dhabi/) with mobile service at the customer's location.

## Install

```sh
gem install turbo_luxury_stain_guide
```

## Library

```ruby
require "turbo_luxury_stain_guide"

advice = TurboLuxuryStainGuide.advise("latte", "leather")   # aliases work
advice.urgency        # => "high"
advice.steps          # ordered steps
advice.avoid          # what not to do
advice.surface_note   # leather-specific note
advice.professional   # => false
puts advice
```

Unknown stains or surfaces raise `TurboLuxuryStainGuide::Error` with the valid choices.

## CLI

```sh
turbo-luxury-stain-guide advise coffee leather
turbo-luxury-stain-guide list
```

Example output:

```
Coffee, tea and sugary drinks on leather seat (act straight away)

You need: microfibre cloths, cool water, mild upholstery cleaner

1. Blot (never rub) to lift as much liquid as possible.
2. Dab with a cloth dampened in cool water, working from the edge toward the centre.
3. Apply a mild upholstery cleaner, agitate gently and blot again.
4. Rinse with a barely damp cloth to remove cleaner residue, then dry.
Note for leather: Use a pH-neutral leather cleaner instead of general upholstery cleaner, then condition once dry.

Avoid: Hot water, which can set tannins
Avoid: Rubbing, which spreads the stain into the fibres
```

The advice is general guidance. Always test a cleaner on a hidden spot first, and use a professional
for old, large or colour-lifting stains.

## Tests

```sh
ruby test/stain_guide_test.rb
```

## Licence

MIT
