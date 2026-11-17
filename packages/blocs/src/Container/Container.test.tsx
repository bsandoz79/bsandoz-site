import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('rend une div avec la largeur normale par défaut', () => {
    render(<Container>Contenu</Container>);
    const container = screen.getByText('Contenu');
    expect(container.tagName).toBe('DIV');
    expect(container).toHaveClass('container', 'md');
  });

  it('rend la balise demandée et transmet les attributs', () => {
    render(
      <Container as="nav" aria-label="Navigation principale">
        Liens
      </Container>,
    );
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
    expect(nav).toHaveTextContent('Liens');
  });

  it('applique la largeur étroite et une classe supplémentaire', () => {
    render(
      <Container size="narrow" className="extra">
        Texte
      </Container>,
    );
    expect(screen.getByText('Texte')).toHaveClass('container', 'narrow', 'extra');
  });

  it('prend toute la largeur de l’écran', () => {
    render(<Container size="full">Bandeau</Container>);
    expect(screen.getByText('Bandeau')).toHaveClass('container', 'full');
  });
});
