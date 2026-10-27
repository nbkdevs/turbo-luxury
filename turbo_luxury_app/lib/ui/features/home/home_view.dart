import 'package:flutter/material.dart';

import '../../../data/catalog_repository.dart';
import '../../core/theme.dart';
import '../../core/widgets.dart';
import '../book/booking_view_model.dart';

class HomeView extends StatelessWidget {
  const HomeView({
    super.key,
    required this.catalog,
    required this.booking,
    required this.onSeePackages,
  });

  final CatalogRepository catalog;
  final BookingViewModel booking;
  final VoidCallback onSeePackages;

  @override
  Widget build(BuildContext context) {
    final packages = catalog.packages();
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
      children: [
        Center(
          child: Image.asset(
            'assets/branding/logo.png',
            height: 44,
            filterQuality: FilterQuality.high,
          ),
        ),
        const SizedBox(height: 28),
        const GoldKicker('Abu Dhabi · 24 hours'),
        const SizedBox(height: 12),
        Text(
          'Mobile car wash at your home, villa or office.',
          style: Theme.of(context).textTheme.displaySmall,
        ),
        const SizedBox(height: 14),
        Text(
          'Pick a package, confirm on WhatsApp, and we come to you anywhere in Abu Dhabi.',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: 24),
        FilledButton.icon(
          onPressed: booking.bookOnWhatsApp,
          icon: const Icon(Icons.chat_outlined),
          label: const Text('Book on WhatsApp'),
        ),
        const SizedBox(height: 12),
        OutlinedButton(
          onPressed: onSeePackages,
          child: const Text('View packages'),
        ),
        const SizedBox(height: 36),
        const SectionHeader(
          kicker: 'Why us',
          title: 'Clear prices. We come to you.',
        ),
        const SizedBox(height: 16),
        const GoldCard(
          child: Column(
            children: [
              _Reason(
                icon: Icons.schedule,
                text: 'Open 24 hours across Abu Dhabi',
              ),
              SizedBox(height: 14),
              _Reason(
                icon: Icons.payments_outlined,
                text: 'Four packages from 60 AED',
              ),
              SizedBox(height: 14),
              _Reason(
                icon: Icons.home_outlined,
                text: 'Home, villa or office driveway',
              ),
            ],
          ),
        ),
        const SizedBox(height: 36),
        const SectionHeader(
          kicker: 'Packages',
          title: 'Start with the shine you need',
        ),
        const SizedBox(height: 16),
        ...packages
            .take(2)
            .map(
              (offer) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: GoldCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              offer.name,
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                          ),
                          Text(
                            offer.price,
                            style: const TextStyle(
                              color: TlColors.gold,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(offer.summary),
                    ],
                  ),
                ),
              ),
            ),
        TextButton(
          onPressed: onSeePackages,
          child: const Text('See all packages'),
        ),
      ],
    );
  }
}

class _Reason extends StatelessWidget {
  const _Reason({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: TlColors.gold, size: 22),
        const SizedBox(width: 12),
        Expanded(
          child: Text(text, style: Theme.of(context).textTheme.bodyLarge),
        ),
      ],
    );
  }
}
