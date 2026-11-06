# Rendez-vous en étapes et barre mobile

Branche `feature/rdv-etapes` · 2026-11-06

## Ce qui a été fait
- **Page Rendez-vous** : chaque étape apparaît quand la précédente est validée, avec l'animation d'apparition, désactivée si l'utilisateur réduit les animations :
  1. le lieu ; pour « chez vous », le bouton « Vérifier l'adresse » (en plus de la vérification à la sortie du champ) ; le lieu est validé si l'adresse est trouvée dans les 50 km, ou si le service de vérification est indisponible ;
  2. la date et le créneau ;
  3. les coordonnées ; le bouton « Confirmer » du résumé n'apparaît qu'à cette étape.
- Revenir en arrière (changer l'adresse, le lieu, le créneau) masque les étapes suivantes sans effacer ce qui a été saisi.
- Une annonce discrète prévient les lecteurs d'écran de l'étape suivante.
- **Règle des étapes** : fonction pure `etapesRdv()` (`reservation.ts`). Une adresse « introuvable » ne permet plus de continuer, comme le disait déjà son message.
- **Barre mobile « Estimer »** :
  - masquée sur la page Rendez-vous et dans tout l'espace client (elle recouvrait le formulaire) ;
  - une réserve d'espace en bas de page évite qu'elle cache le pied de page sur téléphone.

## À quoi ça sert
Sur téléphone surtout, le visiteur n'a qu'une chose à faire à la fois.

## Tests
- **unitaires** : `etapesRdv` (visio et téléphone, adresse ok, trop loin, introuvable, géocodage indisponible, créneau) ; barre masquée sur Rendez-vous et dans l'espace client.
- **fonctionnels** : `RendezVous.test.tsx` : apparition des étapes, adresse au-delà de 50 km bloquante, étapes masquées puis rouvertes en gardant le créneau, erreurs restantes, envoi.
- **manuel** : captures à 390 px de large ; aucun débordement horizontal sur les pages principales.

Résultats : site 338 et bibliothèque 70 tests verts ; lint et build verts.

## Fichiers principaux
- `front/src/pages/RendezVous/RendezVous.tsx`, `reservation.ts`, `RendezVous.module.css`, `front/src/data/rendezvous.ts`
- `front/src/components/MobileBar/`, `front/src/data/navigation.ts`

## Reste ouvert
- **Refonte visuelle demandée** : en-tête qui se cache en descendant et réapparaît en remontant, pied de page sombre et plus compact, formulaires modernisés, une réalisation affichée seule quand on la choisit, site plus dynamique. Branches suivantes.
