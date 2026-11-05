<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Étapes d'une demande, dans l'ordre (cahier des charges, section 8). */
enum StatutDemande: string
{
    case Recue = 'recue';
    case EnEtude = 'en_etude';
    case DevisEnvoye = 'devis_envoye';
    case Acceptee = 'acceptee';
    case EnCours = 'en_cours';
    case Livree = 'livree';

    public function libelle(): string
    {
        return match ($this) {
            self::Recue => 'Reçue',
            self::EnEtude => 'En étude',
            self::DevisEnvoye => 'Devis envoyé',
            self::Acceptee => 'Accepté',
            self::EnCours => 'En cours',
            self::Livree => 'Livré',
        };
    }

    /** Position dans le parcours (0 = Reçue). */
    public function rang(): int
    {
        return (int) array_search($this, self::cases(), true);
    }
}
