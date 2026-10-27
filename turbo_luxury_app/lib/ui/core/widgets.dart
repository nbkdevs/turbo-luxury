import 'package:flutter/material.dart';

import 'theme.dart';

class GoldKicker extends StatelessWidget {
  const GoldKicker(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text.toUpperCase(),
      style: const TextStyle(
        color: TlColors.gold,
        fontSize: 12,
        letterSpacing: 2.4,
        fontWeight: FontWeight.w600,
      ),
    );
  }
}

class GoldCard extends StatelessWidget {
  const GoldCard({super.key, required this.child, this.padding});

  final Widget child;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: padding ?? const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: TlColors.ink,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: TlColors.line),
      ),
      child: child,
    );
  }
}

class SectionHeader extends StatelessWidget {
  const SectionHeader({super.key, required this.kicker, required this.title});

  final String kicker;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GoldKicker(kicker),
        const SizedBox(height: 8),
        Text(title, style: Theme.of(context).textTheme.headlineMedium),
      ],
    );
  }
}
