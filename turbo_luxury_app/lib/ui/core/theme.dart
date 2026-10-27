import 'package:flutter/material.dart';

class TlColors {
  static const Color black = Color(0xFF0A0A0A);
  static const Color ink = Color(0xFF141414);
  static const Color gold = Color(0xFFC5A059);
  static const Color goldSoft = Color(0xFFD4B57A);
  static const Color muted = Color(0xFFC8C8C8);
  static const Color line = Color(0x33C5A059);
}

ThemeData buildTurboLuxuryTheme() {
  const text = TextTheme(
    displaySmall: TextStyle(
      fontSize: 34,
      fontWeight: FontWeight.w600,
      height: 1.15,
      letterSpacing: -0.4,
      color: Colors.white,
    ),
    headlineMedium: TextStyle(
      fontSize: 24,
      fontWeight: FontWeight.w600,
      height: 1.2,
      color: Colors.white,
    ),
    titleMedium: TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.2,
      color: Colors.white,
    ),
    bodyLarge: TextStyle(fontSize: 16, height: 1.45, color: TlColors.muted),
    bodyMedium: TextStyle(fontSize: 14, height: 1.45, color: TlColors.muted),
    labelLarge: TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.6,
      color: TlColors.black,
    ),
  );

  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: TlColors.black,
    colorScheme: const ColorScheme.dark(
      primary: TlColors.gold,
      onPrimary: TlColors.black,
      surface: TlColors.ink,
      onSurface: Colors.white,
      secondary: TlColors.goldSoft,
    ),
    textTheme: text,
    appBarTheme: const AppBarTheme(
      backgroundColor: TlColors.black,
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: false,
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: TlColors.ink,
      indicatorColor: TlColors.gold.withValues(alpha: 0.18),
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return TextStyle(
          fontSize: 12,
          fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
          color: selected ? TlColors.gold : TlColors.muted,
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return IconThemeData(color: selected ? TlColors.gold : TlColors.muted);
      }),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: TlColors.gold,
        foregroundColor: TlColors.black,
        padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: TlColors.gold,
        side: const BorderSide(color: TlColors.gold),
        padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    ),
  );
}
