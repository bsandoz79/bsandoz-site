import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Showcase } from './Showcase';

const items = [
  { id: 'a', content: <a href="/a">Projet A</a> },
  { id: 'b', content: <a href="/b">Projet B</a> },
];

describe('Showcase', () => {
  it('expose une seule liste nommée, avec des liens atteignables une seule fois au clavier', () => {
    render(<Showcase label="Réalisations" items={items} />);
    const list = screen.getByRole('list', { name: 'Réalisations' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getAllByRole('list')).toHaveLength(1);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('duplique la liste pour boucler, cachée et inerte', () => {
    const { container } = render(<Showcase label="Réalisations" items={items} />);
    const copy = container.querySelector('ul[aria-hidden="true"]');
    expect(copy).toHaveTextContent('Projet AProjet B');
    expect(copy).toHaveAttribute('inert');
  });

  it('se met en pause et repart avec le bouton', async () => {
    const user = userEvent.setup();
    const { container } = render(<Showcase label="Réalisations" items={items} pauseLabel="Pause" playLabel="Lecture" />);
    const bouton = screen.getByRole('button', { name: 'Pause' });
    expect(bouton).toHaveAttribute('aria-pressed', 'false');
    await user.click(bouton);
    expect(screen.getByRole('button', { name: 'Lecture' })).toHaveAttribute('aria-pressed', 'true');
    expect(container.firstChild).toHaveClass(/paused/);
    await user.click(screen.getByRole('button', { name: 'Lecture' }));
    expect(container.firstChild).not.toHaveClass(/paused/);
  });

  it('règle la durée du défilement', () => {
    const { container } = render(<Showcase label="Réalisations" items={items} duration={20} />);
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--showcase-duration')).toBe('20s');
  });
});
