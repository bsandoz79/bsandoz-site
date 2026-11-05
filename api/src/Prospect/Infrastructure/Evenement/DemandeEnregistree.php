<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Evenement;

use App\Prospect\Domain\Demande;

/**
 * Publié après l'enregistrement d'une demande de devis. Le module Prospect ne sait pas qui l'écoute :
 * une installation peut s'en servir (ouvrir un compte client…) ou l'ignorer.
 */
final class DemandeEnregistree
{
    public function __construct(public readonly Demande $demande)
    {
    }
}
