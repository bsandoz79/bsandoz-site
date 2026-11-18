import { act, render } from '@testing-library/react';
import { DUREE_ECRAN_MS, ecransTelephone } from '../../../data/accueil';
import { HeroDemo } from './HeroDemo';

describe('HeroDemo', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('fait défiler les sites sur l’écran du téléphone, avec leur nom, et reste décoratif', () => {
    vi.useFakeTimers();
    const { container } = render(<HeroDemo />);
    const scene = container.firstElementChild as HTMLElement;
    expect(scene).toHaveAttribute('aria-hidden', 'true');
    expect(scene.querySelectorAll('img[width="400"]')).toHaveLength(ecransTelephone.length);
    expect(scene).toHaveTextContent(ecransTelephone[0].nom);

    act(() => vi.advanceTimersByTime(DUREE_ECRAN_MS));
    expect(scene).toHaveTextContent(ecransTelephone[1].nom);
    expect(scene).toHaveTextContent('Démo');

    act(() => vi.advanceTimersByTime(DUREE_ECRAN_MS * (ecransTelephone.length - 1)));
    expect(scene).toHaveTextContent(ecransTelephone[0].nom);
  });

  it('ne bouge pas si l’utilisateur réduit les animations', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', (requete: string) => ({ matches: requete.includes('reduce') }));
    const { container } = render(<HeroDemo />);
    act(() => vi.advanceTimersByTime(DUREE_ECRAN_MS * 3));
    expect(container).toHaveTextContent(ecransTelephone[0].nom);
  });

  it('le kebab est annoncé comme un exemple', () => {
    expect(ecransTelephone.find((e) => e.id === 'kebab')?.type).toBe('Exemple');
  });
});
