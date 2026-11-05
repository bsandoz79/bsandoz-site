import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptionCard } from './OptionCard';

describe('OptionCard', () => {
  it('rend une case à cocher nommée, avec description et prix', () => {
    render(
      <OptionCard title="Galerie photos" description="En images." price="+ 80 €" checked={false} onChange={() => {}} />,
    );
    const checkbox = screen.getByRole('checkbox', { name: /Galerie photos/ });
    expect(checkbox).not.toBeChecked();
    expect(screen.getByText('En images.')).toBeInTheDocument();
    expect(screen.getByText('+ 80 €')).toBeInTheDocument();
  });

  it('se coche en cliquant n’importe où sur la carte', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OptionCard title="Logo" description="Une identité." checked={false} onChange={onChange} />);
    await user.click(screen.getByText('Une identité.'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('se décoche au clavier avec la barre d’espace', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OptionCard title="Logo" checked onChange={onChange} />);
    screen.getByRole('checkbox').focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('checkbox').closest('label')).toHaveClass('checked');
  });

  it('peut être affichée sans être sélectionnable, avec une mention', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OptionCard title="Réseau" badge="Bientôt disponible" checked={false} onChange={onChange} disabled />);
    await user.click(screen.getByText('Réseau'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(screen.getByText('Bientôt disponible')).toBeInTheDocument();
  });
});
