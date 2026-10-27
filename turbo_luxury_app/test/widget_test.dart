import 'package:carwash/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('home shows brand and booking CTA', (tester) async {
    await tester.pumpWidget(const TurboLuxuryApp(showSplash: false));

    expect(find.textContaining('Mobile car wash'), findsOneWidget);
    expect(find.text('Book on WhatsApp'), findsOneWidget);
    expect(find.text('Home'), findsOneWidget);
  });

  testWidgets('services tab lists packages', (tester) async {
    await tester.pumpWidget(const TurboLuxuryApp(showSplash: false));

    await tester.tap(find.byIcon(Icons.auto_awesome_outlined));
    await tester.pumpAndSettle();

    expect(find.text('What we bring to your driveway'), findsOneWidget);
    expect(find.text('Mobile car wash'), findsWidgets);
  });

  testWidgets('book tab shows WhatsApp and call actions', (tester) async {
    await tester.pumpWidget(const TurboLuxuryApp(showSplash: false));

    await tester.tap(find.byIcon(Icons.calendar_month_outlined));
    await tester.pumpAndSettle();

    expect(find.text('Message us'), findsOneWidget);
    expect(find.text('Call the team'), findsOneWidget);
  });
}
