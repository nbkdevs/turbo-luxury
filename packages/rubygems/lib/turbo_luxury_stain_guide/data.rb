module TurboLuxuryStainGuide
  module Data
    SURFACES = {
      "fabric" => "Fabric seat or headliner",
      "leather" => "Leather seat",
      "vinyl" => "Vinyl or synthetic leather",
      "plastic" => "Hard plastic trim or dashboard",
      "carpet" => "Carpet or floor mat"
    }.freeze

    SURFACE_ALIASES = {
      "cloth" => "fabric", "upholstery" => "fabric", "seat" => "fabric", "headliner" => "fabric",
      "leatherette" => "vinyl", "pu" => "vinyl", "synthetic" => "vinyl",
      "trim" => "plastic", "dashboard" => "plastic", "dash" => "plastic", "door panel" => "plastic",
      "mat" => "carpet", "floor" => "carpet", "floor mat" => "carpet", "rug" => "carpet"
    }.freeze

    # urgency: how quickly to act. method: base technique; surface_notes: overrides per surface.
    STAINS = {
      "coffee" => {
        name: "Coffee, tea and sugary drinks", urgency: "high",
        supplies: ["microfibre cloths", "cool water", "mild upholstery cleaner"],
        steps: ["Blot (never rub) to lift as much liquid as possible.",
                "Dab with a cloth dampened in cool water, working from the edge toward the centre.",
                "Apply a mild upholstery cleaner, agitate gently and blot again.",
                "Rinse with a barely damp cloth to remove cleaner residue, then dry."],
        avoid: ["Hot water, which can set tannins", "Rubbing, which spreads the stain into the fibres"],
        surface_notes: {
          "leather" => "Use a pH-neutral leather cleaner instead of general upholstery cleaner, then condition once dry.",
          "carpet" => "Blot with a thick pad of paper towel pressed down firmly before cleaning.",
          "plastic" => "Wipe with a damp cloth; sugary residue is sticky, so follow with a dry cloth."
        },
        professional: false
      },
      "grease" => {
        name: "Grease, oil, sunscreen and food fat", urgency: "medium",
        supplies: ["paper towels", "cornstarch or baking soda", "soft brush", "vacuum", "upholstery cleaner"],
        steps: ["Blot off any surface oil without pressing it deeper.",
                "Cover with cornstarch or baking soda and leave for 15 to 30 minutes to absorb the oil.",
                "Vacuum the powder, repeat if the spot is still dark.",
                "Treat what remains with upholstery cleaner and blot dry."],
        avoid: ["Water first: it spreads oil and makes it harder to lift"],
        surface_notes: {
          "leather" => "Wipe gently, absorb with powder, then clean with leather cleaner and condition. Do not scrub.",
          "plastic" => "Wipe with a diluted interior cleaner; sunscreen film on trim usually needs two passes."
        },
        professional: false
      },
      "ink" => {
        name: "Ink and pen marks", urgency: "high",
        supplies: ["isopropyl alcohol", "cotton swabs", "white cloth"],
        steps: ["Test the alcohol on a hidden spot first.",
                "Dab (do not wipe) with a swab dampened with isopropyl alcohol, using a fresh swab as each one picks up ink.",
                "Blot with a clean white cloth after each pass.",
                "Finish with a damp cloth and dry."],
        avoid: ["Wiping across the mark, which spreads ink", "Alcohol on unfinished or aniline leather"],
        surface_notes: {
          "leather" => "Ink on leather often needs a professional, especially on pale or aniline-dyed leather. Try a dedicated leather ink remover only after a hidden-spot test.",
          "vinyl" => "A swab of isopropyl alcohol usually lifts ballpoint ink from vinyl in a few passes."
        },
        professional: true
      },
      "blood" => {
        name: "Blood, vomit, milk and other protein stains", urgency: "high",
        supplies: ["cold water", "microfibre cloths", "enzyme cleaner", "mild soap"],
        steps: ["Blot up solids and liquid first; scrape solids with a card edge.",
                "Dab with cold water only, working inward.",
                "Apply an enzyme cleaner, leave for the time on the label, then blot.",
                "Rinse with a barely damp cloth and dry with the doors open to remove odour."],
        avoid: ["Hot water or steam, which cook proteins into the fibres", "Heavy soaking of seat foam"],
        surface_notes: {
          "leather" => "Wipe with a cloth dampened in cool water and a drop of mild soap, then leather cleaner. Skip enzyme sprays on untreated leather.",
          "carpet" => "Use extra enzyme cleaner and blot repeatedly: carpet padding holds odour."
        },
        professional: false
      },
      "pet" => {
        name: "Pet urine and accidents", urgency: "high",
        supplies: ["paper towels", "enzyme cleaner for pet odour", "microfibre cloths", "fan or open doors"],
        steps: ["Blot as much as possible with paper towels pressed down firmly.",
                "Saturate the area lightly with enzyme cleaner so it reaches the same depth as the accident.",
                "Leave it damp for the label time, then blot and let it air-dry fully with the doors open.",
                "Repeat if the smell returns when the car warms up."],
        avoid: ["Ammonia cleaners, which smell like urine to pets and encourage repeat marking",
                "Steam, which can lock the odour in"],
        surface_notes: {
          "fabric" => "If it soaked into the foam, a professional hot-water extraction is the reliable fix.",
          "leather" => "Clean the surface promptly and check the seams; liquid in the stitching leaves odour."
        },
        professional: true
      },
      "mud" => {
        name: "Mud, sand and dirt", urgency: "low",
        supplies: ["stiff brush", "vacuum", "upholstery cleaner", "microfibre cloths"],
        steps: ["Let wet mud dry completely.",
                "Crumble and brush it off, then vacuum thoroughly.",
                "Treat any shadow left behind with upholstery cleaner and blot dry."],
        avoid: ["Wiping wet mud, which grinds it into the fibres"],
        surface_notes: {
          "leather" => "Vacuum first so grit does not scratch the grain, then wipe with leather cleaner.",
          "carpet" => "Beat or brush the mat outside, then vacuum slowly in two directions."
        },
        professional: false
      },
      "chocolate" => {
        name: "Chocolate, melted sweets and gum", urgency: "medium",
        supplies: ["ice cubes in a bag", "plastic card", "mild soap", "microfibre cloths"],
        steps: ["Harden the residue with an ice bag for a few minutes.",
                "Lift the solid with the edge of a card.",
                "Clean the remaining mark with cool water and a drop of mild soap, then blot dry."],
        avoid: ["Hot water or heat, which melts sugar deeper into the surface"],
        surface_notes: {
          "leather" => "Do not use ice directly on cold-sensitive leather for long; lift the residue gently and finish with leather cleaner."
        },
        professional: false
      },
      "dye" => {
        name: "Red wine, juice, makeup and dye transfer", urgency: "high",
        supplies: ["cool water", "microfibre cloths", "mild upholstery cleaner", "white vinegar (diluted)"],
        steps: ["Blot immediately.",
                "Dab with cool water, then a mild upholstery cleaner.",
                "For fabric, try a half-and-half mix of white vinegar and water on a hidden spot first, then on the stain.",
                "Rinse with a barely damp cloth and dry."],
        avoid: ["Vinegar on leather or natural stone trim", "Letting the stain dry before treating it"],
        surface_notes: {
          "leather" => "Dye transfer from jeans or clothing needs a leather-specific cleaner; stop if colour lifts from the seat itself and call a professional."
        },
        professional: true
      }
    }.freeze

    STAIN_ALIASES = {
      "tea" => "coffee", "latte" => "coffee", "soda" => "coffee", "juice" => "dye", "cola" => "coffee",
      "oil" => "grease", "sunscreen" => "grease", "butter" => "grease", "food" => "grease", "fat" => "grease",
      "pen" => "ink", "marker" => "ink", "ballpoint" => "ink",
      "vomit" => "blood", "milk" => "blood", "protein" => "blood",
      "urine" => "pet", "dog" => "pet", "cat" => "pet", "accident" => "pet",
      "dirt" => "mud", "sand" => "mud",
      "sweets" => "chocolate", "candy" => "chocolate", "gum" => "chocolate",
      "wine" => "dye", "red wine" => "dye", "makeup" => "dye", "denim" => "dye", "lipstick" => "dye"
    }.freeze
  end
end
