<?php
/**
 * Réception d'une demande de devis (V1 : envoi simple par e-mail, cahier des charges section 6).
 * L'accusé de réception contient le pré-devis calculé par le site (champ `predevis`).
 * Déposé avec le site sur o2switch. Aucun secret ici : seules des adresses publiques.
 *
 * Réponses JSON : { ok: true } ; 400 données invalides ; 405 mauvaise méthode ; 429 trop d'envois ; 500 échec d'envoi.
 */

const DESTINATAIRE = 'contact@bsandoz.fr';
const EXPEDITEUR = 'Baptiste Sandoz <no-reply@bsandoz.fr>';
const MAX_PAR_HEURE = 3;
const DELAI_MIN_SECONDES = 60;
const MAX_PHOTOS = 3;
const TAILLE_MAX_PREDEVIS = 3000;
const TAILLE_MAX_PHOTO = 5 * 1024 * 1024;
const TYPES_PHOTOS = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function repondre(int $code, array $corps): void
{
    http_response_code($code);
    echo json_encode($corps, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Retire les retours à la ligne (protection contre l'injection d'en-têtes). */
function ligne(string $texte, int $max): string
{
    return mb_substr(trim(preg_replace('/[\r\n]+/', ' ', $texte)), 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    repondre(405, ['ok' => false]);
}

// Champ piège rempli : c'est un robot. On répond « ok » sans rien envoyer.
if (!empty($_POST['site_web'])) {
    repondre(200, ['ok' => true]);
}

// Limitation par adresse IP (empreinte, pas d'adresse stockée en clair).
$empreinte = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . __DIR__);
$fichierLimite = sys_get_temp_dir() . '/bsandoz-devis-' . $empreinte;
$maintenant = time();
$envois = [];
if (is_file($fichierLimite)) {
    $envois = array_filter(
        array_map('intval', explode(',', (string) file_get_contents($fichierLimite))),
        fn($t) => $t > $maintenant - 3600
    );
}
if (count($envois) >= MAX_PAR_HEURE || ($envois && max($envois) > $maintenant - DELAI_MIN_SECONDES)) {
    repondre(429, ['ok' => false]);
}

$nom = ligne($_POST['nom'] ?? '', 120);
$email = ligne($_POST['email'] ?? '', 200);
$recapitulatif = mb_substr(trim((string) ($_POST['recapitulatif'] ?? '')), 0, 8000);
// Pré-devis calculé par le site (front/src/data/predevis.ts) : texte brut, facultatif.
$predevis = mb_substr(trim(str_replace("\r", '', (string) ($_POST['predevis'] ?? ''))), 0, TAILLE_MAX_PREDEVIS);

if ($nom === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($recapitulatif) < 20) {
    repondre(400, ['ok' => false]);
}

// Photos : 3 au plus, 5 Mo chacune, JPEG / PNG / WebP vérifiés sur le contenu réel.
$pieces = [];
if (!empty($_FILES['photos']) && is_array($_FILES['photos']['tmp_name'])) {
    $infos = new finfo(FILEINFO_MIME_TYPE);
    foreach ($_FILES['photos']['tmp_name'] as $i => $chemin) {
        if (count($pieces) >= MAX_PHOTOS) {
            break;
        }
        if ($_FILES['photos']['error'][$i] !== UPLOAD_ERR_OK || !is_uploaded_file($chemin)) {
            continue;
        }
        $type = $infos->file($chemin);
        if (!isset(TYPES_PHOTOS[$type]) || filesize($chemin) > TAILLE_MAX_PHOTO) {
            repondre(400, ['ok' => false]);
        }
        $pieces[] = [
            'nom' => 'photo-' . ($i + 1) . '.' . TYPES_PHOTOS[$type],
            'type' => $type,
            'contenu' => file_get_contents($chemin),
        ];
    }
}

/** Envoie un e-mail texte, avec pièces jointes éventuelles. */
function envoyer(string $a, string $sujet, string $texte, string $repondreA, array $pieces = []): bool
{
    $entetes = ['From: ' . EXPEDITEUR, 'Reply-To: ' . $repondreA, 'MIME-Version: 1.0'];
    $sujetEncode = '=?UTF-8?B?' . base64_encode($sujet) . '?=';

    if (!$pieces) {
        $entetes[] = 'Content-Type: text/plain; charset=UTF-8';
        $entetes[] = 'Content-Transfer-Encoding: 8bit';
        return mail($a, $sujetEncode, $texte, implode("\r\n", $entetes));
    }

    $limite = 'bsandoz-' . bin2hex(random_bytes(12));
    $entetes[] = 'Content-Type: multipart/mixed; boundary="' . $limite . '"';
    $corps = "--$limite\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n$texte\r\n";
    foreach ($pieces as $piece) {
        $corps .= "--$limite\r\nContent-Type: {$piece['type']}; name=\"{$piece['nom']}\"\r\n"
            . "Content-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"{$piece['nom']}\"\r\n\r\n"
            . chunk_split(base64_encode($piece['contenu'])) . "\r\n";
    }
    $corps .= "--$limite--";
    return mail($a, $sujetEncode, $corps, implode("\r\n", $entetes));
}

$pourBaptiste = "Nouvelle demande de devis reçue sur bsandoz.fr\n\n" . $recapitulatif
    . ($pieces ? "\n\nPhotos jointes : " . count($pieces) : '')
    . ($predevis !== '' ? "\n\nPré-devis envoyé au client :\n\n$predevis" : '');
$pourClient = "Bonjour $nom,\n\n"
    . ($predevis !== ''
        ? "Merci pour votre demande, je l'ai bien reçue. Voici une première estimation, calculée d'après vos réponses. "
            . "Je vous réponds sous 24 h pour la confirmer ou l'ajuster.\n\n$predevis\n\n"
        : "Merci pour votre demande. Je l'ai bien reçue et je vous réponds sous 24 h avec une proposition.\n\n")
    . "Pour rappel, voici ce que vous m'avez indiqué :\n\n$recapitulatif\n\n"
    . "Pour ajouter une précision, répondez simplement à cet e-mail.\n\n"
    . "Baptiste Sandoz\nbsandoz.fr";

if (!envoyer(DESTINATAIRE, "Demande de devis : $nom", $pourBaptiste, $email, $pieces)) {
    repondre(500, ['ok' => false]);
}
$sujetClient = $predevis !== '' ? 'Votre demande de devis et une première estimation' : 'Votre demande de devis est bien reçue';
envoyer($email, $sujetClient, $pourClient, DESTINATAIRE);

$envois[] = $maintenant;
@file_put_contents($fichierLimite, implode(',', $envois), LOCK_EX);

repondre(200, ['ok' => true]);
