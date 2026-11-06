# Demandes de devis

Le formulaire de [Devis par mail](devis-par-mail.md), mais reçu par l'API : demande enregistrée et numérotée (« 2026-014 »), accusé de réception, mail au professionnel. Module `Prospect`, essayé seul.

**Seul, ce module ne fait que recevoir** : établir un devis, changer un statut ou suivre ses demandes passe par le back-office et l'[espace client](espace-client.md), qui demandent aussi le module Auth. Pour un client qui veut juste recevoir les demandes, [Devis par mail](devis-par-mail.md) est plus simple.

## Fichiers à copier
**Site** : comme [Devis par mail](devis-par-mail.md), sans `devis.php`.

**API** (marche à suivre : [L'API](commun.md#lapi)) : garder `src/Prospect/`, `src/Shared/`, `config/packages/prospect.yaml`, `migrations/Version20261105203915.php`, `migrations/Version20261106090000.php`. Retirer Booking, Auth, `src/Liaisons/` et `src/BackOffice/`.
```sh
composer remove --no-scripts symfony/password-hasher
```

## Réglages
Dans `.env.local` :
```sh
PROSPECT_EXPEDITEUR=no-reply@client.fr
PROSPECT_PROFESSIONNEL_NOM="Nom du client"
PROSPECT_PROFESSIONNEL_EMAIL=contact@client.fr
PROSPECT_URL_SITE=https://client.fr
PROSPECT_SIRET=      # vide = « [à compléter] » sur le devis
```
Pour le fil de messages par mail (facultatif, utile surtout avec l'[espace client](espace-client.md)) :
```sh
PROSPECT_BOITE_REPONSES=reponses@client.fr
PROSPECT_IMAP_HOTE=mail.client.fr
PROSPECT_IMAP_PORT=993
PROSPECT_IMAP_CHIFFREMENT=ssl
PROSPECT_IMAP_UTILISATEUR=reponses@client.fr
PROSPECT_IMAP_MOT_DE_PASSE=
PROSPECT_IMAP_DOSSIER=INBOX
```
Créer une boîte dédiée, et une tâche planifiée toutes les 5 minutes : `php bin/console prospect:relever-mails`. Sans ces réglages (mettre quand même les variables, vides), une réponse par mail va directement à l'autre personne.
Au build du site : `VITE_DEVIS_URL=https://api.client.fr/demandes`.

**À modifier dans le code** :
- `src/Prospect/Infrastructure/Pdf/DevisPdf.php` : « Création de sites web & développement » et « TVA non applicable, art. 293 B du CGI » sont écrits en dur. Ce sont **mes** mentions : un client soumis à la TVA ne peut pas les garder. Faire vérifier ses mentions obligatoires.
- `src/Prospect/Infrastructure/Mail/NotificationsProspectParMail.php` : l'accusé de réception annonce le suivi dans l'espace client. **Sans espace client, retirer cette phrase**, sinon le lien mène à une page inexistante.
- Le pré-devis : mêmes précautions que [Devis par mail](devis-par-mail.md), c'est le site qui l'envoie.

## Base de données
Trois tables, `prospect_demande`, `prospect_devis` et `prospect_message`, créées par les migrations.

## Mails
Accusé de réception à la personne, demande avec les photos au professionnel. Voir [Les mails](commun.md#les-mails).

## Domaine
`api.client.fr` : voir [Le domaine](commun.md#le-domaine).

## Vérifications finales
- [ ] Une demande avec une photo : deux mails reçus, photo jointe, numéro présent.
- [ ] Une quatrième demande dans l'heure : refusée (3 par heure et par adresse IP).
- [ ] Aucun lien mort dans les mails.
- [ ] Si le fil par mail est réglé : répondre à un mail depuis une vraie boîte, lancer `prospect:relever-mails`, et vérifier que la réponse entre dans le fil, sans la citation.
- [ ] [Vérifications communes](commun.md#vérifications-finales).

## Selon la façon de livrer
- **Autonome** : la base de ses prospects est chez lui, ainsi que la boîte des réponses et sa tâche planifiée.
- **Je gère** : une tâche planifiée et une boîte des réponses par client, sur son domaine. La base de ses prospects est chez moi, avec les obligations du RGPD. Voir [Si je gère pour lui](README.md#si-je-gère-pour-lui). Durée de conservation à fixer avec lui. [à compléter]
