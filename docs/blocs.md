# Blocs réutilisables

Liste des blocs de la bibliothèque `@bsandoz79/blocs` (`packages/blocs/src/`, mode d'emploi : `packages/blocs/README.md`). Chaque bloc a son propre `README.md`.

| Bloc | Rôle | Statut |
| --- | --- | --- |
| [`Button`](../packages/blocs/src/Button/README.md) | bouton ou lien, variantes principale, secondaire, discrète | prêt |
| [`Container`](../packages/blocs/src/Container/README.md) | conteneur centré à largeur maximale, balise au choix | prêt |
| [`RotatingWords`](../packages/blocs/src/RotatingWords/README.md) | mots qui défilent l'un après l'autre | prêt |
| [`Marquee`](../packages/blocs/src/Marquee/README.md) | bande qui défile en continu | prêt |
| [`Card`](../packages/blocs/src/Card/README.md) | carte arrondie, trois fonds, effet de survol | prêt |
| [`Reveal`](../packages/blocs/src/Reveal/README.md) | apparition en fondu au défilement | prêt |
| [`SectionTitle`](../packages/blocs/src/SectionTitle/README.md) | sur-titre, titre et introduction de section | prêt |
| [`ChoiceChips`](../packages/blocs/src/ChoiceChips/README.md) | choix unique en pastilles ou en cartes (boutons radio) | prêt |
| [`OptionCard`](../packages/blocs/src/OptionCard/README.md) | carte à cocher : titre, description, prix | prêt |
| [`PriceSummary`](../packages/blocs/src/PriceSummary/README.md) | récapitulatif de prix : total annoncé, détail, lignes offertes | prêt |
| [`SitePreview`](../packages/blocs/src/SitePreview/README.md) | aperçu dessiné d'un site d'exemple, construit depuis un modèle | prêt |
| [`Accordion`](../packages/blocs/src/Accordion/README.md) | questions dépliables (`details` / `summary`), pour une FAQ | prêt |
| [`Stepper`](../packages/blocs/src/Stepper/README.md) | barre de progression et étapes d'un parcours | prêt |
| [`TextField`](../packages/blocs/src/TextField/README.md) | champ ou zone de texte avec libellé, aide et erreur | prêt |
| [`Showcase`](../packages/blocs/src/Showcase/README.md) | vitrine de cartes qui défile en continu, pause, rangée à faire glisser si animations réduites | prêt |
| [`Autocomplete`](../packages/blocs/src/Autocomplete/README.md) | champ texte qui propose de finir le mot pendant la saisie (combobox accessible) | prêt |
| [`Calendar`](../packages/blocs/src/Calendar/README.md) | calendrier mensuel accessible, jours indisponibles, navigation clavier | prêt |
| [`MoyensPaiement`](../packages/blocs/src/MoyensPaiement/README.md) | ligne des moyens de paiement acceptés (Visa, Mastercard, Apple Pay, virement…), taille normale ou petite | prêt |

Les blocs animés s'appuient sur `packages/blocs/src/motion.ts` (`prefersReducedMotion`) pour respecter le réglage « réduire les animations ».
