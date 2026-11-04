import { render, screen, within } from '@testing-library/react';
import { Stepper } from './Stepper';

const steps = ['Activité', 'Besoins', 'Coordonnées'];

describe('Stepper', () => {
  it('marque l’étape en cours et les étapes terminées', () => {
    render(<Stepper label="Étapes" steps={steps} current={1} />);
    const items = within(screen.getByRole('list', { name: 'Étapes' })).getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Activité (terminée)');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).not.toHaveAttribute('aria-current');
  });

  it('règle la barre de progression', () => {
    const { container, rerender } = render(<Stepper label="Étapes" steps={steps} current={0} />);
    const racine = container.firstChild as HTMLElement;
    expect(racine.style.getPropertyValue('--stepper-progress')).toBe('0%');
    rerender(<Stepper label="Étapes" steps={steps} current={2} />);
    expect(racine.style.getPropertyValue('--stepper-progress')).toBe('100%');
  });
});
