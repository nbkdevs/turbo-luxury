import 'package:test/test.dart';
import 'package:turbo_luxury_detailing/turbo_luxury_detailing.dart';

import '../bin/turbo_luxury_detailing.dart' as cli;

void main() {
  test('steps are sorted into working order and de-duplicated', () {
    final plan = planDetailing([
      Service.windowsAndFinish,
      Service.exteriorWash,
      Service.wheels,
      Service.wheels
    ]);
    expect(plan.steps.map((s) => s.service),
        [Service.wheels, Service.exteriorWash, Service.windowsAndFinish]);
  });

  test('polish pulls in wash, clay bar and protection', () {
    final plan = planDetailing([Service.polish]);
    expect(
      plan.steps.map((s) => s.service),
      [
        Service.exteriorWash,
        Service.clayBar,
        Service.polish,
        Service.waxOrSealant
      ],
    );
  });

  test('time scales with size and condition and rounds to 5 minutes', () {
    final base = planDetailing([Service.exteriorWash]).totalMinutes;
    expect(base, 25);
    expect(
        planDetailing([Service.exteriorWash], size: VehicleSize.suv)
            .totalMinutes,
        30); // 31.25 -> 30
    expect(
        planDetailing([Service.exteriorWash],
                size: VehicleSize.large, condition: Condition.heavy)
            .totalMinutes,
        50); // about 52 -> 50
  });

  test('totalLabel formats hours and minutes', () {
    expect(
        const DetailingPlan([PlanStep(Service.wheels, 45)], VehicleSize.sedan,
                Condition.normal)
            .totalLabel,
        '45 min');
    expect(
        const DetailingPlan([PlanStep(Service.wheels, 120)], VehicleSize.sedan,
                Condition.normal)
            .totalLabel,
        '2 h');
    expect(
        const DetailingPlan([PlanStep(Service.wheels, 190)], VehicleSize.sedan,
                Condition.normal)
            .totalLabel,
        '3 h 10 min');
  });

  test('empty service list is rejected', () {
    expect(() => planDetailing([]), throwsArgumentError);
  });

  test('suggestions follow symptoms', () {
    final base = suggestServices();
    expect(base, [
      Service.wheels,
      Service.exteriorWash,
      Service.interiorVacuum,
      Service.windowsAndFinish
    ]);
    final all = suggestServices(
        swirlMarks: true,
        stainedSeats: true,
        mustySmell: true,
        hazyHeadlights: true,
        dustyEngineBay: true);
    expect(
        all,
        containsAll([
          Service.polish,
          Service.seatDeepClean,
          Service.acSanitization,
          Service.headlightPolish,
          Service.engineBay
        ]));
    expect(all, isNot(contains(Service.clayBar)));
  });

  test('Detailing Shine package matches the published contents', () {
    expect(
        detailingShineServices,
        containsAll([
          Service.seatDeepClean,
          Service.acSanitization,
          Service.interiorRestoration,
          Service.headlightPolish
        ]));
  });

  test('checklist text lists every step and the total', () {
    final text =
        planDetailing([Service.wheels, Service.exteriorWash]).checklist();
    expect(text, contains('[ ] 1. Wheels and tyres - 15 min'));
    expect(text, contains('[ ] 2. Exterior wash - 25 min'));
    expect(text, endsWith('Total: 40 min'));
  });

  group('cli', () {
    String? last;
    int call(List<String> a) {
      final out = StringBuffer();
      final err = StringBuffer();
      final code = cli.run(a, out, err);
      last = out.toString() + err.toString();
      return code;
    }

    test('plan, package, services and errors', () {
      expect(call(['plan', '--size', 'suv', 'polish']), 0);
      expect(last, contains('Machine polish'));
      expect(call(['package']), 0);
      expect(last, contains('AC sanitization'));
      expect(call(['services']), 0);
      expect(call(['plan', 'nope']), 2);
      expect(call(['plan', '--size', 'huge', 'polish']), 2);
      expect(call(['plan']), 2);
      expect(call([]), 1);
      expect(call(['frobnicate']), 2);
    });
  });
}
