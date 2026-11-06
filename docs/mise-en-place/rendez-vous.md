# Rendez-vous

Calendrier, créneaux, créneau pris refusé, mails avec fichier `.ics`, annulation par lien. Module `Booking`, essayé seul.

## Fichiers à copier
**Site** (marche à suivre : [Le site](commun.md#le-site)) :

| Élément | Fichiers de `front/src/` |
| --- | --- |
| Page | `pages/RendezVous/` |
| Données | `data/rendezvous.ts`, `data/pages.ts`, `data/navigation.ts`, `data/seo.ts`, `data/faq.ts`, `data/offres.ts` |
| Autres | `app/api.ts`, `components/PageMeta/` |

Blocs : `npm run livrer -- Button Calendar ChoiceChips Container TextField --vers <projet>/src/blocs`

**API** (marche à suivre : [L'API](commun.md#lapi)) : garder `src/Booking/`, `src/Shared/`, `config/packages/booking.yaml`, `migrations/Version20261105185043.php`. Retirer Auth, Prospect, `src/Liaisons/` et `src/BackOffice/`.
```sh
composer remove --no-scripts dompdf/dompdf symfony/password-hasher symfony/rate-limiter
```

## Réglages
Dans `.env.local` :
```sh
BOOKING_EXPEDITEUR=no-reply@client.fr
BOOKING_PROFESSIONNEL_NOM="Nom du client"
BOOKING_PROFESSIONNEL_EMAIL=contact@client.fr
BOOKING_URL_PUBLIQUE=https://api.client.fr
```
**Les horaires sont écrits à deux endroits, qui doivent rester identiques** :
- `config/packages/booking.yaml` : jours (lundi = 0), créneaux, durée, délai, horizon, fuseau ;
- `data/rendezvous.ts` : les mêmes, plus les lieux, la zone de déplacement (`zone`) et les textes (Amiens, 50 km, mon adresse).

Un créneau affiché par le site mais absent de l'API est refusé au moment de confirmer.

Le contrôle de l'adresse utilise le service public de l'IGN : sans clé, France seulement, à citer dans sa politique de confidentialité. S'il ne se déplace pas, retirer le lieu `chezvous`.

## Base de données
Une table, `booking_rendez_vous`, créée par la migration.

## Mails
À chaque réservation et annulation : un mail à la personne, un au professionnel. Voir [Les mails](commun.md#les-mails).

## Domaine
`api.client.fr` : voir [Le domaine](commun.md#le-domaine). Le lien d'annulation du mail mène à l'API (`BOOKING_URL_PUBLIQUE`).

## Vérifications finales
- [ ] Une réservation : deux mails reçus, avec un `.ics` qui s'ouvre dans un agenda, aux bonnes heures.
- [ ] Le même créneau une seconde fois : refusé.
- [ ] Ouvrir le lien du mail n'annule rien ; le bouton annule, et le créneau redevient libre.
- [ ] [Vérifications communes](commun.md#vérifications-finales).

## Selon la façon de livrer
- **Autonome** : tout est chez lui. Changer ses horaires demande une intervention (pas encore de back-office).
- **Je gère** : son agenda et les coordonnées de ses visiteurs sont sur mon serveur, et une panne chez moi bloque ses réservations : à annoncer. Voir [Si je gère pour lui](README.md#si-je-gère-pour-lui).
