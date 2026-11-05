import { act, render, screen } from '@testing-library/react';
import { RotatingWords } from './RotatingWords';

const words = ['plus de clients', 'moins d’appels', 'des devis'];

function activeWord(container: HTMLElement) {
  return container.querySelector('[data-active="true"]')?.textContent;
}

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: reduce }) as unknown as typeof window.matchMedia;
}

describe('RotatingWords', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReducedMotion(false);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('donne la liste complète aux lecteurs d’écran', () => {
    render(<RotatingWords words={words} />);
    expect(screen.getByText('plus de clients, moins d’appels, des devis')).toHaveClass('sr-only');
  });

  it('passe au mot suivant à chaque intervalle, puis recommence', () => {
    const { container } = render(<RotatingWords words={words} interval={1000} />);
    expect(activeWord(container)).toBe('plus de clients');
    act(() => vi.advanceTimersByTime(1000));
    expect(activeWord(container)).toBe('moins d’appels');
    act(() => vi.advanceTimersByTime(2000));
    expect(activeWord(container)).toBe('plus de clients');
  });

  it('reste sur le premier mot si les animations sont réduites', () => {
    mockReducedMotion(true);
    const { container } = render(<RotatingWords words={words} interval={1000} />);
    act(() => vi.advanceTimersByTime(5000));
    expect(activeWord(container)).toBe('plus de clients');
  });

  it('arrête le minuteur quand il disparaît', () => {
    const { unmount } = render(<RotatingWords words={words} />);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
