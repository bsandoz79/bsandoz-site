<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Imap;

/**
 * Client IMAP minimal, en PHP pur (l'extension imap n'existe plus dans PHP 8.4 et n'est pas partout) :
 * seulement ce qu'il faut pour lire des mails non lus et les marquer comme lus (RFC 9051).
 */
final class ClientImap
{
    /** @var resource|null */
    private $flux;
    private int $numero = 0;

    /**
     * @param string $chiffrement « ssl » (port 993, normal) ; « aucun » seulement pour un serveur de test local
     */
    public function __construct(
        private readonly string $hote,
        private readonly int $port,
        private readonly string $chiffrement,
        private readonly int $delaiSecondes = 20,
    ) {
    }

    public function __destruct()
    {
        $this->fermer();
    }

    /** @throws \RuntimeException */
    public function ouvrir(string $utilisateur, string $motDePasse, string $dossier): void
    {
        $adresse = ($this->chiffrement === 'aucun' ? 'tcp' : 'ssl') . "://{$this->hote}:{$this->port}";
        $erreur = '';
        // Le certificat du serveur est vérifié : c'est le comportement par défaut de ssl:// et il n'est pas désactivé.
        $flux = @stream_socket_client($adresse, $code, $erreur, $this->delaiSecondes);
        if ($flux === false) {
            throw new \RuntimeException("Connexion à la boîte impossible : {$erreur}");
        }
        stream_set_timeout($flux, $this->delaiSecondes);
        $this->flux = $flux;
        $this->lireLigne(); // Accueil du serveur.
        $this->commande('LOGIN ' . self::chaine($utilisateur) . ' ' . self::chaine($motDePasse), 'Identifiants de la boîte refusés.');
        $this->commande('SELECT ' . self::chaine($dossier));
    }

    /**
     * @return list<string> UID des mails non lus, les plus anciens d'abord
     *
     * @throws \RuntimeException
     */
    public function nonLus(): array
    {
        foreach ($this->commande('UID SEARCH UNSEEN') as $ligne) {
            if (str_starts_with($ligne, '* SEARCH')) {
                return array_values(array_filter(explode(' ', trim(substr($ligne, 8))), static fn (string $uid) => $uid !== ''));
            }
        }

        return [];
    }

    /**
     * Mail brut, sans le marquer comme lu. Limité : une grosse pièce jointe ne doit pas saturer la mémoire,
     * et le texte vient d'ordinaire en premier.
     *
     * @throws \RuntimeException
     */
    public function lire(string $uid, int $octetsMaximum = 2_000_000): string
    {
        $reponse = $this->commande(sprintf('UID FETCH %s (BODY.PEEK[]<0.%d>)', self::uid($uid), $octetsMaximum));

        foreach ($reponse as $i => $ligne) {
            if (preg_match('/\{\d+\}$/', $ligne) === 1) {
                return $reponse[$i + 1] ?? '';
            }
        }

        throw new \RuntimeException('Mail illisible.');
    }

    /** @throws \RuntimeException */
    public function marquerLu(string $uid): void
    {
        $this->commande(sprintf('UID STORE %s +FLAGS.SILENT (\Seen)', self::uid($uid)));
    }

    public function fermer(): void
    {
        if (is_resource($this->flux)) {
            try {
                $this->commande('LOGOUT');
            } catch (\RuntimeException) {
                // Fermeture quand même.
            }
            fclose($this->flux);
        }
        $this->flux = null;
    }

    /**
     * Envoie une commande et rend les lignes de réponse. Un contenu annoncé par {n} est lu d'un seul bloc.
     *
     * @return list<string>
     *
     * @throws \RuntimeException
     */
    private function commande(string $commande, ?string $siRefus = null): array
    {
        if (!is_resource($this->flux)) {
            throw new \RuntimeException('Boîte non ouverte.');
        }
        $etiquette = sprintf('A%04d', ++$this->numero);
        if (fwrite($this->flux, "{$etiquette} {$commande}\r\n") === false) {
            throw new \RuntimeException('Écriture impossible vers la boîte.');
        }
        $lignes = [];
        while (true) {
            $ligne = $this->lireLigne();
            if (str_starts_with($ligne, "{$etiquette} ")) {
                if (!str_starts_with(substr($ligne, strlen($etiquette) + 1), 'OK')) {
                    // Le texte du serveur n'est pas repris : il pourrait citer la commande, donc le mot de passe.
                    throw new \RuntimeException($siRefus ?? 'Commande refusée par la boîte : ' . strtok($commande, ' '));
                }

                return $lignes;
            }
            $lignes[] = $ligne;
            if (preg_match('/\{(\d+)\}$/', $ligne, $taille) === 1) {
                $lignes[] = $this->lireOctets((int) $taille[1]);
            }
        }
    }

    private function lireLigne(): string
    {
        \assert(is_resource($this->flux));
        $ligne = fgets($this->flux);
        if ($ligne === false) {
            throw new \RuntimeException('La boîte ne répond plus.');
        }

        return rtrim($ligne, "\r\n");
    }

    private function lireOctets(int $taille): string
    {
        \assert(is_resource($this->flux));
        $contenu = '';
        while (strlen($contenu) < $taille) {
            $bloc = fread($this->flux, min(65536, $taille - strlen($contenu)));
            if ($bloc === false || ($bloc === '' && feof($this->flux))) {
                throw new \RuntimeException('La boîte ne répond plus.');
            }
            if ($bloc === '' && stream_get_meta_data($this->flux)['timed_out']) {
                throw new \RuntimeException('La boîte ne répond plus.');
            }
            $contenu .= $bloc;
        }

        return $contenu;
    }

    private static function chaine(string $valeur): string
    {
        if (preg_match('/[\r\n\0]/', $valeur) === 1) {
            throw new \RuntimeException('Réglage de la boîte invalide.');
        }

        return '"' . addcslashes($valeur, '\\"') . '"';
    }

    private static function uid(string $uid): string
    {
        if (preg_match('/^\d+$/', $uid) !== 1) {
            throw new \RuntimeException('Identifiant de mail invalide.');
        }

        return $uid;
    }
}
