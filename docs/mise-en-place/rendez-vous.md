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

**API** (marche à suivre : [L'API](commun.md#lapi)) : garder `src/Booking/`, `src/Shared/`, `config/packages/booking.yaml`, `migrations/Version20261105185043.php`, `migrations/Version20261106110000.php`. Retirer Auth, Prospect, `src/Liaisons/`, `src/BackOffice/` et `src/Catalogue/`.
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
**Les horaires** :
- `config/packages/booking.yaml` : jours (lundi = 0), créneaux, durée, délai, horizon, fuseau. Le calendrier du site les lit sur l'API (`GET /rendez-vous/disponibilites`).
- `data/rendezvous.ts` : les mêmes, en repli si l'API ne répond pas, plus les lieux, la zone de déplacement (`zone`) et les textes (Amiens, 50 km, mon adresse).

Une fois installé avec le back-office de l'[espace client](espace-client.md), le client règle jours, créneaux et congés lui-même.

Le contrôle de l'adresse utilise le service public de l'IGN : sans clé, France seulement, à citer dans sa politique de confidentialité. S'il ne se déplace pas, retirer le lieu `chezvous`.

## Base de données
Deux tables, `booking_rendez_vous` et `booking_disponibilites`, créées par les migrations.

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
- **Autonome** : tout est chez lui. Sans back-office, changer ses horaires demande une intervention.
- **Je gère** : son agenda et les coordonnées de ses visiteurs sont sur mon serveur, et une panne chez moi bloque ses réservations : à annoncer. Voir [Si je gère pour lui](README.md#si-je-gère-pour-lui).
