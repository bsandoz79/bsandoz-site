<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Systeme;

use App\Prospect\Domain\ContactProfessionnel;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final class ContactDepuisLesReglages implements ContactProfessionnel
{
    public function __construct(
        #[Autowire('%prospect.professionnel_email%')]
        private readonly string $email,
    ) {
    }

    public function email(): string
    {
        return $this->email;
    }
}
