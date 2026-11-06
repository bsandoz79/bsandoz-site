<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Imap;

use App\Prospect\Domain\BoiteDeReception;
use App\Prospect\Domain\MailRecu;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/** Adaptateur du port BoiteDeReception : la boîte des réponses, relevée en IMAP. */
final class BoiteImap implements BoiteDeReception
{
    private ?ClientImap $client = null;

    public function __construct(
        #[Autowire('%prospect.imap_hote%')]
        private readonly string $hote,
        #[Autowire('%prospect.imap_port%')]
        private readonly int $port,
        #[Autowire('%prospect.imap_chiffrement%')]
        private readonly string $chiffrement,
        #[Autowire('%prospect.imap_utilisateur%')]
        private readonly string $utilisateur,
        #[Autowire('%prospect.imap_mot_de_passe%')]
        private readonly string $motDePasse,
        #[Autowire('%prospect.imap_dossier%')]
        private readonly string $dossier,
    ) {
    }

    public function estConfiguree(): bool
    {
        return $this->hote !== '' && $this->utilisateur !== '';
    }

    public function nonLus(int $maximum): array
    {
        $client = $this->client();

        return array_map(
            static fn (string $uid) => LectureMail::depuisBrut($uid, $client->lire($uid)),
            array_slice($client->nonLus(), 0, $maximum),
        );
    }

    public function marquerLu(MailRecu $mail): void
    {
        $this->client()->marquerLu($mail->uid);
    }

    private function client(): ClientImap
    {
        if ($this->client === null) {
            $client = new ClientImap($this->hote, $this->port, $this->chiffrement);
            $client->ouvrir($this->utilisateur, $this->motDePasse, $this->dossier);
            $this->client = $client;
        }

        return $this->client;
    }
}
