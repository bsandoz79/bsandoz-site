# Plan de développement

Une ligne = une branche. Chaque branche : commits « un ajout = un commit », tests, doc et CHANGELOG à jour, lint + tests + build verts, push, fusion dans `main`, puis branche suivante. Cocher au fur et à mesure.

## V1 – site vitrine + configurateur (front seul)
- [x] `chore` initialisation, règles, tests, CSS segmenté, CI/CD
- [x] `feature/routing` : React Router, pages vides, page 404, titres et meta par page
- [x] `feature/layout` : blocs `Button`, `Container` ; composants `Header` (menu + onglets Sites & applis / Informatique, menu mobile), `Footer`, barre mobile « Estimer »
- [x] `feature/home` : accueil complet (hero + mots qui tournent, bande des métiers, problèmes, offres, réalisations, méthode, pourquoi moi, appel à l'action) – blocs `RotatingWords`, `Marquee`, `Card`, `Reveal` (apparition au défilement)
- [x] `feature/pricing-data` : `src/data/offres.ts` (formules, options, listes par métier, sous-questions, packs, marché) + fonctions de calcul pures (`calculerEstimation`, `packsActifs`, `suggestions`, `comparaisonMarche`) entièrement testées
- [x] `feature/tarifs` : page Tarifs
- [x] `feature/configurateur` : bloc `OptionCard`, `ChoiceChips`, `PriceSummary` (créés dès `feature/tarifs`) ; page `/composer` avec étapes, packs, marché
- [x] `feature/apercu` : bloc `SitePreview` (aperçu en direct), masqué sous 1 000 px
- [x] `feature/informatique` : onglet et page Informatique sur place (réseau « Bientôt disponible »)
- [x] `feature/metiers` : 4 pages métier
- [x] `feature/realisations-apropos-faq`
- [x] `feature/devis-front` : parcours en 5 étapes, envoi par mail (service d'envoi simple ou script PHP sur o2switch), sauvegarde locale
- [ ] `feature/legal-seo` : mentions légales, CGV, confidentialité, données structurées, sitemap, robots.txt
- [ ] Mise en ligne sur `preview.bsandoz.fr` puis `bsandoz.fr`

## V2 – rendez-vous et API
- [ ] `api` Symfony : structure modulaire, base MySQL, CI
- [ ] bloc `Calendar` réutilisable + page Rendez-vous (créneaux d'1 h, 50 km, visio, téléphone)
- [ ] module Booking, mails de confirmation, .ics
- [ ] pré-devis automatique par mail

## V3 – espace client et back-office
- [ ] Auth (compte créé automatiquement, lien d'activation, mot de passe par lien mail)
- [ ] Espace client complet (demandes, devis à accepter, compte, sécurité, confidentialité, zone danger)
- [ ] Fil de messages synchronisé avec les mails (IMAP)
- [ ] Back-office (demandes, devis, prix, disponibilités)
