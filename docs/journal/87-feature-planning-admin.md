# Planning et statistiques du back-office

Branche `feature/planning-admin` · 2026-11-06

## Ce qui a été fait
- **Onglet Planning**, ouvert par défaut dans `/admin` : la semaine avec les rendez-vous placés à leur heure (inspiré de l'espace pro d'O'RDV), navigation et bouton « Aujourd'hui », jours fermés grisés. Sur téléphone, une liste remplace la grille.
- **Détail au clic** : téléphone et e-mail cliquables, adresse, frais, activité, message.
- **Annulation par le professionnel** depuis le planning : il indique ses disponibilités réelles (obligatoires). Le client reçoit un mail qui les reprend, avec un lien pour reprendre un créneau et une réponse possible par mail. Le professionnel reçoit une copie, et le créneau redevient libre.
- **Six chiffres** (`statistiques.ts`) calculés sur les vraies données : RDV à venir sur 7 jours, RDV du mois, occupation de la semaine, annulés du mois, demandes à traiter, devis acceptés.
- **API** : `GET /backoffice/rendez-vous` et `POST /backoffice/rendez-vous/{id}/annuler`, réservés au back-office, sans jamais exposer le jeton. Port `RendezVousRepository::entre`.

## Tests
- `PlanningAdmin.test.tsx` : semaine et dates, places offertes, calcul des chiffres, affichage, navigation, détail, annulation après confirmation, échecs.
- `PlanningBackOfficeTest.php` (MySQL) : droits, période et détails sans jeton, périodes invalides, annulation.
- Lancer : `npm run test -w front -- PlanningAdmin Admin` et, dans `api/`, `docker run --rm -v "$PWD:/app" -w /app composer:2 php bin/phpunit --filter Planning`.

## Reste ouvert
- Pas de chiffre d'affaires : la liste des demandes ne donne pas le montant des devis. À ajouter si besoin.
- Essai réel après le déploiement de l'API.
