# Rappels et préférence de notification

Branche `feature/rappels` · 2026-11-06

## Ce qui a été fait
- Rappel par mail la veille d'un rendez-vous : `booking:envoyer-rappels`, avec le lien pour annuler. Un rendez-vous n'est rappelé qu'une fois.
- La case « Rappels et notifications par mail » de l'espace client agit enfin : décochée, plus de rappel ni de mail « nouveau message ». Le fil reste à jour dans l'espace, et les mails importants (confirmation, devis, sécurité) partent toujours.

## À quoi ça sert
Le site promettait ce rappel et cette case, sans qu'ils fassent quoi que ce soit.

## Comment l'utiliser
Tâche planifiée une fois par jour : `php bin/console booking:envoyer-rappels`.

## Tests
- **unitaires** : `api/tests/Booking/Application/RappelsTest.php` (seulement le lendemain, annulé exclu, pas deux fois, préférence, fuseau).
- **fonctionnels** : `api/tests/Liaisons/PreferencesDuCompteTest.php` (HTTP + MySQL : rappel envoyé, case décochée, fil à jour sans mail).
- **manuel** : chaque module rejoué seul sur MariaDB (conteneur, cache de production, migrations, schéma), site client vierge reconstruit avec les fichiers de `docs/mise-en-place/`.

Lancer : voir `docs/api.md`.

## Fichiers principaux
- `api/src/Booking/Application/EnvoyerRappels.php`, `api/src/Booking/Infrastructure/Console/EnvoyerRappelsCommand.php`, `api/src/Liaisons/RappelsSelonLeCompte.php`, `api/src/Liaisons/NotificationsSelonLeCompte.php`

## Reste ouvert
- Un rendez-vous pris pour le lendemain après le passage de la commande n'a pas de rappel.
- Si l'envoi d'un rappel échoue, la commande s'arrête en erreur : le rendez-vous n'est pas marqué et sera retenté au prochain passage.
