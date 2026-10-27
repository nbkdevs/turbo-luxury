/// Vehicle size classes. Bigger vehicles take longer.
enum VehicleSize {
  compact(0.85),
  sedan(1.0),
  suv(1.25),
  large(1.5);

  const VehicleSize(this.timeFactor);

  /// Multiplier applied to base step durations.
  final double timeFactor;
}

/// How dirty the car is when the detailer arrives.
enum Condition {
  light(0.85),
  normal(1.0),
  heavy(1.4);

  const Condition(this.timeFactor);
  final double timeFactor;
}

/// A detailing service step.
enum Service {
  wheels('Wheels and tyres', 15, 1,
      'Clean first so brake dust and tyre dressing do not splash onto clean paint.'),
  exteriorWash('Exterior wash', 25, 2,
      'Removes dust and loose dirt before any contact with the paint.'),
  clayBar('Clay bar decontamination', 25, 3,
      'Lifts bonded fallout so polish and protection work on bare paint.'),
  polish('Machine polish', 90, 4,
      'Removes swirls, light scratches and oxidation. Done after the wash and clay.'),
  waxOrSealant('Wax or sealant', 25, 5,
      'Protects freshly polished paint from UV and dust. Last exterior step.'),
  headlightPolish('Front light polishing', 30, 6,
      'Restores hazy headlight lenses for night visibility.'),
  engineBay('Engine bay cleaning', 25, 7,
      'Removes dust and grease build-up; keep it away from wet electrics.'),
  interiorVacuum('Interior vacuum', 20, 8,
      'Dry soil comes out before any wet cleaning starts.'),
  seatDeepClean('Seat deep cleaning', 45, 9,
      'Extracts embedded dirt and stains from fabric or leather.'),
  interiorRestoration('Interior restoration', 40, 10,
      'Treats plastics, trim and leather so they look and feel renewed.'),
  acSanitization('AC sanitization', 20, 11,
      'Cleans the vents and cabin air path to remove musty smells.'),
  windowsAndFinish('Windows and finishing', 15, 12,
      'Streak-free glass last, then a final walk-around.');

  const Service(this.label, this.baseMinutes, this.order, this.purpose);

  final String label;

  /// Minutes for a normal sedan in normal condition.
  final int baseMinutes;

  /// Position in the correct working order.
  final int order;

  /// Why the step exists.
  final String purpose;
}

/// The services included in the Detailing Shine package.
const List<Service> detailingShineServices = [
  Service.wheels,
  Service.exteriorWash,
  Service.headlightPolish,
  Service.interiorVacuum,
  Service.seatDeepClean,
  Service.interiorRestoration,
  Service.acSanitization,
  Service.windowsAndFinish,
];

/// One line of a plan.
class PlanStep {
  const PlanStep(this.service, this.minutes);

  final Service service;
  final int minutes;

  @override
  String toString() => '${service.label} ($minutes min)';
}

/// A complete plan.
class DetailingPlan {
  const DetailingPlan(this.steps, this.size, this.condition);

  final List<PlanStep> steps;
  final VehicleSize size;
  final Condition condition;

  /// Total working time in minutes.
  int get totalMinutes => steps.fold(0, (sum, s) => sum + s.minutes);

  /// Total as hours and minutes, e.g. `3 h 10 min`.
  String get totalLabel {
    final h = totalMinutes ~/ 60;
    final m = totalMinutes % 60;
    if (h == 0) return '$m min';
    if (m == 0) return '$h h';
    return '$h h $m min';
  }

  /// Plain-text checklist in working order.
  String checklist() {
    final b = StringBuffer(
        'Detailing plan (${size.name}, ${condition.name} condition)\n');
    for (var i = 0; i < steps.length; i++) {
      b.writeln(
          '[ ] ${i + 1}. ${steps[i].service.label} - ${steps[i].minutes} min');
      b.writeln('      ${steps[i].service.purpose}');
    }
    b.write('Total: $totalLabel');
    return b.toString();
  }
}

/// Build a plan. Steps are de-duplicated and sorted into working order.
/// Polishing automatically adds the wash and clay bar it depends on, and
/// wax or sealant is added after a polish if missing.
DetailingPlan planDetailing(
  Iterable<Service> services, {
  VehicleSize size = VehicleSize.sedan,
  Condition condition = Condition.normal,
}) {
  final set = services.toSet();
  if (set.isEmpty) {
    throw ArgumentError.value(
        services, 'services', 'choose at least one service');
  }
  if (set.contains(Service.polish)) {
    set
      ..add(Service.exteriorWash)
      ..add(Service.clayBar)
      ..add(Service.waxOrSealant);
  }
  if (set.contains(Service.clayBar)) set.add(Service.exteriorWash);
  final ordered = set.toList()..sort((a, b) => a.order.compareTo(b.order));
  final factor = size.timeFactor * condition.timeFactor;
  return DetailingPlan(
    [for (final s in ordered) PlanStep(s, _roundTo5(s.baseMinutes * factor))],
    size,
    condition,
  );
}

int _roundTo5(double minutes) => (minutes / 5).round().clamp(1, 100000) * 5;

/// Suggest services from what the owner sees.
List<Service> suggestServices({
  bool dullPaint = false,
  bool roughPaintAfterWash = false,
  bool swirlMarks = false,
  bool stainedSeats = false,
  bool mustySmell = false,
  bool hazyHeadlights = false,
  bool dustyEngineBay = false,
  bool wornInterior = false,
}) {
  final out = <Service>{
    Service.wheels,
    Service.exteriorWash,
    Service.interiorVacuum,
    Service.windowsAndFinish
  };
  if (roughPaintAfterWash) out.add(Service.clayBar);
  if (swirlMarks || dullPaint) out.add(Service.polish);
  if (stainedSeats) out.add(Service.seatDeepClean);
  if (mustySmell) out.add(Service.acSanitization);
  if (hazyHeadlights) out.add(Service.headlightPolish);
  if (dustyEngineBay) out.add(Service.engineBay);
  if (wornInterior) out.add(Service.interiorRestoration);
  final list = out.toList()..sort((a, b) => a.order.compareTo(b.order));
  return list;
}
