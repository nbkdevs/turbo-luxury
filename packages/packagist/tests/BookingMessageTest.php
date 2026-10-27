<?php

declare(strict_types=1);

namespace NbkDevs\TurboLuxury\Booking\Tests;

use InvalidArgumentException;
use NbkDevs\TurboLuxury\Booking\BookingMessage;
use NbkDevs\TurboLuxury\Booking\Packages;
use PHPUnit\Framework\TestCase;

final class BookingMessageTest extends TestCase
{
    public function testPackagePrices(): void
    {
        $this->assertSame('60-70 AED', Packages::priceLabel('quick'));
        $this->assertSame('100-120 AED', Packages::priceLabel('Golden'));
        $this->assertSame('150-170 AED', Packages::priceLabel('diamond'));
        $this->assertSame('300 AED', Packages::priceLabel('detailing'));
    }

    public function testUnknownPackage(): void
    {
        $this->expectException(InvalidArgumentException::class);
        Packages::get('platinum');
    }

    public function testFullMessage(): void
    {
        $msg = BookingMessage::build([
            'package' => 'golden', 'car' => '2022  Toyota   Land Cruiser', 'area' => 'Khalifa City',
            'date' => '2026-11-03', 'time' => '09:30', 'notes' => 'Gate code 1234', 'name' => 'Ahmed',
        ]);
        $expected = "Hello, I would like to book a mobile car wash.\n\n"
            . "Package: Golden Shine (100-120 AED)\n"
            . "Car: 2022 Toyota Land Cruiser\n"
            . "Area: Khalifa City\n"
            . "When: Tue 3 Nov 2026 at 09:30\n"
            . "Notes: Gate code 1234\n\n"
            . "Name: Ahmed";
        $this->assertSame($expected, $msg);
    }

    public function testMinimalMessage(): void
    {
        $this->assertSame(
            "Hello, I would like to book a mobile car wash.\n\nPackage: Quick Shine (60-70 AED)",
            BookingMessage::build(['package' => 'quick'])
        );
    }

    public function testRequiresPackageAndValidDates(): void
    {
        foreach ([[], ['package' => ' '], ['package' => 'quick', 'date' => '2026-02-30'],
                  ['package' => 'quick', 'date' => '3/11/2026'], ['package' => 'quick', 'time' => '25:00']] as $bad) {
            try {
                BookingMessage::build($bad);
                $this->fail('expected exception');
            } catch (InvalidArgumentException $e) {
                $this->assertNotSame('', $e->getMessage());
            }
        }
    }

    public function testWhatsappUrlEncodesAndDefaultsToBusinessNumber(): void
    {
        $url = BookingMessage::whatsappUrl("Hi there\nPackage: Quick Shine");
        $this->assertSame('https://wa.me/971569892095?text=Hi%20there%0APackage%3A%20Quick%20Shine', $url);
        $this->assertStringStartsWith('https://wa.me/971501234567?', BookingMessage::whatsappUrl('x', '050 123 4567'));
    }

    public function testTelUrl(): void
    {
        $this->assertSame('tel:+971569892095', BookingMessage::telUrl());
        $this->assertSame('tel:+97121234567', BookingMessage::telUrl('02 123 4567'));
    }
}
