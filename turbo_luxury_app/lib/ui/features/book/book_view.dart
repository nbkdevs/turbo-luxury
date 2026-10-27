import 'package:flutter/material.dart';

import '../../core/theme.dart';
import '../../core/widgets.dart';
import 'booking_view_model.dart';

class BookView extends StatelessWidget {
  const BookView({super.key, required this.viewModel});

  final BookingViewModel viewModel;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: viewModel,
      builder: (context, _) {
        final contact = viewModel.contact;
        return ListView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
          children: [
            const SectionHeader(
              kicker: 'Book',
              title: 'Share your package and address',
            ),
            const SizedBox(height: 12),
            Text(
              'WhatsApp is the fastest way to confirm a time. We come to you anywhere in Abu Dhabi.',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 24),
            GoldCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const GoldKicker('WhatsApp'),
                  const SizedBox(height: 10),
                  Text(
                    contact.phoneDisplay,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 6),
                  const Text('Tell us the package and where to meet you.'),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    onPressed: viewModel.bookOnWhatsApp,
                    icon: const Icon(Icons.chat_outlined),
                    label: const Text('Message us'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            GoldCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const GoldKicker('Call'),
                  const SizedBox(height: 10),
                  Text(
                    contact.phoneDisplay,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 16),
                  OutlinedButton.icon(
                    onPressed: viewModel.callTeam,
                    icon: const Icon(Icons.call_outlined),
                    label: const Text('Call the team'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            GoldCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const GoldKicker('Base'),
                  const SizedBox(height: 10),
                  Text(
                    contact.area,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: viewModel.openWebsite,
                    child: const Text('Open turboluxurycarwash.ae'),
                  ),
                ],
              ),
            ),
            if (viewModel.error != null) ...[
              const SizedBox(height: 16),
              Text(
                viewModel.error!,
                style: const TextStyle(color: TlColors.gold),
              ),
            ],
          ],
        );
      },
    );
  }
}
