# Demandes de devis

Le formulaire de [Devis par mail](devis-par-mail.md), mais reçu par l'API : demande enregistrée et numérotée (« 2026-014 »), accusé de réception, mail au professionnel. Module `Prospect`, essayé seul.

**Ce que cela ne fait pas encore** : il n'y a pas de back-office. Établir un devis ou changer le statut d'une demande n'est possible que par du code. Pour suivre ses demandes et accepter un devis en ligne, il faut en plus l'[espace client](espace-client.md). Pour un client qui veut juste recevoir les demandes, [Devis par mail](devis-par-mail.md) est plus simple.

## Fichiers à copier
**Site** : comme [Devis par mail](devis-par-mail.md), sans `devis.php`.

**API** (marche à suivre : [L'API](commun.md#lapi)) : garder `src/Prospect/`, `src/Shared/`, `config/packages/prospect.yaml`, `migrations/Version20261105203915.php`. Retirer Booking, Auth et `src/Liaisons/`.
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
Au build du site : `VITE_DEVIS_URL=https://api.client.fr/demandes`.

**À modifier dans le code** :
- `src/Prospect/Infrastructure/Pdf/DevisPdf.php` : « Création de sites web & développement » et « TVA non applicable, art. 293 B du CGI » sont écrits en dur. Ce sont **mes** mentions : un client soumis à la TVA ne peut pas les garder. Faire vérifier ses mentions obligatoires.
- `src/Prospect/Infrastructure/Mail/NotificationsProspectParMail.php` : l'accusé de réception annonce le suivi dans l'espace client. **Sans espace client, retirer cette phrase**, sinon le lien mène à une page inexistante.
- Le pré-devis : mêmes précautions que [Devis par mail](devis-par-mail.md), c'est le site qui l'envoie.

## Base de données
Deux tables, `prospect_demande` et `prospect_devis`, créées par la migration.

## Mails
Accusé de réception à la personne, demande avec les photos au professionnel. Voir [Les mails](commun.md#les-mails).

## Domaine
`api.client.fr` : voir [Le domaine](commun.md#le-domaine).

## Vérifications finales
- [ ] Une demande avec une photo : deux mails reçus, photo jointe, numéro présent.
- [ ] Une quatrième demande dans l'heure : refusée (3 par heure et par adresse IP).
- [ ] Aucun lien mort dans les mails.
- [ ] [Vérifications communes](commun.md#vérifications-finales).

## Selon la façon de livrer
- **Autonome** : la base de ses prospects est chez lui.
- **Je gère** : la base de ses prospects est chez moi, avec les obligations du RGPD. Voir [Si je gère pour lui](README.md#si-je-gère-pour-lui). Durée de conservation à fixer avec lui. [à compléter]
