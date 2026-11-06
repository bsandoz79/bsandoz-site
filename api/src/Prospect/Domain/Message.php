<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Un échange du fil d'une demande : message écrit sur le site, réponse reçue par mail ou note d'appel. */
class Message
{
    public const TAILLE_MAX = 5000;

    private function __construct(
        public readonly string $id,
        public readonly string $demandeId,
        public readonly AuteurMessage $auteur,
        public readonly OrigineMessage $origine,
        public readonly string $corps,
        public readonly \DateTimeImmutable $creeLe,
        public readonly ?string $idMail,
    ) {
    }

    /**
     * @param string|null $idMail identifiant du mail d'origine, pour ne jamais l'ajouter deux fois
     *
     * @throws DonneesInvalides message vide ou trop long
     */
    public static function ecrire(
        string $id,
        Demande $demande,
        AuteurMessage $auteur,
        OrigineMessage $origine,
        string $corps,
        \DateTimeImmutable $maintenant,
        ?string $idMail = null,
    ): self {
        $corps = trim(str_replace("\r", '', $corps));
        if ($corps === '') {
            throw new DonneesInvalides(['corps' => 'Écrivez votre message.']);
        }
        if (mb_strlen($corps) > self::TAILLE_MAX) {
            throw new DonneesInvalides(['corps' => 'Message trop long (' . self::TAILLE_MAX . ' caractères au plus).']);
        }

        return new self($id, $demande->id, $auteur, $origine, $corps, $maintenant, $idMail);
    }
}
