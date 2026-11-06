<?php

declare(strict_types=1);

namespace App\BackOffice;

use App\Auth\Application\OuvrirCompte;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/** Première entrée dans le back-office : ouvre le compte d'une adresse autorisée et lui envoie le lien d'activation. */
#[AsCommand(name: 'backoffice:ouvrir-acces', description: 'Ouvre le compte d’une adresse de BACKOFFICE_EMAILS (lien d’activation par mail).')]
final class OuvrirAccesCommand extends Command
{
    public function __construct(
        private readonly OuvrirCompte $ouvrirCompte,
        private readonly GardeBackOffice $garde,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('email', InputArgument::REQUIRED, 'Adresse autorisée');
        $this->addArgument('nom', InputArgument::REQUIRED, 'Prénom et nom');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = mb_strtolower(trim((string) $input->getArgument('email')));
        if (!in_array($email, $this->garde->autorisees(), true)) {
            $output->writeln("<error>{$email} n'est pas dans BACKOFFICE_EMAILS.</error>");

            return Command::FAILURE;
        }
        ($this->ouvrirCompte)($email, (string) $input->getArgument('nom'));
        $output->writeln("Compte prêt pour {$email}. Si le compte vient d'être ouvert, le lien d'activation part par mail ; sinon, connectez-vous normalement.");

        return Command::SUCCESS;
    }
}
