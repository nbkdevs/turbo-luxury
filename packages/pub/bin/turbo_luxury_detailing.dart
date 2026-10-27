import 'dart:io';

import 'package:turbo_luxury_detailing/turbo_luxury_detailing.dart';

const _usage = '''turbo_luxury_detailing - plan a car detailing job

Usage:
  turbo_luxury_detailing plan [--size compact|sedan|suv|large] [--condition light|normal|heavy] [service ...]
  turbo_luxury_detailing package     services in the Detailing Shine package (300 AED)
  turbo_luxury_detailing services    list service names
''';

int run(List<String> args, StringSink out, StringSink err) {
  if (args.isEmpty || args.first == '-h' || args.first == '--help') {
    out.write(_usage);
    return args.isEmpty ? 1 : 0;
  }
  switch (args.first) {
    case 'services':
      for (final s in Service.values) {
        out.writeln('${s.name.padRight(20)}${s.label}');
      }
      return 0;
    case 'package':
      out.writeln(planDetailing(detailingShineServices).checklist());
      return 0;
    case 'plan':
      var size = VehicleSize.sedan;
      var condition = Condition.normal;
      final services = <Service>[];
      final rest = args.skip(1).toList();
      for (var i = 0; i < rest.length; i++) {
        final a = rest[i];
        if (a == '--size' || a == '--condition') {
          if (i + 1 >= rest.length) {
            err.writeln('missing value for $a');
            return 2;
          }
          final v = rest[++i];
          if (a == '--size') {
            final m = VehicleSize.values.where((e) => e.name == v);
            if (m.isEmpty) {
              err.writeln('unknown size: $v');
              return 2;
            }
            size = m.first;
          } else {
            final m = Condition.values.where((e) => e.name == v);
            if (m.isEmpty) {
              err.writeln('unknown condition: $v');
              return 2;
            }
            condition = m.first;
          }
        } else {
          final m = Service.values.where((e) => e.name == a);
          if (m.isEmpty) {
            err.writeln('unknown service: $a (see "services")');
            return 2;
          }
          services.add(m.first);
        }
      }
      if (services.isEmpty) {
        err.writeln('give at least one service name');
        return 2;
      }
      out.writeln(planDetailing(services, size: size, condition: condition)
          .checklist());
      return 0;
    default:
      err.writeln('unknown command: ${args.first}');
      err.write(_usage);
      return 2;
  }
}

void main(List<String> args) {
  exitCode = run(args, stdout, stderr);
}
