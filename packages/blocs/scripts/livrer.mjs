#!/usr/bin/env node
/**
 * Copie des blocs (et leurs dépendances) dans le projet d'un client.
 *
 *   npm run livrer -- Calendar OptionCard --vers ../site-client/src/blocs
 *   npm run livrer -- --liste
 *
 * Options : --vers <dossier> (obligatoire), --avec-tests (copie aussi les tests), --ecraser.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listerBlocs, livrer } from './livraison.mjs';

const racine = fileURLToPath(new URL('..', import.meta.url));
const src = resolve(racine, 'src');
const args = process.argv.slice(2);

if (args.includes('--liste') || args.length === 0) {
  console.log(`Blocs disponibles : ${listerBlocs(src).join(', ')}`);
  console.log('Usage : npm run livrer -- <Bloc> [<Bloc>…] --vers <dossier> [--avec-tests] [--ecraser]');
  process.exit(args.length === 0 ? 1 : 0);
}

const indexVers = args.indexOf('--vers');
if (indexVers < 0 || !args[indexVers + 1]) {
  console.error('Indiquez le dossier de destination : --vers <dossier>');
  process.exit(1);
}
const destination = resolve(process.env.INIT_CWD ?? process.cwd(), args[indexVers + 1]);
const blocs = args.filter((a, i) => !a.startsWith('--') && i !== indexVers + 1);
const { version } = JSON.parse(readFileSync(resolve(racine, 'package.json'), 'utf8'));

try {
  const resultat = livrer({
    src,
    destination,
    blocs,
    avecTests: args.includes('--avec-tests'),
    ecraser: args.includes('--ecraser'),
    version,
    date: new Date().toISOString().slice(0, 10),
  });
  console.log(`Blocs livrés dans ${destination} :`);
  console.log(`  blocs   : ${resultat.blocs.join(', ')}`);
  if (resultat.modules.length) console.log(`  modules : ${resultat.modules.join(', ')}`);
  console.log(`  ${resultat.copies.length} fichiers, plus index.ts et LIVRAISON.md (mode d'emploi).`);
} catch (erreur) {
  console.error(erreur.message);
  process.exit(1);
}
