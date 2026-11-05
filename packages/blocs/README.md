# @bsandoz79/blocs

Bibliothèque de blocs d'interface React réutilisables : calendrier, cartes d'options, choix en pastilles, récapitulatif de prix, aperçu de site, étapes, champs de saisie, questions dépliables, cartes, boutons…

Chaque bloc reçoit **tout** par ses propriétés (textes, données, actions) : aucun ne connaît bsandoz.fr ni un métier. Le site bsandoz.fr l'utilise, et les sites des clients peuvent l'installer.

## Installer dans un site client
Le paquet est privé, publié sur GitHub Packages.

1. Créer un jeton GitHub (Settings → Developer settings → Personal access tokens) avec le droit `read:packages`.
2. À la racine du site client, un fichier `.npmrc` (ne jamais le versionner s'il contient le jeton) :
   ```
   @bsandoz79:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```
3. Installer :
   ```sh
   GITHUB_TOKEN=<jeton> npm install @bsandoz79/blocs
   ```

Dépendances attendues dans le site : `react` et `react-dom` 19.

## Utiliser
```tsx
import { Calendar, OptionCard, aujourdhui } from '@bsandoz79/blocs';
import '@bsandoz79/blocs/styles.css'; // une seule fois, à l'entrée du site

<Calendar label="Date" month={mois} onMonthChange={setMois} value={jour} onChange={setJour} min={aujourdhui()} />
<OptionCard title="Lavage intérieur" price="+ 40 €" checked={lavage} onChange={setLavage} />
```

## Adapter les couleurs et la typo
Les blocs n'utilisent que des variables CSS. Leurs valeurs par défaut sont posées sous `:where(:root)` (priorité nulle) : il suffit de les redéfinir dans le site.
```css
:root {
  --color-rose: #1f6fb2;      /* couleur d'accent */
  --color-navy: #0b2239;      /* couleur sombre */
  --font-display: 'Poppins', sans-serif;
}
```
Liste complète : `src/styles/base.css`. Les classes des blocs sont préfixées `bsb-` : aucun conflit avec les styles du site.

## Blocs
| Bloc | Rôle |
| --- | --- |
| `Accordion` | questions dépliables (`details` / `summary`) |
| `Button`, `buttonClassName` | bouton ou lien, 3 variantes |
| `Calendar` (+ fonctions de dates) | calendrier mensuel accessible |
| `Card` | carte, 3 fonds |
| `ChoiceChips` | choix unique en pastilles ou en cartes |
| `Container` | conteneur centré |
| `Marquee` | bande défilante |
| `OptionCard` | carte à cocher |
| `PriceSummary` | récapitulatif de prix |
| `Reveal` | apparition au défilement |
| `RotatingWords` | mots qui défilent |
| `SectionTitle` | sur-titre, titre, introduction |
| `SitePreview` | aperçu dessiné d'un site d'exemple |
| `Stepper` | étapes et progression |
| `TextField` | champ avec libellé, aide et erreur |

Le mode d'emploi détaillé de chaque bloc est dans son dossier (`src/<Bloc>/README.md`).

## Développer
Depuis la racine du dépôt (espace de travail npm) :
```sh
npm run test -w packages/blocs    # tests unitaires (Vitest + Testing Library)
npm run lint -w packages/blocs
npm run build -w packages/blocs   # dist/blocs.js, dist/blocs.css, dist/types/
```
Le site bsandoz.fr utilise directement les sources (`src/`) grâce à un alias : une modification d'un bloc se voit tout de suite dans le site.

## Publier une version
1. Mettre à jour `version` dans `packages/blocs/package.json` (règle : correctif `1.0.1`, ajout compatible `1.1.0`, changement incompatible `2.0.0`) et le CHANGELOG.
2. Pousser une étiquette de la même version : `git tag blocs-v1.1.0 && git push origin blocs-v1.1.0`.
3. Le workflow « Publication de la bibliothèque de blocs » vérifie, teste, construit et publie.

Un site client reste sur sa version tant qu'on ne la change pas dans son `package.json`.
