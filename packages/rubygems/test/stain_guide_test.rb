require "minitest/autorun"
require "open3"
require "rbconfig"
require_relative "../lib/turbo_luxury_stain_guide"

class StainGuideTest < Minitest::Test
  G = TurboLuxuryStainGuide

  def test_lists
    assert_equal %w[coffee grease ink blood pet mud chocolate dye], G.stains
    assert_equal %w[fabric leather vinyl plastic carpet], G.surfaces
  end

  def test_every_stain_has_complete_data
    G::Data::STAINS.each do |id, s|
      assert s[:steps].size >= 3, id
      refute_empty s[:avoid], id
      refute_empty s[:supplies], id
      assert %w[high medium low].include?(s[:urgency]), id
      s[:surface_notes].each_key { |k| assert G::Data::SURFACES.key?(k), "#{id}/#{k}" }
    end
  end

  def test_aliases_resolve_to_known_ids
    G::Data::STAIN_ALIASES.each_value { |v| assert G::Data::STAINS.key?(v), v }
    G::Data::SURFACE_ALIASES.each_value { |v| assert G::Data::SURFACES.key?(v), v }
    assert_equal "coffee", G.resolve_stain("Latte")
    assert_equal "leather", G.resolve_surface("leather")
    assert_equal "vinyl", G.resolve_surface("leatherette")
    assert_nil G.resolve_stain("lava")
  end

  def test_advice_for_coffee_on_leather_uses_surface_note
    a = G.advise("coffee", "leather")
    assert_equal "high", a.urgency
    assert_match(/leather cleaner/, a.surface_note)
    assert_match(/Hot water/, a.avoid.first)
    assert_includes a.to_s, "straight away"
  end

  def test_default_surface_and_no_note
    a = G.advise("tea")
    assert_equal "fabric", a.surface
    assert_nil a.surface_note
  end

  def test_professional_flag_and_text
    assert G.advise("ink", "leather").professional
    assert_match(/professional clean/, G.advise("pet", "fabric").to_s)
    refute G.advise("mud", "carpet").professional
    refute_match(/professional clean/, G.advise("mud", "carpet").to_s)
  end

  def test_errors
    e = assert_raises(G::Error) { G.advise("lava", "fabric") }
    assert_match(/Unknown stain/, e.message)
    assert_raises(G::Error) { G.advise("coffee", "glass") }
  end

  def run_cli(*args)
    exe = File.expand_path("../exe/turbo-luxury-stain-guide", __dir__)
    lib = File.expand_path("../lib", __dir__)
    Open3.capture3(RbConfig.ruby, "-I", lib, exe, *args)
  end

  def test_cli
    out, _err, st = run_cli("advise", "grease", "leather")
    assert st.success?
    assert_match(/Grease, oil, sunscreen/, out)
    out, _err, st = run_cli("list")
    assert_match(/Stains:/, out) && st.success?
    _o, err, st = run_cli("advise", "lava")
    assert_equal 2, st.exitstatus
    assert_match(/Unknown stain/, err)
    assert_equal 1, run_cli[2].exitstatus
  end
end
