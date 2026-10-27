import '../domain/models.dart';

class CatalogRepository {
  const CatalogRepository();

  static final Uri _whatsApp = Uri.parse(
    'https://wa.me/971569892095?text=${Uri.encodeComponent('Hi, I have come from the Turbo Luxury Car Wash App and I would like to book a mobile car wash in Abu Dhabi.')}',
  );

  CompanyContact contact() {
    return CompanyContact(
      phoneDisplay: '+971 56 989 2095',
      phoneUri: Uri.parse('tel:+971569892095'),
      whatsAppUri: _whatsApp,
      websiteUri: Uri.parse('https://turboluxurycarwash.ae/'),
      area: 'Rabdan RB6, Abu Dhabi · 24 hours',
    );
  }

  List<PackageOffer> packages() {
    return const [
      PackageOffer(
        name: 'Quick Shine',
        price: '60–70 AED',
        summary: 'Everyday exterior and interior upkeep at your location.',
        includes: [
          'Exterior wash',
          'Interior clean',
          'Windows, wheels and rims',
          'Mats, dry and perfume',
        ],
      ),
      PackageOffer(
        name: 'Golden Shine',
        price: '100–120 AED',
        summary: 'Adds wax and a deeper interior clean.',
        includes: [
          'Everything in Quick Shine',
          'Wax application',
          'Deep interior cleaning',
        ],
      ),
      PackageOffer(
        name: 'Diamond Shine',
        price: '150–170 AED',
        summary: 'Engine bay cleaning and interior sanitization.',
        includes: [
          'Everything in Golden Shine',
          'Engine compartment',
          'Interior sanitization',
        ],
      ),
      PackageOffer(
        name: 'Detailing Shine',
        price: '300 AED',
        summary: 'The most complete mobile package in one visit.',
        includes: [
          'Seat deep cleaning',
          'AC sanitization',
          'Interior restoration',
          'Front light polishing',
        ],
      ),
    ];
  }

  List<WashService> services() {
    return const [
      WashService(
        title: 'Mobile car wash',
        blurb: 'We bring water, tools and a full wash to your home, villa or office anywhere in Abu Dhabi.',
        iconName: 'local_car_wash',
      ),
      WashService(
        title: 'Interior cleaning',
        blurb: 'Seats, mats, vents and cabin dust cleaned on site, at the level you pick.',
        iconName: 'airline_seat_recline_normal',
      ),
      WashService(
        title: 'Polishing',
        blurb: 'Windows, wheels and rims, with wax and light polishing on higher packages.',
        iconName: 'auto_awesome',
      ),
      WashService(
        title: 'Detailing',
        blurb: 'Our most complete packages: sanitization, engine bay work and restoration in one visit.',
        iconName: 'workspace_premium',
      ),
    ];
  }
}
