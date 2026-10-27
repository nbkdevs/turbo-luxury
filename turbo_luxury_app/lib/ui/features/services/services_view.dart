import 'package:flutter/material.dart';

import '../../../data/catalog_repository.dart';
import '../../core/theme.dart';
import '../../core/widgets.dart';
import '../book/booking_view_model.dart';

class ServicesView extends StatelessWidget {
  const ServicesView({super.key, required this.catalog, required this.booking});

  final CatalogRepository catalog;
  final BookingViewModel booking;

  static const _icons = <String, IconData>{
    'local_car_wash': Icons.local_car_wash_outlined,
    'airline_seat_recline_normal': Icons.airline_seat_recline_normal,
    'auto_awesome': Icons.auto_awesome,
    'workspace_premium': Icons.workspace_premium_outlined,
  };

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
      children: [
        const SectionHeader(
          kicker: 'Services',
          title: 'What we bring to your driveway',
        ),
        const SizedBox(height: 20),
        ...catalog.services().map(
          (service) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: GoldCard(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    _icons[service.iconName] ?? Icons.spa_outlined,
                    color: TlColors.gold,
                    size: 28,
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          service.title,
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 6),
                        Text(service.blurb),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 20),
        const SectionHeader(kicker: 'Packages', title: 'Four clear options'),
        const SizedBox(height: 16),
        ...catalog.packages().map(
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
                  const SizedBox(height: 12),
                  ...offer.includes.map(
                    (item) => Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.check,
                            color: TlColors.gold,
                            size: 16,
                          ),
                          const SizedBox(width: 8),
                          Expanded(child: Text(item)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        FilledButton(
          onPressed: booking.bookOnWhatsApp,
          child: const Text('Book this on WhatsApp'),
        ),
      ],
    );
  }
}
