<?php

declare(strict_types=1);

namespace NbkDevs\TurboLuxury\Booking;

use DateTimeImmutable;
use InvalidArgumentException;

/** Builds the text of a booking request and the wa.me / tel: links that carry it. */
final class BookingMessage
{
    /** WhatsApp and phone number used for bookings, international format. */
    public const BUSINESS_PHONE = '+971569892095';

    /**
     * Build a plain-text booking request.
     *
     * Keys: package (required), name, car, area, date (YYYY-MM-DD), time (HH:MM), notes.
     *
     * @param array<string, string> $request
     */
    public static function build(array $request): string
    {
        if (!isset($request['package']) || trim($request['package']) === '') {
            throw new InvalidArgumentException('A package is required');
        }
        $pkg = Packages::get($request['package']);
        $lines = ['Hello, I would like to book a mobile car wash.', ''];
        $lines[] = 'Package: ' . $pkg['name'] . ' (' . Packages::priceLabel($request['package']) . ')';
        if (self::has($request, 'car')) {
            $lines[] = 'Car: ' . self::clean($request['car']);
        }
        if (self::has($request, 'area')) {
            $lines[] = 'Area: ' . self::clean($request['area']);
        }
        if (self::has($request, 'date')) {
            $when = self::parseDate($request['date']);
            if (self::has($request, 'time')) {
                $when .= ' at ' . self::parseTime($request['time']);
            }
            $lines[] = 'When: ' . $when;
        } elseif (self::has($request, 'time')) {
            $lines[] = 'Time: ' . self::parseTime($request['time']);
        }
        if (self::has($request, 'notes')) {
            $lines[] = 'Notes: ' . self::clean($request['notes']);
        }
        if (self::has($request, 'name')) {
            $lines[] = '';
            $lines[] = 'Name: ' . self::clean($request['name']);
        }
        return implode("\n", $lines);
    }

    /** wa.me click-to-chat URL with the message pre-filled. Defaults to the business number. */
    public static function whatsappUrl(string $message, string $phone = self::BUSINESS_PHONE): string
    {
        $digits = ltrim(Phone::normalize($phone), '+');
        return 'https://wa.me/' . $digits . '?text=' . rawurlencode($message);
    }

    /** tel: link for a phone number. */
    public static function telUrl(string $phone = self::BUSINESS_PHONE): string
    {
        return 'tel:' . Phone::normalize($phone);
    }

    /** @param array<string, string> $request */
    private static function has(array $request, string $key): bool
    {
        return isset($request[$key]) && trim($request[$key]) !== '';
    }

    private static function clean(string $value): string
    {
        return trim(preg_replace('/\s+/', ' ', $value) ?? '');
    }

    private static function parseDate(string $value): string
    {
        $d = DateTimeImmutable::createFromFormat('!Y-m-d', trim($value));
        if ($d === false || $d->format('Y-m-d') !== trim($value)) {
            throw new InvalidArgumentException('Date must be YYYY-MM-DD: ' . $value);
        }
        return $d->format('D j M Y');
    }

    private static function parseTime(string $value): string
    {
        if (!preg_match('/^([01]\d|2[0-3]):([0-5]\d)$/', trim($value))) {
            throw new InvalidArgumentException('Time must be HH:MM (24h): ' . $value);
        }
        return trim($value);
    }
}
