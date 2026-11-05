<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** À quoi sert un lien envoyé par mail, et combien de temps il reste valable. */
enum UsageLien: string
{
    case Activation = 'activation';
    case Connexion = 'connexion';
    case MotDePasse = 'mot_de_passe';

    public function dureeDeVie(): \DateInterval
    {
        return match ($this) {
            self::Activation => new \DateInterval('P7D'),
            self::Connexion => new \DateInterval('PT15M'),
            self::MotDePasse => new \DateInterval('PT1H'),
        };
    }
}
