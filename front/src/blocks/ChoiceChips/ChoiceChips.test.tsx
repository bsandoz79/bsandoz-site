import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ChoiceChips } from './ChoiceChips';

const choices = [
  { value: 'artisan', label: 'Artisan' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'autre', label: 'Autre' },
];

function Demo({ onChange = () => {} }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <ChoiceChips
      legend="Votre activité"
      name="activite"
      choices={choices}
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange(v);
      }}
    />
  );
}

describe('ChoiceChips', () => {
  it('groupe les réponses sous la question', () => {
    render(<Demo />);
    const group = screen.getByRole('group', { name: 'Votre activité' });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getAllByRole('radio').every((radio) => !(radio as HTMLInputElement).checked)).toBe(true);
  });

  it('choisit une réponse au clic', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Demo onChange={onChange} />);
    await user.click(screen.getByText('Commerce'));
    expect(screen.getByRole('radio', { name: 'Commerce' })).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('commerce');
  });

  it('change de réponse avec les flèches du clavier', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('radio', { name: 'Artisan' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Commerce' })).toBeChecked();
  });

  it('affiche des cartes avec description et mise en avant', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ChoiceChips
        legend="Type de site"
        name="type"
        variant="cards"
        choices={[
          { value: 'vitrine', label: 'Vitrine', meta: '99 €', description: '1 page.' },
          { value: 'plus', label: 'Vitrine+', meta: '390 €' },
        ]}
        value={null}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('radio', { name: /^Vitrine.*99 €.*1 page\.$/ })).toBeInTheDocument();
    await user.click(screen.getByText('390 €'));
    expect(onChange).toHaveBeenCalledWith('plus');
  });

  it('peut masquer visuellement la légende', () => {
    render(<ChoiceChips legend="Question" name="q" choices={choices} value="autre" onChange={() => {}} hideLegend />);
    expect(screen.getByText('Question')).toHaveClass('sr-only');
    expect(screen.getByRole('radio', { name: 'Autre' })).toBeChecked();
  });
});
