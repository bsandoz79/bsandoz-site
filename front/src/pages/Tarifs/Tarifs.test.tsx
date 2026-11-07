import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { complements, marche, options, prixSeoSeul } from '../../data/offres';
import { pages } from '../../data/pages';

function renderTarifs() {
  return render(
    <MemoryRouter initialEntries={[pages.tarifs.path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}


describe('Page Tarifs', () => {
  it('a son titre, sa description et les trois formules avec leur prix et leur délai', () => {
    renderTarifs();
    expect(screen.getByRole('heading', { level: 1, name: pages.tarifs.heading })).toBeInTheDocument();
    expect(document.title).toBe('Tarifs – Baptiste Sandoz');
    expect(screen.getByRole('article', { name: 'Vitrine' })).toHaveTextContent(/à partir de 99\s€.*Délai : 3 jours/);
    expect(screen.getByRole('article', { name: 'Vitrine+' })).toHaveTextContent(/à partir de 390\s€/);
    expect(screen.getByRole('article', { name: 'Fonctionnel' })).toHaveTextContent(/à partir de 989\s€/);
  });

  it('ne met pas d’effet de reflet sur les trois formules', () => {
    renderTarifs();
    for (const nom of ['Vitrine', 'Vitrine+', 'Fonctionnel']) expect(screen.getByRole('article', { name: nom })).not.toHaveClass('anim-reflet');
  });

  it('affiche à part deux compléments : page en plus, suivi mensuel avec le tarif horaire', () => {
    renderTarifs();
    const bloc = screen.getByRole('region', { name: 'Les compléments' });
    expect(within(bloc).getAllByRole('listitem')).toHaveLength(2);
    const item = (nom: string) => within(bloc).getByText(nom).closest('li')!;
    expect(item('Page supplémentaire')).toHaveTextContent(/\+ 50\s€/);
    expect(item('Suivi mensuel')).toHaveTextContent(/29\s€ \/ mois/);
    expect(item('Suivi mensuel')).toHaveTextContent(/29\s€ de l’heure, à la demande/);
    // La ligne de page n'est plus répétée dans les cartes.
    expect(screen.getByRole('article', { name: 'Vitrine' })).not.toHaveTextContent('Page supplémentaire');
  });

  it('met en avant à part le référencement seul, avec le prix du marché et sa source', () => {
    renderTarifs();
    const seo = screen.getByRole('region', { name: 'Vous avez déjà un site ?' });
    expect(seo).toHaveTextContent('− 20 % sur le prix du marché');
    expect(seo).toHaveTextContent(/400\s€/);
    expect(seo).toHaveTextContent(`Sur le marché : ${marche.seo.fourchette}`);
    expect(seo).toHaveTextContent(marche.seo.source);
    expect(within(seo).getByRole('link', { name: 'Faire le point sur mon site' })).toHaveAttribute('href', pages.devis.path);
  });

  it('calcule le référencement seul à 20 % sous le bas du marché, et suit le prix de la page', () => {
    expect(prixSeoSeul()).toBe(Math.round(marche.seo.bas * 0.8));
    const prixInitial = options.page.prix;
    options.page.prix = 149;
    try {
      expect(complements()[0].prix).toMatch(/\+ 149\s€/);
    } finally {
      options.page.prix = prixInitial;
    }
  });

  it('explique pourquoi le fonctionnel coûte plus cher', () => {
    renderTarifs();
    expect(screen.getByRole('complementary', { name: /Pourquoi un site fonctionnel/ })).toHaveTextContent(
      'protège les données de vos clients',
    );
  });

  it('n’a plus de simulateur : il invite à demander un devis', () => {
    renderTarifs();
    expect(screen.queryByRole('complementary', { name: 'Votre estimation' })).not.toBeInTheDocument();
    const appel = screen.getByRole('region', { name: 'Votre projet a ses particularités ?' });
    expect(within(appel).getByRole('link', { name: 'Demander un devis' })).toHaveAttribute('href', pages.devis.path);
  });

  it('présente l’après mise en ligne', () => {
    renderTarifs();
    const apres = screen.getByRole('region', { name: 'Et après la mise en ligne ?' });
    expect(apres).toHaveTextContent("29 € de l'heure, sans engagement");
    expect(apres).toHaveTextContent('29 € par mois');
  });
});
