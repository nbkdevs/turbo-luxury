class PackageOffer {
  const PackageOffer({
    required this.name,
    required this.price,
    required this.summary,
    required this.includes,
  });

  final String name;
  final String price;
  final String summary;
  final List<String> includes;
}

class WashService {
  const WashService({
    required this.title,
    required this.blurb,
    required this.iconName,
  });

  final String title;
  final String blurb;
  final String iconName;
}

class CompanyContact {
  const CompanyContact({
    required this.phoneDisplay,
    required this.phoneUri,
    required this.whatsAppUri,
    required this.websiteUri,
    required this.area,
  });

  final String phoneDisplay;
  final Uri phoneUri;
  final Uri whatsAppUri;
  final Uri websiteUri;
  final String area;
}
