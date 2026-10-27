require_relative "lib/turbo_luxury_stain_guide/version"

Gem::Specification.new do |spec|
  spec.name = "turbo_luxury_stain_guide"
  spec.version = TurboLuxuryStainGuide::VERSION
  spec.authors = ["Turbo Luxury Car Wash"]
  spec.summary = "Step-by-step first aid for car interior stains by stain type and seat surface."
  spec.description = "Look up how to treat coffee, grease, ink, blood, pet accidents, mud and other stains on fabric, " \
                     "leather, vinyl, plastic or carpet in a car, with supplies, what to avoid and when to call a professional."
  spec.homepage = "https://turboluxurycarwash.ae/services/car-interior-cleaning-abu-dhabi/"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 2.7.0"
  spec.metadata = {
    "homepage_uri" => spec.homepage,
    "source_code_uri" => "https://github.com/nbkdevs/turbo-luxury/tree/main/packages/rubygems",
    "bug_tracker_uri" => "https://github.com/nbkdevs/turbo-luxury/issues",
    "rubygems_mfa_required" => "true"
  }
  spec.files = Dir["lib/**/*.rb", "exe/*", "README.md", "LICENSE"]
  spec.bindir = "exe"
  spec.executables = ["turbo-luxury-stain-guide"]
  spec.require_paths = ["lib"]
end
