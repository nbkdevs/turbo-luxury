<?php

declare(strict_types=1);

namespace NbkDevs\TurboLuxury\Booking;

use InvalidArgumentException;

/** The four mobile wash packages with their published AED price ranges. */
final class Packages
{
    /** @return array<string, array{name: string, min: int, max: int, includes: list<string>}> */
    public static function all(): array
    {
        return [
            'quick' => ['name' => 'Quick Shine', 'min' => 60, 'max' => 70,
                'includes' => ['Exterior wash', 'Interior clean', 'Windows, wheels and rims', 'Mats, dry and perfume']],
            'golden' => ['name' => 'Golden Shine', 'min' => 100, 'max' => 120,
                'includes' => ['Everything in Quick Shine', 'Wax application', 'Deep interior cleaning']],
            'diamond' => ['name' => 'Diamond Shine', 'min' => 150, 'max' => 170,
                'includes' => ['Everything in Golden Shine', 'Engine compartment', 'Interior sanitization']],
            'detailing' => ['name' => 'Detailing Shine', 'min' => 300, 'max' => 300,
                'includes' => ['Seat deep cleaning', 'AC sanitization', 'Interior restoration', 'Front light polishing']],
        ];
    }

    /** @return array{name: string, min: int, max: int, includes: list<string>} */
    public static function get(string $id): array
    {
        $all = self::all();
        $key = strtolower(trim($id));
        if (!isset($all[$key])) {
            throw new InvalidArgumentException('Unknown package "' . $id . '". Use one of: ' . implode(', ', array_keys($all)));
        }
        return $all[$key];
    }

    public static function priceLabel(string $id): string
    {
        $p = self::get($id);
        return $p['min'] === $p['max'] ? $p['min'] . ' AED' : $p['min'] . '-' . $p['max'] . ' AED';
    }
}
