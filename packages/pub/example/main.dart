import 'package:turbo_luxury_detailing/turbo_luxury_detailing.dart';

void main() {
  final services = suggestServices(
      swirlMarks: true, stainedSeats: true, hazyHeadlights: true);
  final plan = planDetailing(services,
      size: VehicleSize.suv, condition: Condition.heavy);
  print(plan.checklist());
}
