require_relative "turbo_luxury_stain_guide/version"
require_relative "turbo_luxury_stain_guide/data"
require_relative "turbo_luxury_stain_guide/advisor"

# First-aid advice for car interior stains.
module TurboLuxuryStainGuide
  class Error < StandardError; end

  module_function

  # Advice for a stain on a surface. Both are case-insensitive and aliases are accepted.
  def advise(stain, surface = "fabric")
    Advisor.advise(stain, surface)
  end

  # All stain ids.
  def stains
    Data::STAINS.keys
  end

  # All surface ids.
  def surfaces
    Data::SURFACES.keys
  end

  # Resolve an alias ("latte") to a stain id ("coffee"), or nil.
  def resolve_stain(name)
    Advisor.resolve(Data::STAIN_ALIASES, Data::STAINS, name)
  end

  # Resolve an alias ("seat leather") to a surface id, or nil.
  def resolve_surface(name)
    Advisor.resolve(Data::SURFACE_ALIASES, Data::SURFACES, name)
  end
end
