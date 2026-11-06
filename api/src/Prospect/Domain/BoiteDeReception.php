<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Port : boîte mail où arrivent les réponses. */
interface BoiteDeReception
{
    public function estConfiguree(): bool;

    /**
     * @return list<MailRecu> mails non lus, sans les marquer comme lus
     *
     * @throws \RuntimeException boîte injoignable
     */
    public function nonLus(int $maximum): array;

    public function marquerLu(MailRecu $mail): void;
}
