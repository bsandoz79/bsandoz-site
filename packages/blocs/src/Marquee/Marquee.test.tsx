import { render, screen, within } from '@testing-library/react';
import { Marquee } from './Marquee';

const items = ['Plombiers', 'Restaurants', 'Coachs'];

describe('Marquee', () => {
  it('expose une seule liste nommée aux lecteurs d’écran', () => {
    render(<Marquee label="Métiers" items={items} />);
    const list = screen.getByRole('list', { name: 'Métiers' });
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual(items);
    expect(screen.getAllByRole('list')).toHaveLength(1);
  });

  it('duplique la liste, cachée, pour boucler sans à-coup', () => {
    const { container } = render(<Marquee label="Métiers" items={items} />);
    const copy = container.querySelector('[aria-hidden="true"]');
    expect(copy).toHaveTextContent('PlombiersRestaurantsCoachs');
  });

  it('règle la durée du défilement', () => {
    const { container } = render(<Marquee label="Métiers" items={items} duration={10} />);
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--marquee-duration')).toBe('10s');
  });
});
