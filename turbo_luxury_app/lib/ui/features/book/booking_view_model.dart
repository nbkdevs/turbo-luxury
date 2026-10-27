import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../data/catalog_repository.dart';
import '../../../domain/models.dart';

class BookingViewModel extends ChangeNotifier {
  BookingViewModel({required this._catalog});

  final CatalogRepository _catalog;
  String? _error;

  CompanyContact get contact => _catalog.contact();
  String? get error => _error;

  Future<void> bookOnWhatsApp() => _open(contact.whatsAppUri);
  Future<void> callTeam() => _open(contact.phoneUri);
  Future<void> openWebsite() => _open(contact.websiteUri);

  Future<void> _open(Uri uri) async {
    _error = null;
    notifyListeners();
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok) {
      _error = 'Could not open that link on this device.';
      notifyListeners();
    }
  }
}
