# Demande de devis

## À quoi ça sert
Recueillir une demande complète en 5 étapes (activité, besoins, projet avec ses mots, budget et délai, coordonnées), sans rien perdre en route, puis l'envoyer par e-mail à Baptiste avec un accusé de réception au visiteur, qui contient un **pré-devis automatique** (formule conseillée, fourchette de prix, délai, 3 options suggérées au plus).

## Schéma
```mermaid
sequenceDiagram
  actor V as Visiteur
  participant P as pages/Devis/Devis.tsx
  participant D as demande.ts
  participant N as Navigateur (stockage)
  participant S as api/devis.php (o2switch)
  participant M as Boîtes mail
  P->>N: chargerBrouillon() + configuration du configurateur
  loop chaque étape
    V->>P: répond, « Continuer »
    P->>D: validerEtape(etape, demande, photos)
    D-->>P: erreurs (ou aucune)
    P->>N: enregistrerBrouillon()
  end
  V->>P: « Envoyer ma demande »
  P->>D: construireEnvoi() → FormData (récapitulatif, pré-devis, piège, photos)
  D->>D: preDevis() puis texteDuPreDevis() (data/predevis.ts)
  P->>S: POST /api/devis.php
  S->>S: piège rempli ? limite par IP ? champs et photos valides ?
  S->>M: mail à contact@bsandoz.fr (+ photos)
  S->>M: accusé de réception au visiteur, avec le pré-devis
  S-->>P: { ok: true }
  P->>N: effacerBrouillon()
  P-->>V: « Merci, votre demande est envoyée ! »
```

## Chemin
| Élément | Fichier |
| --- | --- |
| Page, étapes, focus, envoi | `pages/Devis/Devis.tsx`, `pages/Devis/Etapes.tsx` |
| Validation, brouillon, récapitulatif, `FormData` | `pages/Devis/demande.ts` |
| Pré-devis (formule, fourchette, suggestions, texte) | `data/predevis.ts` (prix de `data/offres.ts` et `data/calculs.ts`) |
| Textes, besoins, budgets, délais, limites des photos | `data/devis.ts` |
| Réception et mails | `front/public/api/devis.php` (copié dans `dist/api/`) |

## Avec l'API (V3)
Une fois l'API en ligne, construire le site avec `VITE_DEVIS_URL=https://api.bsandoz.fr/demandes` : le même formulaire est alors reçu par le module Prospect (`POST /demandes`). La demande est enregistrée et numérotée (« 2026-014 »), le compte client est ouvert (lien d'activation), et le client suit sa demande, accepte son devis et le télécharge en PDF dans `/mon-espace` (`pages/MonEspace/MesDemandes.tsx`). Sans cette variable, `devis.php` continue d'envoyer la demande par mail. Détails : `api/src/Prospect/README.md`.

## Comment l'appeler
- Page : `/devis` (reprend la configuration de `/composer` si elle existe).
- Script : `POST /api/devis.php`, `multipart/form-data` : `nom`, `email`, `recapitulatif`, `predevis` (texte brut, facultatif, 3 000 caractères au plus), `site_web` (piège, vide), `photos[]` (3 au plus). Réponses : `200 {ok:true}`, `400`, `405`, `429` (trop d'envois), `500`.

## Protection
Champ piège invisible · 1 envoi par minute dans le navigateur · côté serveur 1 par minute et 3 par heure par empreinte d'IP · photos JPEG/PNG/WebP vérifiées sur leur contenu, 5 Mo max · en-têtes protégés contre l'injection.

## Réutilisable ?
- `Stepper`, `TextField` : **oui**.
- `devis.php` : adaptable à un autre site en changeant `DESTINATAIRE` et `EXPEDITEUR`.
- Le parcours lui-même est propre au site.

## Tests
- **unitaires** : `demande.test.ts` (validation de chaque étape, photos, brouillon, récapitulatif, `FormData` avec le pré-devis), `data/predevis.test.ts`.
- **fonctionnels** : `Devis.test.tsx` (progression, erreurs expliquées, retour sans perte, brouillon repris, configuration reprise, envoi réussi, échec, patienter entre deux envois).
- **manuel** : script vérifié dans un conteneur PHP 8.3 avec un faux `sendmail` (avec et sans pré-devis, pré-devis trop long tronqué, retours chariot retirés) ; l'envoi réel de mail se teste sur o2switch.

## Contact rapide
En bas de l'accueil, `components/ContactRapide` propose un formulaire court (nom, téléphone, e-mail, besoin, projet). Il envoie le même formulaire que la demande de devis, à la même adresse (`urlEnvoiDevis`) : même accusé de réception, même suivi dans l'espace client une fois l'API en ligne.
