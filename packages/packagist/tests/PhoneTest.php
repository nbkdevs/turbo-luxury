<?php

declare(strict_types=1);

namespace NbkDevs\TurboLuxury\Booking\Tests;

use InvalidArgumentException;
use NbkDevs\TurboLuxury\Booking\Phone;
use PHPUnit\Framework\TestCase;

final class PhoneTest extends TestCase
{
    public function testNormalizesMobileForms(): void
    {
        foreach (['+971 56 989 2095', '00971569892095', '971-56-989-2095', '056 989 2095', '569892095'] as $input) {
            $this->assertSame('+971569892095', Phone::normalize($input), $input);
            $this->assertTrue(Phone::isMobile($input), $input);
        }
    }

    public function testFormat(): void
    {
        $this->assertSame('+971 56 989 2095', Phone::format('0569892095'));
        $this->assertSame('+971 2 123 4567', Phone::format('02 123 4567'));
    }

    public function testLandlineIsValidButNotMobile(): void
    {
        $this->assertTrue(Phone::isValid('+97121234567'));
        $this->assertFalse(Phone::isMobile('+97121234567'));
    }

    public function testRejectsInvalid(): void
    {
        foreach (['', '12345', '+44 7700 900123', '0 51 123 4567', '+971 56 989 209', '+971 59 989 2095'] as $bad) {
            $this->assertFalse(Phone::isValid($bad), $bad);
        }
        $this->expectException(InvalidArgumentException::class);
        Phone::normalize('abc');
    }
}
