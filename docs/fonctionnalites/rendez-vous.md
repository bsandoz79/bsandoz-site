# Rendez-vous découverte

## À quoi ça sert
Réserver un rendez-vous gratuit d'une heure : chez le client (50 km autour d'Amiens), en visio ou par téléphone.

## Schéma
```mermaid
sequenceDiagram
  actor V as Visiteur
  participant P as pages/RendezVous/RendezVous.tsx
  participant R as reservation.ts
  participant G as IGN Géoplateforme
  participant C as Calendar (@bsandoz79/blocs)
  participant A as API (POST /rendez-vous)
  V->>P: lieu « Chez vous » + adresse
  P->>R: verifierAdresse(adresse)
  R->>G: GET data.geopf.fr/geocodage/search?q=…
  G-->>R: coordonnées
  R-->>P: ok / trop-loin / introuvable / erreur (+ km)
  V->>C: choisit un jour (jourDisponible)
  P->>R: creneauxDuJour(jour)
  V->>P: créneau, coordonnées, consentement, « Confirmer »
  P->>R: validerRdv() puis corpsReservation()
  P->>A: POST JSON
  A-->>P: 201 confirmé · 409 créneau pris
```

## Chemin
| Élément | Fichier |
| --- | --- |
| Page | `pages/RendezVous/RendezVous.tsx` |
| Jours, créneaux, distance, géocodage, validation, corps envoyé | `pages/RendezVous/reservation.ts` |
| Lieux, **disponibilités**, zone, textes | `data/rendezvous.ts` |
| Calendrier | `packages/blocs/src/Calendar/` (+ `dates.ts`) |

## Comment l'appeler
- Page : `/rendez-vous`.
- API (module Booking, voir [booking.md](booking.md)) : `POST {VITE_API_URL}/rendez-vous`, JSON `{ lieu, adresse|null, jour: "AAAA-MM-JJ", creneau: "HH:MM", nom, telephone, email, activite, message }`. `VITE_API_URL` vaut `https://api.bsandoz.fr` par défaut.
- Calendrier dans une autre page :
```tsx
<Calendar label="Date" month={mois} onMonthChange={setMois} value={jour} onChange={setJour}
  isDisabled={(d) => jourDeLaSemaine(d) >= 5} min={aujourdhui()} today={aujourdhui()} />
```

## Dans l'espace client
La personne connectée retrouve ses rendez-vous (par son adresse e-mail) dans `/mon-espace` : `front/src/pages/MonEspace/MesRendezVous.tsx` → `GET /espace/rendez-vous`. Elle peut ajouter un rendez-vous à son agenda (`.ics`), le déplacer (nouveau créneau, puis annulation) ou l'annuler (`POST /espace/rendez-vous/{id}/annuler`, même cas d'usage que le lien du mail). Côté API : `api/src/Liaisons/EspaceRendezVousController.php`.

## Règles
- Étapes : la date et le créneau n'apparaissent qu'une fois le lieu validé (`etapesRdv()`), les coordonnées et « Confirmer » qu'une fois le créneau choisi.
- Réservable : de demain à 60 jours, jours travaillés seulement (**à confirmer**, dans `disponibilites`).
- Créneaux d'une heure espacés de 30 minutes pour le trajet.
- Distance à vol d'oiseau depuis Amiens ; au-delà de 50 km, visio ou téléphone.
- Si le géocodage ne répond pas, la réservation reste possible (vérification manuelle).

## Rappel la veille
`php bin/console booking:envoyer-rappels`, en tâche planifiée une fois par jour. Un mail par rendez-vous, avec le lien pour annuler, sauf si la personne a décoché « Rappels et notifications par mail » dans son espace.

## Disponibilités
Réglées depuis le back-office (`/admin`, onglet « Disponibilités ») : le calendrier les lit à l'ouverture de la page (`GET /rendez-vous/disponibilites`). `data/rendezvous.ts` sert de repli si l'API ne répond pas. L'API refuse de toute façon un créneau hors règle. Voir [Back-office](back-office.md).

## Réutilisable ?
- `Calendar` : **oui** (prévu pour le kit de réservation des clients).
- `distanceKm`, `verifierAdresse` : oui, en changeant la zone.

## Tests
- **unitaires** : `Calendar.test.tsx` (grille, jours indisponibles, clavier, bornes), `dates.test.ts`, `reservation.test.ts` (jours, créneaux, distance Amiens–Abbeville, géocodage simulé dans/hors zone/introuvable/panne, validation).
- **fonctionnels** : `RendezVous.test.tsx` (date fixée, réseau simulé : adresse, jours, créneaux, confirmation, créneau pris).

## Zone et frais kilométriques
L'adresse est géocodée puis rattachée à la base la plus proche, Amiens ou Abbeville (`situer`, `data/zones.ts`).
- À 50 km ou moins : statut `ok`, déplacement gratuit.
- Au-delà : statut `hors-zone`. Le rendez-vous est accepté et le message annonce les km facturés **aller-retour** et le montant (`fraisKilometriques`), dus même si le projet ne se fait pas. Ces frais partent avec la réservation (`kmFactures`, `fraisCentimes`) : ils figurent dans les mails de confirmation, à la personne et au professionnel.

Rien n'est bloqué : la visio et le téléphone restent proposés et gratuits. Le détail du calcul est dans [pages-de-contenu.md](pages-de-contenu.md#frais-kilométriques).
