/**
 * Livraison de blocs dans le projet d'un client : copie des sources (pas d'installation),
 * pour que le site livré ne dépende ni de cette bibliothèque ni d'un accès privé.
 *
 * Fonctions pures autant que possible (seules `livrer` et `listerBlocs` touchent au disque).
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';

/** Blocs disponibles : les dossiers de `src/` qui ont un `index.ts`. */
export function listerBlocs(src) {
  return readdirSync(src)
    .filter((nom) => statSync(join(src, nom)).isDirectory() && existsSync(join(src, nom, 'index.ts')))
    .sort();
}

const estTest = (fichier) => /\.test\.(ts|tsx)$/.test(fichier);

/** Fichiers (chemins relatifs à `src/`) d'un bloc ou d'un module isolé (`motion.ts`). */
function fichiersDe(src, element, avecTests) {
  const chemin = join(src, element);
  if (existsSync(`${chemin}.ts`)) return [`${element}.ts`];
  return readdirSync(chemin)
    .filter((f) => avecTests || !estTest(f))
    .map((f) => `${element}/${f}`);
}

/** Imports relatifs qui sortent du dossier du bloc (`../motion`, `../Calendar`) : élément visé. */
export function importsExternes(code) {
  const trouves = new Set();
  for (const [, cible] of code.matchAll(/from\s+'\.\.\/([A-Za-z]+)[^']*'/g)) trouves.add(cible);
  return [...trouves];
}

/**
 * Tout ce qu'il faut copier pour les blocs demandés, dépendances comprises.
 * `lire(chemin relatif à src)` renvoie le contenu d'un fichier (injecté pour les tests).
 */
export function resoudre(blocsDemandes, disponibles, { lire, existe }, avecTests = false) {
  const inconnus = blocsDemandes.filter((b) => !disponibles.includes(b));
  if (inconnus.length) {
    throw new Error(`Bloc(s) inconnu(s) : ${inconnus.join(', ')}. Disponibles : ${disponibles.join(', ')}.`);
  }
  const elements = [];
  const aVisiter = [...blocsDemandes];
  while (aVisiter.length) {
    const element = aVisiter.shift();
    if (elements.includes(element)) continue;
    elements.push(element);
    for (const fichier of existe.fichiersDe(element, avecTests)) {
      if (!/\.(ts|tsx)$/.test(fichier)) continue;
      for (const dependance of importsExternes(lire(fichier))) {
        if (!elements.includes(dependance)) aVisiter.push(dependance);
      }
    }
  }
  return {
    blocs: elements.filter((e) => disponibles.includes(e)),
    modules: elements.filter((e) => !disponibles.includes(e)),
  };
}

/** `index.ts` du dossier livré : exporte chaque bloc copié. */
export function indexLivre(blocs) {
  return `${blocs.map((b) => `export * from './${b}';`).join('\n')}\n`;
}

/** Note de livraison : ce qui a été copié, d'où, et comment l'utiliser. */
export function noteLivraison({ blocs, modules, version, date, styles }) {
  return `# Blocs livrés

Copiés depuis la bibliothèque @bsandoz79/blocs ${version}, le ${date}.
Ce code fait partie du site : il peut être modifié librement et ne dépend d'aucun service extérieur.

## Contenu
${blocs.map((b) => `- \`${b}/\` (mode d'emploi : \`${b}/README.md\`)`).join('\n')}
${modules.map((m) => `- \`${m}.ts\` (utilisé par les blocs ci-dessus)`).join('\n')}
- \`${styles}\` : variables de design par défaut et classe \`.sr-only\`

## Utilisation
1. Importer une fois les styles de base, à l'entrée du site :
   \`import './blocs/${styles}';\`
2. Importer les blocs depuis ce dossier :
   \`import { ${blocs[0]} } from './blocs';\`
3. Adapter les couleurs et la typo en redéfinissant les variables (\`--color-rose\`, \`--color-navy\`, \`--font-display\`…) dans le \`:root\` du site.

Prérequis : React 19 et un outil qui gère les CSS Modules (Vite le fait sans réglage).
Dans les README, remplacer \`from '@bsandoz79/blocs'\` par le chemin de ce dossier.
`;
}

/** Copie les blocs demandés et leurs dépendances dans `destination`. */
export function livrer({ src, destination, blocs, avecTests = false, ecraser = false, version, date }) {
  const disponibles = listerBlocs(src);
  const acces = {
    existe: { fichiersDe: (element, tests) => fichiersDe(src, element, tests) },
    lire: (fichier) => readFileSync(join(src, fichier), 'utf8'),
  };
  const plan = resoudre(blocs, disponibles, acces, avecTests);
  const deja = [...plan.blocs, ...plan.modules].filter((e) => existsSync(join(destination, e)) || existsSync(join(destination, `${e}.ts`)));
  if (deja.length && !ecraser) {
    throw new Error(`Déjà présent dans ${destination} : ${deja.join(', ')}. Relancer avec --ecraser pour remplacer.`);
  }

  mkdirSync(destination, { recursive: true });
  const copies = [];
  for (const element of [...plan.blocs, ...plan.modules]) {
    for (const fichier of fichiersDe(src, element, avecTests)) {
      mkdirSync(dirname(join(destination, fichier)), { recursive: true });
      cpSync(join(src, fichier), join(destination, fichier));
      copies.push(fichier);
    }
  }
  const styles = 'styles/base.css';
  mkdirSync(join(destination, 'styles'), { recursive: true });
  cpSync(join(src, styles), join(destination, styles));
  copies.push(styles);
  writeFileSync(join(destination, 'index.ts'), indexLivre(plan.blocs));
  writeFileSync(join(destination, 'LIVRAISON.md'), noteLivraison({ ...plan, version, date, styles }));
  return { ...plan, copies, destination: relative(process.cwd(), destination) || basename(destination) };
}
