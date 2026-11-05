<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** À quoi sert un lien envoyé par mail, et combien de temps il reste valable. */
enum UsageLien: string
{
    case Activation = 'activation';
    case Connexion = 'connexion';
    case MotDePasse = 'mot_de_passe';
    /** Envoyé à la NOUVELLE adresse : l'ouvrir prouve qu'elle appartient bien à la personne. */
    case ChangementEmail = 'changement_email';
    case Suppression = 'suppression';

    public function dureeDeVie(): \DateInterval
    {
        return match ($this) {
            self::Activation => new \DateInterval('P7D'),
            self::Connexion => new \DateInterval('PT15M'),
            self::MotDePasse, self::ChangementEmail, self::Suppression => new \DateInterval('PT1H'),
        };
    }
}
