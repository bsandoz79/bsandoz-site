# Ajouter le rendez-vous à son agenda

Branche `feature/agenda-rdv` · 2026-11-06

## Ce qui a été fait
- **Page de confirmation** : boutons « Google Agenda », « Outlook » et « Apple ou autre ».
- **Mails** (client et professionnel) : les mêmes liens. Le fichier `.ics` reste joint.
- **API** : `AgendaDuRendezVous` construit les liens ; nouvelle route `GET /rendez-vous/{id}/agenda.ics` ; la réponse de `POST /rendez-vous` contient `agenda`.
- **Sécurité** : les liens utilisent l'identifiant, pas le jeton qui permet d'annuler. Celui-ci part toujours uniquement par mail.

## Tests
- `RendezVousHttpTest` : `agenda` dans la réponse, sans jeton ; fichier téléchargé ; 404 pour un identifiant inconnu.
- `NotificationsParMailTest` : liens dans les deux mails, heures en UTC.
- `RendezVous.test.tsx` : les trois boutons de la confirmation.
- Lancer : `npm run test -w front -- RendezVous` et, dans `api/`, `docker run --rm -v "$PWD:/app" -w /app composer:2 php bin/phpunit --filter Booking`.

## Reste ouvert
- Essai réel sur Google, Outlook et un iPhone, après le déploiement de l'API.
