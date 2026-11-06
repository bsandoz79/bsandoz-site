# Frais aller-retour, dans les mails du rendez-vous

Branche `feature/frais-aller-retour` · 2026-11-06

## Ce qui a été fait
- **Aller-retour** (`kmFactures`, `data/zones.ts`) : les km au-delà de 50 sont comptés deux fois. Exemple : 100 km de distance donnent 100 km facturés et 18,75 €. Les textes de la carte, de la page Rendez-vous et des CGV le disent.
- **Mails du rendez-vous** :
  - le site envoie `kmFactures` et `fraisCentimes` avec la réservation (`corpsReservation`), seulement chez le client et au-delà de la zone ;
  - API (module Booking) : le rendez-vous garde ces frais s'ils sont plausibles (`RendezVous::reserver`) ; colonnes `km_factures` et `frais_centimes`, migration `Version20261106130000` ;
  - mail à la personne : « Frais de déplacement : 18,00 € (96 km aller-retour au-delà des 50 km gratuits). Ils restent dus même si aucun devis n'est accepté ensuite. » La mention « gratuit » est retirée dans ce cas ;
  - mail au professionnel : une ligne « Frais de déplacement ».
- **Suivi mensuel** : « Maintenance et mises à jour de votre site » (compléments, page Tarifs).
- Fiche d'installation du module de rendez-vous mise à jour (nouvelle migration, réglages des frais).

## Tests
- **Site** :
  - `CarteZones.test.tsx` : calcul aller-retour (100 km → 100 km facturés, 18,75 €) ;
  - `RendezVous.test.tsx` : message ;
  - `reservation.test.ts` : montant, et frais envoyés seulement chez le client hors zone.
- **API** :
  - `DomaineTest` : frais gardés seulement chez le client et s'ils sont plausibles ;
  - `CasUsageTest` : frais lus, texte refusé ;
  - `NotificationsParMailTest` : frais dans les deux mails, et « gratuit » sans frais.
- **Base** : 289 tests PHPUnit verts avec MySQL 8 (2 sautés : serveur IMAP de test absent). Migrations jouées sur une base neuve, puis `doctrine:schema:validate` : schéma conforme au mapping.
- **Lancer** : `npm run test -w front` ; `docker run --rm -v "$PWD:/app" -w /app composer:2 php bin/phpunit` dans `api/`.

## Reste ouvert
- Au déploiement de l'API, la migration s'applique (`doctrine:migrations:migrate`).
