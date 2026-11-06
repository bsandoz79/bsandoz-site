<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Systeme;

use App\Prospect\Domain\Demande;
use App\Prospect\Domain\ReferencesFil;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/** Référence signée avec le secret de l'application. Changer APP_SECRET invalide les références déjà envoyées. */
final class ReferencesSignees implements ReferencesFil
{
    public function __construct(
        #[Autowire('%kernel.secret%')]
        private readonly string $secret,
    ) {
    }

    public function pour(Demande $demande): string
    {
        return "[fil:{$demande->numero}-{$this->signature($demande->numero)}]";
    }

    public function numeroDans(string $sujet): ?string
    {
        if (preg_match('/\[fil:(\d{4}-\d{3,})-([a-f0-9]{16})\]/i', $sujet, $trouve) !== 1) {
            return null;
        }

        return hash_equals($this->signature($trouve[1]), strtolower($trouve[2])) ? $trouve[1] : null;
    }

    private function signature(string $numero): string
    {
        return substr(hash_hmac('sha256', 'prospect-fil:' . $numero, $this->secret), 0, 16);
    }
}
