# Tarifs sur l'accueil et moyens de paiement cliquables

Branche `feature/tarifs-accueil` · 2026-11-24

## Ce qui a été fait
Baptiste voulait retrouver ses prix sur l'accueil, juste après « Trois façons d'avoir un site », et des moyens de paiement plus clairs.
- **Prix** : Vitrine à partir de 99 € (1 page), Vitrine+ à partir de 389 € (au lieu de 390 €), Fonctionnel à partir de 989 €.
- **Section « Les tarifs »** (`pages/Home/sections/Tarifs.tsx`) : trois cartes cliquables aux couleurs du site. Chacune mène à `/devis?formule=…`, où « Votre projet » est pré-rempli (« Formule Vitrine+ (à partir de 389 €). »), et où le visiteur choisit devis ou maquette gratuite. Sous les cartes : la page supplémentaire (+ 50 €), puis « Payable en 3 ou 4 fois sans frais » en pastille rose, les moyens de paiement et la mention TVA.
- **Haut de l'accueil** : « Sites à partir de 99 € » (`prixDepart()` = le plus petit prix des formules) ; les moyens de paiement n'y sont plus (déplacés sous les tarifs).
- **Moyens de paiement** (`data/paiement.ts`) : une seule pastille « Carte bancaire » (choix de Baptiste : Visa, Mastercard et Amex restent acceptés par Stripe, mais n'encombrent plus), Apple Pay, Google Pay, Klarna (activé par Baptiste dans Stripe), virement.
- **Pastilles cliquables** (bloc `MoyensPaiement`, prop `liens`) : chaque moyen ouvre son site officiel dans un nouvel onglet : cartes-bancaires.com, apple.com/fr/apple-pay, pay.google.com, klarna.com/fr, et la page de la Banque de France sur le virement SEPA.
- **Modification sur place** : bloc « Les tarifs » (titre, introduction, texte des cartes, les trois prix et la page en plus) ; le prix du haut de page modifiable est celui de la Vitrine.

## Tests
- Accueil : ordre des sections, cartes et liens, page en plus, paiement (Klarna cliquable, plus de Visa/Mastercard/Amex), prix de départ 99 €.
- Formulaire : formule pré-remplie, formule inconnue ignorée. Bloc `MoyensPaiement` : pastilles CB et Klarna, liens.
- Résultats : 395 tests pour le site, 91 pour les blocs ; lint et build sans erreur.
- Vérifié dans Chrome : ordinateur (thème clair) et téléphone (thème nuit), pied de page, aucun débordement.

## Fichiers principaux
- `front/src/data/offres.ts`, `front/src/data/paiement.ts`, `front/src/data/accueil.ts`, `front/src/data/blocs.ts`
- `front/src/pages/Home/sections/Tarifs.tsx` et `.module.css`, `Hero.tsx`, `front/src/components/Footer/Footer.tsx`
- `front/src/components/ContactRapide/ContactRapide.tsx`, `contact.ts`
- `packages/blocs/src/MoyensPaiement/`

## Reste ouvert
- Klarna : vérifier qu'il est bien activé dans le tableau de bord Stripe avant qu'un client veuille l'utiliser.
