import { render, screen } from '@testing-library/react';
import { SectionTitle } from './SectionTitle';

describe('SectionTitle', () => {
  it('rend un titre h2 par défaut, sans sur-titre ni introduction', () => {
    const { container } = render(<SectionTitle title="Offres" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Offres' })).toBeInTheDocument();
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  it('affiche le sur-titre, l’introduction et le niveau demandé', () => {
    render(<SectionTitle level={3} id="titre" eyebrow="Méthode" title="Quatre étapes" intro="Simple." />);
    const heading = screen.getByRole('heading', { level: 3, name: 'Quatre étapes' });
    expect(heading).toHaveAttribute('id', 'titre');
    expect(screen.getByText('Méthode')).toHaveClass('eyebrow');
    expect(screen.getByText('Simple.')).toHaveClass('intro');
  });
});
