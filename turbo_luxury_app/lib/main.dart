import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'data/catalog_repository.dart';
import 'ui/app_shell.dart';
import 'ui/core/theme.dart';
import 'ui/features/book/booking_view_model.dart';
import 'ui/features/splash/splash_view.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: TlColors.black,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const TurboLuxuryApp());
}

class TurboLuxuryApp extends StatefulWidget {
  const TurboLuxuryApp({super.key, this.showSplash = true});

  final bool showSplash;

  @override
  State<TurboLuxuryApp> createState() => _TurboLuxuryAppState();
}

class _TurboLuxuryAppState extends State<TurboLuxuryApp> {
  static const _catalog = CatalogRepository();
  late final BookingViewModel _booking = BookingViewModel(catalog: _catalog);
  late bool _showSplash = widget.showSplash;

  @override
  void dispose() {
    _booking.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Turbo Luxury Car Wash App',
      debugShowCheckedModeBanner: false,
      theme: buildTurboLuxuryTheme(),
      home: _showSplash
          ? SplashView(onFinished: () => setState(() => _showSplash = false))
          : AppShell(catalog: _catalog, booking: _booking),
    );
  }
}
