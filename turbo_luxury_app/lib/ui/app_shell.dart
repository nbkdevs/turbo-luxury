import 'package:flutter/material.dart';

import '../data/catalog_repository.dart';
import 'features/book/book_view.dart';
import 'features/book/booking_view_model.dart';
import 'features/home/home_view.dart';
import 'features/services/services_view.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key, required this.catalog, required this.booking});

  final CatalogRepository catalog;
  final BookingViewModel booking;

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      HomeView(
        catalog: widget.catalog,
        booking: widget.booking,
        onSeePackages: () => setState(() => _index = 1),
      ),
      ServicesView(catalog: widget.catalog, booking: widget.booking),
      BookView(viewModel: widget.booking),
    ];

    return Scaffold(
      body: SafeArea(
        child: IndexedStack(index: _index, children: pages),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_awesome_outlined),
            selectedIcon: Icon(Icons.auto_awesome),
            label: 'Services',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_month_outlined),
            selectedIcon: Icon(Icons.calendar_month),
            label: 'Book',
          ),
        ],
      ),
    );
  }
}
