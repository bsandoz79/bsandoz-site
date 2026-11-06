<?php

declare(strict_types=1);

namespace App\Contenu\Application;

use App\Contenu\Domain\ContenuInvalide;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Enregistre une image envoyée depuis le site, dans `public/medias`. Le type est lu dans le contenu du fichier,
 * jamais dans ce qu'annonce l'envoi, et le nom est tiré au hasard : rien d'exécutable ne peut y arriver.
 */
final class EnregistrerImage
{
    public const TAILLE_MAX = 5 * 1024 * 1024;
    private const EXTENSIONS = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

    public function __construct(
        #[Autowire('%kernel.project_dir%/public/medias')]
        private readonly string $dossier,
    ) {
    }

    /**
     * @return string nom du fichier enregistré
     *
     * @throws ContenuInvalide
     */
    public function __invoke(string $base64): string
    {
        $octets = base64_decode($base64, true);
        if ($octets === false || $octets === '') {
            throw new ContenuInvalide('Image illisible.');
        }
        if (strlen($octets) > self::TAILLE_MAX) {
            throw new ContenuInvalide('Image trop lourde (5 Mo au plus).');
        }
        $infos = @getimagesizefromstring($octets);
        $extension = $infos === false ? null : (self::EXTENSIONS[$infos['mime']] ?? null);
        if ($extension === null) {
            throw new ContenuInvalide('Format accepté : JPEG, PNG ou WebP.');
        }
        if (!is_dir($this->dossier) && !mkdir($this->dossier, 0755, true) && !is_dir($this->dossier)) {
            throw new \RuntimeException('Dossier des images impossible à créer.');
        }
        $nom = bin2hex(random_bytes(16)) . '.' . $extension;
        if (file_put_contents($this->dossier . '/' . $nom, $octets) === false) {
            throw new \RuntimeException('Image impossible à enregistrer.');
        }

        return $nom;
    }
}
