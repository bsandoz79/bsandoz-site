# Pages de contenu

## À quoi ça sert
Présenter l'offre et rassurer : accueil, quatre pages métier, réalisations, à propos, FAQ, informatique sur place, pages légales.

## Schéma
```mermaid
flowchart LR
  subgraph data["src/data/"]
    accueil[accueil.ts]
    metiers[metiers.ts]
    real[realisations.ts]
    apropos[apropos.ts]
    faq[faq.ts]
    info[informatique.ts]
    legal[legal.ts]
  end
  accueil --> Home["pages/Home<br/>(une section = un composant)"]
  real --> Home
  metiers --> Metier["pages/Metier (id)"]
  real --> Metier
  real --> Realisations["pages/Realisations"]
  apropos --> APropos["pages/APropos"]
  faq --> Faq["pages/Home/sections/Faq<br/>(section faq de l'accueil)"]
  info --> Informatique["pages/Informatique"]
  legal --> Legal["pages/Legal (id)"]
```

## Comment l'appeler
| Page | Adresse | Composant | Contenus |
| --- | --- | --- | --- |
| Accueil | `/` | `pages/Home` (sections dans `sections/`) | `data/accueil.ts` |
| Métiers | `/site-artisan`, `/site-ecommerce`, `/site-restaurant`, `/site-independant` | `<Metier id="artisan" />` | `data/metiers.ts` |
| Réalisations | `/realisations#<id>` | `pages/Realisations` | `data/realisations.ts` |
| À propos | `/a-propos` | `pages/APropos` | `data/apropos.ts` |
| FAQ | `/#faq` (l'ancienne adresse `/faq` y redirige) | `pages/Home/sections/Faq` (bloc `Accordion`) | `data/faq.ts` (`questionsFaq`, `faqAccueil`) |
| Informatique | `/informatique` | `pages/Informatique` | `data/informatique.ts` |
| Légal | `/mentions-legales`, `/cgv`, `/confidentialite` | `<Legal id="cgv" />` | `data/legal.ts` |

## Règles de contenu
- Rien d'inventé : avis, chiffres, résultats, parcours, captures restent en `[à compléter]`.
- Les prix et délais affichés (FAQ, CGV, métiers) sont lus dans `data/offres.ts`.

## Réutilisable ?
Les pages sont propres au site ; les blocs utilisés (`Card`, `SectionTitle`, `Reveal`, `Accordion`, `RotatingWords`, `Marquee`…) sont réutilisables, et `pages/Metier` / `pages/Legal` sont déjà des gabarits paramétrés.

## Tests
- **fonctionnels** : `Home.test.tsx`, `Metier.test.tsx`, `Realisations.test.tsx`, `APropos.test.tsx`, `Informatique.test.tsx`, `Legal.test.tsx`.

## Réalisations
`/realisations` liste les projets en cartes (`components/RealisationCard`, couverture = première capture). Chaque carte mène à `/realisations/<projet>` (`pages/Realisation`), qui n'affiche que ce projet. Données : `data/realisations.ts` (captures WebP dans `src/assets/realisations/`), identifiants pour le plan du site : `data/realisationsIds.ts`.

## FAQ sur l'accueil
La FAQ est une section de l'accueil, en bas, juste avant la carte des zones (`id="faq"`). Elle montre 3 questions, puis 3 de plus à chaque clic sur « Voir plus de questions (n restantes) ». Après chaque clic, le focus clavier passe à la première nouvelle question. Le lien « Questions fréquentes » du pied de page mène à `/#faq` (`lienFaq`). L'ancienne adresse `/faq` y redirige, ce qui garde valables les liens déjà partagés. Elle est retirée du plan du site. Les données structurées FAQPage sont maintenant sur l'accueil. Le nombre de questions par paquet se règle dans `faqAccueil.parPaquet`.

Tests : dans `Home.test.tsx` (« Questions fréquentes ») :
- place de la section et ancre ;
- 3 questions, puis 3 de plus, et le focus ;
- réponse dépliée ;
- redirection de `/faq`.
