<?php

declare(strict_types=1);

namespace App\Liaisons;

use App\Auth\Application\OuvrirCompte;
use App\Prospect\Infrastructure\Evenement\DemandeEnregistree;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

/**
 * Liaison propre à bsandoz.fr : à la première demande de devis, un compte client est ouvert
 * et un lien d'activation est envoyé (cahier des charges, section 8). Rien ne change si le compte existe.
 * Un échec ici ne doit pas faire échouer la demande, déjà enregistrée : il est seulement journalisé.
 */
final class CompteApresDemande
{
    public function __construct(
        private readonly OuvrirCompte $ouvrirCompte,
        private readonly LoggerInterface $logger,
    ) {
    }

    #[AsEventListener]
    public function __invoke(DemandeEnregistree $evenement): void
    {
        $demandeur = $evenement->demande->demandeur;
        try {
            ($this->ouvrirCompte)($demandeur->email, $demandeur->nom);
        } catch (\Throwable $e) {
            $this->logger->error('Ouverture du compte après une demande impossible : {message}', [
                'message' => $e->getMessage(),
                'demande' => $evenement->demande->numero,
            ]);
        }
    }
}
