<?php

declare(strict_types=1);

namespace NbkDevs\TurboLuxury\Booking;

use InvalidArgumentException;

/** UAE phone number helpers. Accepts +971, 00971, 971, a leading 0 or the bare national number. */
final class Phone
{
    /** Mobile prefixes in use in the UAE (after the country code). */
    public const MOBILE_PREFIXES = ['50', '52', '54', '55', '56', '58'];

    /** Normalise to E.164 (+971XXXXXXXXX). Throws InvalidArgumentException when it is not a UAE number. */
    public static function normalize(string $input): string
    {
        $digits = preg_replace('/\D+/', '', $input) ?? '';
        if (str_starts_with($digits, '00971')) {
            $digits = substr($digits, 5);
        } elseif (str_starts_with($digits, '971')) {
            $digits = substr($digits, 3);
        } elseif (str_starts_with($digits, '0')) {
            $digits = substr($digits, 1);
        }
        if (self::isNationalMobile($digits) || self::isNationalLandline($digits)) {
            return '+971' . $digits;
        }
        throw new InvalidArgumentException('Not a valid UAE phone number: ' . $input);
    }

    public static function isValid(string $input): bool
    {
        try {
            self::normalize($input);
            return true;
        } catch (InvalidArgumentException) {
            return false;
        }
    }

    public static function isMobile(string $input): bool
    {
        try {
            return self::isNationalMobile(substr(self::normalize($input), 4));
        } catch (InvalidArgumentException) {
            return false;
        }
    }

    /** Human format: +971 56 989 2095 (mobile) or +971 2 123 4567 (landline). */
    public static function format(string $input): string
    {
        $n = substr(self::normalize($input), 4);
        if (self::isNationalMobile($n)) {
            return '+971 ' . substr($n, 0, 2) . ' ' . substr($n, 2, 3) . ' ' . substr($n, 5);
        }
        return '+971 ' . substr($n, 0, 1) . ' ' . substr($n, 1, 3) . ' ' . substr($n, 4);
    }

    private static function isNationalMobile(string $n): bool
    {
        return strlen($n) === 9 && ctype_digit($n) && in_array(substr($n, 0, 2), self::MOBILE_PREFIXES, true);
    }

    private static function isNationalLandline(string $n): bool
    {
        // Area codes 2 (Abu Dhabi), 3, 4 (Dubai), 6, 7, 9 followed by seven digits.
        return strlen($n) === 8 && ctype_digit($n) && in_array($n[0], ['2', '3', '4', '6', '7', '9'], true);
    }
}
