# Maquette gratuite de la page d'accueil

Branche `feature/maquette-gratuite` · 2026-11-18

## Ce qui a été fait
Idée reprise de Roselyn Pro, choix de Baptiste : section de l'accueil (avant la FAQ) « Pas encore décidé ? Voyez d'abord votre page d'accueil ». Le visiteur répond à quelques questions et reçoit la maquette par e-mail **sous 72 h ouvrées**, gratuitement et sans engagement.
- Questions : nom, entreprise, métier (suggestions), ville, activité en deux phrases, ce que les visiteurs doivent surtout faire (devis, appel, réservation, venir sur place), style (sobre, chaleureux, moderne, haut de gamme), site actuel et téléphone facultatifs, e-mail, consentement.
- Envoi par l'API existante `POST /demandes` (rien de nouveau côté serveur) : la demande arrive dans le back-office avec le titre « Maquette gratuite · métier » et toutes les réponses dans le récapitulatif ; accusé de réception au visiteur comme pour un devis.
- Mêmes protections que le formulaire de contact : champ piège anti-robots, un envoi par minute, limite côté serveur.

## À quoi ça sert
Donner une raison de laisser ses coordonnées à ceux qui ne sont pas encore prêts à demander un devis.

## Comment l'utiliser
Textes et questions dans `front/src/data/maquette.ts`. Répondre aux demandes « Maquette gratuite » depuis le back-office, sous 72 h ouvrées.

## Tests
- `MaquetteGratuite.test.tsx` : champs obligatoires, contenu envoyé à l'API, envoi et message « 72 h ouvrées », rien n'est envoyé si un champ manque.
- `Home.test.tsx` : place de la section.

Lancer : `npm run test -w front -- MaquetteGratuite Home`

## Fichiers principaux
- `front/src/components/MaquetteGratuite/` (`MaquetteGratuite.tsx`, `.module.css`, `.test.tsx`, `index.ts`)
- `front/src/data/maquette.ts`, `front/src/pages/Home/Home.tsx`

## Reste ouvert
- L'accusé de réception envoyé au visiteur est celui d'une demande de devis : un texte propre à la maquette serait plus clair (module `Prospect` de l'API).
