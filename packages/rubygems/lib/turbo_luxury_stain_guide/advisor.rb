module TurboLuxuryStainGuide
  # Combines the stain data with surface-specific notes.
  module Advisor
    Advice = Struct.new(:stain, :stain_name, :surface, :surface_name, :urgency, :supplies, :steps, :avoid,
                        :surface_note, :professional, keyword_init: true) do
      def to_s
        lines = ["#{stain_name} on #{surface_name.downcase} (act #{urgency_phrase})", ""]
        lines << "You need: #{supplies.join(', ')}"
        lines << ""
        steps.each_with_index { |s, i| lines << "#{i + 1}. #{s}" }
        lines << "Note for #{surface}: #{surface_note}" if surface_note
        lines << ""
        avoid.each { |a| lines << "Avoid: #{a}" }
        lines << "If it is old, large or the colour is lifting from the seat itself, a professional clean is the safe choice." if professional
        lines.join("\n")
      end

      private

      def urgency_phrase
        { "high" => "straight away", "medium" => "within the hour", "low" => "when dry" }.fetch(urgency, urgency)
      end
    end

    module_function

    def resolve(aliases, table, name)
      key = name.to_s.strip.downcase
      return key if table.key?(key)
      aliases[key]
    end

    def advise(stain, surface)
      stain_id = TurboLuxuryStainGuide.resolve_stain(stain)
      raise TurboLuxuryStainGuide::Error, "Unknown stain #{stain.inspect}. Try: #{Data::STAINS.keys.join(', ')}" unless stain_id
      surface_id = TurboLuxuryStainGuide.resolve_surface(surface)
      raise TurboLuxuryStainGuide::Error, "Unknown surface #{surface.inspect}. Try: #{Data::SURFACES.keys.join(', ')}" unless surface_id
      s = Data::STAINS.fetch(stain_id)
      Advice.new(
        stain: stain_id, stain_name: s[:name], surface: surface_id, surface_name: Data::SURFACES.fetch(surface_id),
        urgency: s[:urgency], supplies: s[:supplies], steps: s[:steps], avoid: s[:avoid],
        surface_note: s[:surface_notes][surface_id], professional: s[:professional]
      )
    end
  end
end
