# Mise en ligne de l'API : ce qui a été vérifié

Branche `chore/doc-serveur` · 2026-11-06

## Ce qui a été fait
- `docs/mise-en-ligne.md` note ce qui a été constaté sur o2switch, à la première mise en ligne de l'API : chemin de PHP 8.3 pour le terminal et les tâches planifiées, réglage PHP du site, MariaDB 11.4, serveur de mail, erreurs masquées de `bin/console`, effet d'un changement d'adresse sur `BACKOFFICE_EMAILS`.

## Tests
Documentation seule. Vérifié depuis Internet : `/sante` et `/prix` répondent, CORS autorise preview, `.env.local` et `.env.dist` répondent 403, `composer.json` 404.

## Reste ouvert
- Tâches planifiées à créer (`prospect:relever-mails`, `booking:envoyer-rappels`).
- Bascule des devis vers l'API (`VITE_DEVIS_URL`), après un essai du rendez-vous et de l'envoi de mails.
- Relève IMAP et parcours complet à vérifier.
