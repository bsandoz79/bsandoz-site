# Fil de messages synchronisé avec les mails

Branche `feature/fil-messages` · 2026-11-06

## Ce qui a été fait
- « Nos échanges » dans chaque demande de l'espace client : messages du site, réponses par mail, notes d'appel.
- Chaque mail d'une demande porte une référence signée dans son objet. `prospect:relever-mails` relève la boîte en IMAP et rattache les réponses au bon fil, sans citation ni signature.
- L'autre personne est prévenue par mail. Le fil figure dans « Télécharger mes données » et s'efface avec la demande.
- Client IMAP de quelques commandes, en PHP pur, plutôt qu'une bibliothèque : la plus connue exige `ext-zip` et tire Laravel et Carbon, et l'extension `imap` n'existe plus dans PHP 8.4. Lecture des mails avec `zbateson/mail-mime-parser` (PHP pur).

## À quoi ça sert
Plus besoin de chercher dans sa boîte mail : le client et Baptiste écrivent d'où ils veulent, et tout se retrouve au même endroit.

## Comment l'utiliser
1. Créer une boîte dédiée, par exemple `reponses@bsandoz.fr`.
2. Renseigner `PROSPECT_BOITE_REPONSES` et `PROSPECT_IMAP_*` dans `.env.local`.
3. Tâche planifiée toutes les 5 minutes : `php bin/console prospect:relever-mails`.

Sans ces réglages, le fil marche sur le site, et une réponse par mail va directement à l'autre personne.

## Tests
- **unitaires** : `FilDeMessagesTest.php`, `MesDemandes.test.tsx`.
- **fonctionnels** : `DemandesHttpTest.php`.
- **vrai serveur IMAP** : `ImapEtReferencesTest.php` sur GreenMail en local (envoi SMTP, relevé, lecture sans marquer lu, marquage, contenu de 100 Ko, mauvais identifiants).
- **architecture** : le domaine reste indépendant.
- **CI** : service GreenMail ajouté.

Lancer : voir `docs/api.md`.

## Fichiers principaux
- `api/src/Prospect/` (`Domain/Message.php`, `Domain/TexteDeReponse.php`, `Application/ReleverLesReponses.php`, `Infrastructure/Imap/`), `api/src/Liaisons/EspaceDemandesController.php`, `front/src/pages/MonEspace/FilDeMessages.tsx`

## Reste ouvert
- Jamais essayé sur la vraie boîte d'o2switch ni avec de vrais logiciels de mail (Gmail, Outlook) : le retrait des citations couvre les formats courants, un format inconnu laisserait la citation dans le message.
- Les pièces jointes d'une réponse restent dans la boîte, pas dans le fil.
- Le réglage « notifications par mail » du compte est enregistré, mais aucun mail n'en tient compte, ni ceux-ci ni les autres.
