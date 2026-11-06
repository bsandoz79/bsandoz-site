# Lien « rendez-vous » du mail de devis

Branche `fix/lien-rendez-vous-mail` · 2026-11-06

## Le problème
Au bout de la demande de devis, le mail de pré-devis proposait de prendre rendez-vous sur `https://bsandoz.fr/rendez-vous`. Le site n'est pour l'instant en ligne que sur preview.bsandoz.fr : le lien donnait une page 404.

## Ce qui a été fait
- `origineDuSite()` (`data/pages.ts`) : l'adresse du site d'où part la demande, ou l'adresse publique hors navigateur.
- Le lien du pré-devis l'utilise : il mène toujours à un site qui existe (preview aujourd'hui, bsandoz.fr ensuite).
- Le plan du site et les adresses canoniques gardent `https://bsandoz.fr`.

## Tests
- `predevis.test.ts` : le lien suit l'adresse du site, et sans navigateur on revient à l'adresse publique.
- Lancer : `npm run test -w front -- predevis`.

## Reste ouvert
- **À vérifier sur le serveur de l'API** : les liens des mails envoyés par l'API (compte, rendez-vous, espace client) viennent de `AUTH_URL_SITE`, `BOOKING_URL_PUBLIQUE` et `PROSPECT_URL_SITE` dans le `.env` du serveur. Tant que bsandoz.fr n'est pas en ligne, ils doivent valoir `https://preview.bsandoz.fr`.
- Cette fiche et la section de `docs/fonctionnalites/demande-de-devis.md` ont été ajoutées dans un second push : le script de doc avait échoué au premier.
