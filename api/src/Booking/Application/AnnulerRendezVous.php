<?php

declare(strict_types=1);

namespace App\Booking\Application;

use App\Booking\Domain\DonneesInvalides;
use App\Booking\Domain\Notifications;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousIntrouvable;
use App\Booking\Domain\RendezVousRepository;

/**
 * Cas d'usage : annuler un rendez-vous depuis le lien secret reçu par mail.
 * Le créneau redevient libre. Annuler deux fois ne prévient qu'une fois.
 */
final class AnnulerRendezVous
{
    private const MESSAGE_MAX = 2000;

    public function __construct(
        private readonly RendezVousRepository $rendezVous,
        private readonly Notifications $notifications,
    ) {
    }

    /** @throws RendezVousIntrouvable */
    public function __invoke(string $jeton): RendezVous
    {
        $rendezVous = $this->rendezVous->parJeton($jeton) ?? throw new RendezVousIntrouvable('Lien de rendez-vous inconnu.');
        if ($rendezVous->annuler()) {
            $this->rendezVous->enregistrer($rendezVous);
            $this->notifications->rendezVousAnnule($rendezVous);
        }

        return $rendezVous;
    }

    /**
     * Le professionnel a un empêchement : il annule et propose d'autres disponibilités.
     * Annuler deux fois ne prévient qu'une fois.
     *
     * @throws RendezVousIntrouvable
     * @throws DonneesInvalides message manquant ou trop long, lien invalide
     */
    public function parProfessionnel(string $id, string $message, string $lien): RendezVous
    {
        $rendezVous = $this->rendezVous->parId($id) ?? throw new RendezVousIntrouvable('Rendez-vous inconnu.');
        $message = trim($message);
        $erreurs = [];
        if ($message === '' || mb_strlen($message) > self::MESSAGE_MAX) {
            $erreurs['message'] = 'Indiquez vos disponibilités (2 000 caractères au plus).';
        }
        if (preg_match('#^https?://[^\s]+$#', $lien) !== 1) {
            $erreurs['lien'] = 'Lien de prise de rendez-vous invalide.';
        }
        if ($erreurs !== []) {
            throw new DonneesInvalides($erreurs);
        }
        if ($rendezVous->annuler()) {
            $this->rendezVous->enregistrer($rendezVous);
            $this->notifications->rendezVousAnnuleParProfessionnel($rendezVous, $message, $lien);
        }

        return $rendezVous;
    }
}
