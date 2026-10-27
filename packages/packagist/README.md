# nbkdevs/turbo-luxury-whatsapp-booking

A dependency-free PHP library for sites that take car wash bookings over WhatsApp. It builds a clean,
pre-filled booking message from a few fields, turns it into a `wa.me` click-to-chat link, and
validates and formats UAE phone numbers (mobile and landline) so the link always works.

Maintained by Turbo Luxury Car Wash, a [mobile car wash Abu Dhabi](https://turboluxurycarwash.ae/) service that takes bookings by WhatsApp or phone.

## Install

```sh
composer require nbkdevs/turbo-luxury-whatsapp-booking
```

Requires PHP 8.0 or newer. No runtime dependencies.

## Usage

```php
use NbkDevs\TurboLuxury\Booking\BookingMessage;
use NbkDevs\TurboLuxury\Booking\Phone;
use NbkDevs\TurboLuxury\Booking\Packages;

$text = BookingMessage::build([
    'package' => 'golden',            // quick | golden | diamond | detailing
    'car'     => '2022 Toyota Land Cruiser',
    'area'    => 'Khalifa City',
    'date'    => '2026-11-03',        // YYYY-MM-DD
    'time'    => '09:30',             // 24h HH:MM
    'notes'   => 'Gate code 1234',
    'name'    => 'Ahmed',
]);

$link = BookingMessage::whatsappUrl($text);  // https://wa.me/971569892095?text=Hello%2C%20I%20would...
$call = BookingMessage::telUrl();            // tel:+971569892095

Phone::normalize('056 989 2095');   // +971569892095
Phone::isMobile('+97121234567');    // false (landline)
Phone::format('0569892095');        // +971 56 989 2095
Packages::priceLabel('quick');      // 60-70 AED
```

Message produced above:

```text
Hello, I would like to book a mobile car wash.

Package: Golden Shine (100-120 AED)
Car: 2022 Toyota Land Cruiser
Area: Khalifa City
When: Tue 3 Nov 2026 at 09:30
Notes: Gate code 1234

Name: Ahmed
```

Invalid input (unknown package, impossible dates such as 2026-02-30, bad times, non-UAE numbers)
throws `InvalidArgumentException`. Pass another number as the second argument of `whatsappUrl()` /
`telUrl()` to reuse the library for a different business line.

## Tests

The package is published from the repository root (`composer.json` there autoloads
`packages/packagist/src`).

```sh
composer install && composer test
```

## Links

- Source: https://github.com/nbkdevs/turbo-luxury/tree/main/packages/packagist
- Licence: MIT
