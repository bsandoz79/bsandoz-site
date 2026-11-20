// @vitest-environment node
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { importsExternes, indexLivre, listerBlocs, livrer, noteLivraison, resoudre } from './livraison.mjs';

const SRC = fileURLToPath(new URL('../src', import.meta.url));

describe('livraison de blocs', () => {
  let destination: string;
  beforeEach(() => {
    destination = mkdtempSync(join(tmpdir(), 'livraison-'));
  });
  afterEach(() => rmSync(destination, { recursive: true, force: true }));

  const livrerVers = (blocs: string[], options = {}) =>
    livrer({ src: SRC, destination, blocs, version: '1.0.0', date: '2026-11-05', ...options });

  it('liste les 19 blocs de la bibliothèque', () => {
    expect(listerBlocs(SRC)).toHaveLength(19);
    expect(listerBlocs(SRC)).toContain('Calendar');
  });

  it('repère les imports qui sortent du dossier du bloc', () => {
    expect(importsExternes("import { a } from '../motion';\nimport s from './X.module.css';")).toEqual(['motion']);
  });

  it('suit les dépendances, y compris en chaîne', () => {
    const fichiers: Record<string, string> = {
      'A/A.tsx': "import { b } from '../B';",
      'B/B.tsx': "import { m } from '../motion';",
      'motion.ts': '',
    };
    const acces = {
      lire: (f: string) => fichiers[f] ?? '',
      existe: { fichiersDe: (e: string) => (e === 'motion' ? ['motion.ts'] : [`${e}/${e}.tsx`]) },
    };
    expect(resoudre(['A'], ['A', 'B'], acces)).toEqual({ blocs: ['A', 'B'], modules: ['motion'] });
    expect(() => resoudre(['Z'], ['A'], acces)).toThrow(/Bloc\(s\) inconnu\(s\) : Z/);
  });

  it('copie les blocs demandés sans leurs tests, avec index, styles et note', () => {
    const resultat = livrerVers(['Calendar', 'OptionCard']);
    expect(resultat.blocs).toEqual(['Calendar', 'OptionCard']);
    expect(existsSync(join(destination, 'Calendar/Calendar.tsx'))).toBe(true);
    expect(existsSync(join(destination, 'Calendar/dates.ts'))).toBe(true);
    expect(existsSync(join(destination, 'Calendar/Calendar.module.css'))).toBe(true);
    expect(existsSync(join(destination, 'Calendar/Calendar.test.tsx'))).toBe(false);
    expect(existsSync(join(destination, 'styles/base.css'))).toBe(true);
    expect(readFileSync(join(destination, 'index.ts'), 'utf8')).toBe(indexLivre(['Calendar', 'OptionCard']));
    expect(readFileSync(join(destination, 'LIVRAISON.md'), 'utf8')).toContain('@bsandoz79/blocs 1.0.0, le 2026-11-05');
  });

  it('copie aussi le module partagé dont un bloc a besoin', () => {
    const resultat = livrerVers(['Reveal']);
    expect(resultat.modules).toEqual(['motion']);
    expect(existsSync(join(destination, 'motion.ts'))).toBe(true);
  });

  it('copie les tests sur demande', () => {
    livrerVers(['Stepper'], { avecTests: true });
    expect(existsSync(join(destination, 'Stepper/Stepper.test.tsx'))).toBe(true);
  });

  it('refuse d’écraser un bloc déjà livré, sauf demande explicite', () => {
    livrerVers(['Card']);
    writeFileSync(join(destination, 'Card/Card.tsx'), '// personnalisé pour le client');
    expect(() => livrerVers(['Card'])).toThrow(/Déjà présent.*Card.*--ecraser/);
    expect(readFileSync(join(destination, 'Card/Card.tsx'), 'utf8')).toBe('// personnalisé pour le client');
    livrerVers(['Card'], { ecraser: true });
    expect(readFileSync(join(destination, 'Card/Card.tsx'), 'utf8')).not.toContain('personnalisé');
  });

  it('rédige une note de livraison complète', () => {
    const note = noteLivraison({ blocs: ['Calendar'], modules: ['motion'], version: '1.2.0', date: '2026-12-01', styles: 'styles/base.css' });
    expect(note).toContain('- `Calendar/`');
    expect(note).toContain('- `motion.ts`');
    expect(note).toContain("import './blocs/styles/base.css';");
  });
});
