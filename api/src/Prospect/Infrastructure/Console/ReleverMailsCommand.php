<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Console;

use App\Prospect\Application\ReleverLesReponses;
use App\Prospect\Domain\BoiteDeReception;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/** À lancer régulièrement (tâche planifiée, toutes les 5 minutes). */
#[AsCommand(name: 'prospect:relever-mails', description: 'Rattache les réponses reçues par mail au fil de leur demande.')]
final class ReleverMailsCommand extends Command
{
    public function __construct(
        private readonly ReleverLesReponses $relever,
        private readonly BoiteDeReception $boite,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        if (!$this->boite->estConfiguree()) {
            $output->writeln('Boîte des réponses non configurée (PROSPECT_IMAP_HOTE) : rien à relever.');

            return Command::SUCCESS;
        }
        try {
            $bilan = ($this->relever)();
        } catch (\RuntimeException $e) {
            $output->writeln("<error>{$e->getMessage()}</error>");

            return Command::FAILURE;
        }
        $output->writeln(sprintf(
            '%d réponse(s) ajoutée(s), %d réponse(s) automatique(s) ignorée(s), %d mail(s) laissé(s) non lu(s).',
            $bilan['ajoutes'],
            $bilan['automatiques'],
            $bilan['laisses'],
        ));

        return Command::SUCCESS;
    }
}
