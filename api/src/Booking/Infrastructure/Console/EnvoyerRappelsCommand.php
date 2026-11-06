<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Console;

use App\Booking\Application\EnvoyerRappels;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/** À lancer une fois par jour (tâche planifiée), en fin de matinée par exemple. */
#[AsCommand(name: 'booking:envoyer-rappels', description: 'Rappelle par mail les rendez-vous du lendemain.')]
final class EnvoyerRappelsCommand extends Command
{
    public function __construct(private readonly EnvoyerRappels $envoyer)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $bilan = ($this->envoyer)();
        $output->writeln(sprintf('%d rappel(s) envoyé(s), %d refusé(s) par la personne.', $bilan['envoyes'], $bilan['refuses']));

        return Command::SUCCESS;
    }
}
