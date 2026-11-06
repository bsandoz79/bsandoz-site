import { act, renderHook } from '@testing-library/react';
import { SEUIL_HAUT, useMasquageAuDefilement } from './useMasquageAuDefilement';

/** Fait défiler la page jusqu'à `y` et exécute immédiatement la mesure. */
function defiler(y: number) {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('useMasquageAuDefilement', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (rappel: FrameRequestCallback) => {
      rappel(0);
      return 0;
    });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('se cache en descendant et revient dès qu’on remonte', () => {
    const { result } = renderHook(() => useMasquageAuDefilement(false));
    expect(result.current).toEqual({ masque: false, decolle: false });

    defiler(400);
    expect(result.current).toEqual({ masque: true, decolle: true });

    defiler(350);
    expect(result.current.masque).toBe(false);

    defiler(900);
    expect(result.current.masque).toBe(true);
  });

  it('reste visible en haut de page', () => {
    const { result } = renderHook(() => useMasquageAuDefilement(false));
    defiler(SEUIL_HAUT - 10);
    expect(result.current.masque).toBe(false);
  });

  it('ignore les tout petits mouvements', () => {
    const { result } = renderHook(() => useMasquageAuDefilement(false));
    defiler(400);
    defiler(396);
    expect(result.current.masque).toBe(true);
  });

  it('reste visible quand il est bloqué (menu ouvert, focus clavier)', () => {
    const { result, rerender } = renderHook(({ bloque }) => useMasquageAuDefilement(bloque), { initialProps: { bloque: true } });
    defiler(600);
    expect(result.current.masque).toBe(false);
    rerender({ bloque: false });
    expect(result.current.masque).toBe(true);
  });
});
