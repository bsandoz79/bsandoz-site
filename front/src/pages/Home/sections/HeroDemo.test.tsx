import { act, render } from '@testing-library/react';
import { ecransTelephone, reservationDemo } from '../../../data/accueil';
import { HeroDemo } from './HeroDemo';

describe('HeroDemo', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('passe d’un site à l’autre après son défilement, avec son nom, et reste décoratif', () => {
    vi.useFakeTimers();
    const { container } = render(<HeroDemo />);
    const scene = container.firstElementChild as HTMLElement;
    expect(scene).toHaveAttribute('aria-hidden', 'true');
    expect(scene.querySelectorAll('img[width="400"]')).toHaveLength(ecransTelephone.length - 1);
    expect(scene).toHaveTextContent(ecransTelephone[0].nom);

    act(() => vi.advanceTimersByTime(ecransTelephone[0].duree));
    expect(scene).toHaveTextContent(ecransTelephone[1].nom);
  });

  it('joue la réservation fictive : rendez-vous et acompte reçus à la fin', () => {
    vi.useFakeTimers();
    const { container } = render(<HeroDemo />);
    const [rendezVous, paiement] = reservationDemo.notifications;
    act(() => vi.advanceTimersByTime(ecransTelephone[0].duree));
    expect(container).not.toHaveTextContent(paiement.label);

    act(() => vi.advanceTimersByTime(4000));
    expect(container).toHaveTextContent(rendezVous.value);
    expect(container).toHaveTextContent(paiement.value);
  });

  it('ne bouge pas si l’utilisateur réduit les animations', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', (requete: string) => ({ matches: requete.includes('reduce') }));
    const { container } = render(<HeroDemo />);
    act(() => vi.advanceTimersByTime(60_000));
    expect(container).toHaveTextContent(ecransTelephone[0].nom);
  });

  it('le kebab et la réservation sont annoncés comme des exemples', () => {
    for (const id of ['kebab', 'reservation']) expect(ecransTelephone.find((e) => e.id === id)?.type).toBe('Exemple');
  });
});
