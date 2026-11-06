import { act, render, screen } from '@testing-library/react';
import { Rideau } from './Rideau';

type Rappel = (entrees: Partial<IntersectionObserverEntry>[]) => void;
let rappel: Rappel | null = null;
const disconnect = vi.fn();
class FauxObservateur {
  constructor(r: Rappel) {
    rappel = r;
  }
  observe() {}
  disconnect = disconnect;
}

const rideau = () => screen.getByRole('img').parentElement!;

describe('Rideau', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    rappel = null;
  });

  it('reste fermé tant que la photo n’est pas à l’écran, puis s’ouvre une seule fois', () => {
    vi.stubGlobal('IntersectionObserver', FauxObservateur);
    render(
      <Rideau>
        <img src="photo.webp" alt="Baptiste Sandoz" />
      </Rideau>,
    );
    expect(rideau()).toHaveClass('anim-rideau');
    expect(rideau()).not.toHaveClass('anim-rideau--ouvert');

    act(() => rappel!([{ isIntersecting: false }]));
    expect(rideau()).toHaveAttribute('data-rideau', 'ferme');

    act(() => rappel!([{ isIntersecting: true }]));
    expect(rideau()).toHaveClass('anim-rideau--ouvert');
    expect(disconnect).toHaveBeenCalled();
  });

  it('sans IntersectionObserver, la photo est visible tout de suite', () => {
    render(
      <Rideau>
        <img src="photo.webp" alt="Baptiste Sandoz" />
      </Rideau>,
    );
    expect(rideau()).toHaveAttribute('data-rideau', 'ouvert');
  });
});
