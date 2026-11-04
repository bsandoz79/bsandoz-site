import { act, render, screen } from '@testing-library/react';
import { Reveal } from './Reveal';

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: Callback;
const disconnect = vi.fn();

class FakeObserver {
  constructor(cb: Callback) {
    callback = cb;
  }
  observe = vi.fn();
  disconnect = disconnect;
}

function setMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: reduce }) as unknown as typeof window.matchMedia;
}

describe('Reveal', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    setMotion(false);
    disconnect.mockClear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('est caché puis apparaît quand il entre à l’écran, une seule fois', () => {
    render(<Reveal>Contenu</Reveal>);
    const element = screen.getByText('Contenu');
    expect(element).not.toHaveClass('visible');

    act(() => callback([{ isIntersecting: false }]));
    expect(element).not.toHaveClass('visible');

    act(() => callback([{ isIntersecting: true }]));
    expect(element).toHaveClass('visible');
    expect(disconnect).toHaveBeenCalled();
  });

  it('est visible tout de suite si les animations sont réduites', () => {
    setMotion(true);
    render(<Reveal>Contenu</Reveal>);
    expect(screen.getByText('Contenu')).toHaveClass('visible');
  });

  it('est visible tout de suite sans IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<Reveal>Contenu</Reveal>);
    expect(screen.getByText('Contenu')).toHaveClass('visible');
  });

  it('rend la balise demandée avec son délai', () => {
    render(
      <ul>
        <Reveal as="li" delay={120}>
          Élément
        </Reveal>
      </ul>,
    );
    const item = screen.getByRole('listitem');
    expect(item.style.getPropertyValue('--reveal-delay')).toBe('120ms');
  });
});
