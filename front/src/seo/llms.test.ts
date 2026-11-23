import { contact } from '../data/navigation';
import { formules } from '../data/offres';
import { realisations } from '../data/realisations';
import { genererLlmsTxt } from './llms';

describe('llms.txt (résumé pour les assistants IA)', () => {
  const texte = genererLlmsTxt();

  it('commence par le nom, le métier et un résumé, au format llms.txt', () => {
    const lignes = texte.split('\n');
    expect(lignes[0]).toBe('# Baptiste Sandoz – Développeur web à Amiens');
    expect(lignes[2]).toMatch(/^> /);
  });

  it('donne les coordonnées, les formules avec leur prix et toutes les réalisations', () => {
    expect(texte).toContain(contact.email);
    for (const f of formules) expect(texte).toContain(`- ${f.nom} (`);
    for (const r of realisations) expect(texte).toContain(`[${r.titre}](https://bsandoz.fr/realisations/`);
  });

  it('ne renvoie vers aucune page de l’espace client', () => {
    expect(texte).not.toContain('/mon-espace');
    expect(texte).not.toContain('/admin');
  });
});
