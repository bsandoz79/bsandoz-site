import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, buttonClassName } from './Button';

describe('Button', () => {
  it('rend un vrai bouton de type « button » par défaut', () => {
    render(<Button>Valider</Button>);
    const button = screen.getByRole('button', { name: 'Valider' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('accepte le type « submit »', () => {
    render(<Button type="submit">Envoyer</Button>);
    expect(screen.getByRole('button', { name: 'Envoyer' })).toHaveAttribute('type', 'submit');
  });

  it('appelle onClick au clic et au clavier', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Valider</Button>);
    await user.click(screen.getByRole('button'));
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("n'appelle pas onClick quand il est désactivé", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Valider
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('rend un lien quand href est fourni', () => {
    render(<Button href="/contact">Me contacter</Button>);
    const link = screen.getByRole('link', { name: 'Me contacter' });
    expect(link).toHaveAttribute('href', '/contact');
    expect(link).not.toHaveAttribute('type');
  });

  it('applique la variante, la taille et la pleine largeur', () => {
    render(
      <Button variant="secondary" size="lg" block>
        Voir
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('secondary', 'lg', 'block');
  });

  it('utilise la variante principale par défaut', () => {
    render(<Button>Voir</Button>);
    expect(screen.getByRole('button')).toHaveClass('primary', 'md');
  });

  it('fournit les classes pour habiller un autre élément', () => {
    expect(buttonClassName()).toBe('button primary md');
    expect(buttonClassName({ variant: 'ghost', block: true, className: 'extra' })).toBe(
      'button ghost md block extra',
    );
  });
});
