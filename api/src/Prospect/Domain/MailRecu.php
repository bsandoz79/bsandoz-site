<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Un mail trouvé dans la boîte des réponses. */
final class MailRecu
{
    public function __construct(
        public readonly string $uid,
        /** Empreinte du Message-ID : le même mail n'est jamais ajouté deux fois. */
        public readonly string $idMail,
        public readonly string $expediteur,
        public readonly string $sujet,
        public readonly string $texte,
        /** Réponse automatique (absence du bureau, erreur de distribution…) : jamais ajoutée au fil. */
        public readonly bool $automatique,
    ) {
    }
}
