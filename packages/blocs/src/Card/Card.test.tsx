import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('rend une div blanche avec marges normales par défaut', () => {
    render(<Card>Contenu</Card>);
    const card = screen.getByText('Contenu');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('card', 'surface', 'padding-md');
    expect(card).not.toHaveClass('lift');
  });

  it('rend la balise demandée et transmet les attributs', () => {
    render(
      <Card as="article" aria-label="Projet">
        Projet
      </Card>,
    );
    expect(screen.getByRole('article', { name: 'Projet' })).toBeInTheDocument();
  });

  it('applique le fond, les marges et l’effet de survol', () => {
    render(
      <Card tone="dark" padding="none" lift className="extra">
        Offre
      </Card>,
    );
    expect(screen.getByText('Offre')).toHaveClass('dark', 'padding-none', 'lift', 'extra');
  });
});
