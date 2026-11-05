<?php

declare(strict_types=1);

namespace App\Liaisons;

use App\Auth\Application\OuvrirCompte;
use App\Booking\Infrastructure\Evenement\RendezVousReserve;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

/**
 * Liaison propre à bsandoz.fr entre deux modules autonomes : au premier rendez-vous,
 * un compte client est ouvert et un lien d'activation est envoyé (cahier des charges, section 8).
 *
 * Ni Booking ni Auth ne se connaissent : chacun s'installe seul chez un client.
 * Un échec ici ne doit pas faire échouer la réservation, déjà enregistrée : il est seulement journalisé.
 */
final class CompteApresRendezVous
{
    public function __construct(
        private readonly OuvrirCompte $ouvrirCompte,
        private readonly LoggerInterface $logger,
    ) {
    }

    #[AsEventListener]
    public function __invoke(RendezVousReserve $evenement): void
    {
        $contact = $evenement->rendezVous->contact;
        try {
            ($this->ouvrirCompte)($contact->email, $contact->nom);
        } catch (\Throwable $e) {
            $this->logger->error('Ouverture du compte après un rendez-vous impossible : {message}', [
                'message' => $e->getMessage(),
                'rendezVous' => $evenement->rendezVous->id,
            ]);
        }
    }
}
