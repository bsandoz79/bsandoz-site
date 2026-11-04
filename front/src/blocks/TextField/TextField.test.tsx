import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';

describe('TextField', () => {
  it('relie le libellé, l’aide et l’erreur au champ', () => {
    render(<TextField label="E-mail" hint="Pour vous répondre." error="Adresse invalide." required />);
    const champ = screen.getByRole('textbox', { name: /E-mail/ });
    expect(champ).toHaveAccessibleDescription('Pour vous répondre. Adresse invalide.');
    expect(champ).toHaveAttribute('aria-invalid', 'true');
    expect(champ).toBeRequired();
  });

  it('n’est pas signalé invalide sans erreur', () => {
    render(<TextField label="Nom" />);
    expect(screen.getByRole('textbox', { name: 'Nom' })).not.toHaveAttribute('aria-invalid');
  });

  it('rend une zone de texte et transmet la saisie', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Projet" multiline onChange={onChange} />);
    const zone = screen.getByRole('textbox', { name: 'Projet' });
    expect(zone.tagName).toBe('TEXTAREA');
    await user.type(zone, 'ok');
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
