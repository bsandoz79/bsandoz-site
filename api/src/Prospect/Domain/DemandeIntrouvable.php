<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Demande inconnue, ou qui n'appartient pas à la personne qui la demande (même réponse, pour ne rien révéler). */
final class DemandeIntrouvable extends \DomainException
{
}
