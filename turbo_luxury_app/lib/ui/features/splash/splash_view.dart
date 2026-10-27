import 'package:flutter/material.dart';

import '../../core/theme.dart';

class SplashView extends StatefulWidget {
  const SplashView({super.key, required this.onFinished});

  final VoidCallback onFinished;

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView> {
  @override
  void initState() {
    super.initState();
    Future<void>.delayed(const Duration(milliseconds: 1600), () {
      if (!mounted) {
        return;
      }
      widget.onFinished();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TlColors.black,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(
              'assets/branding/app_icon.png',
              width: 108,
              height: 108,
              filterQuality: FilterQuality.high,
            ),
            const SizedBox(height: 24),
            Image.asset(
              'assets/branding/splash_logo.png',
              width: 220,
              filterQuality: FilterQuality.high,
            ),
            const SizedBox(height: 18),
            const Text(
              'TURBO LUXURY CAR WASH APP',
              style: TextStyle(
                color: TlColors.gold,
                letterSpacing: 2.2,
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
