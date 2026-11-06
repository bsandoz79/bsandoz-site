import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Calendar } from './Calendar';
import { jourDeLaSemaine, type DateIso } from './dates';

function Demo({ min = '2026-11-05', max = '2027-01-31', onChange = () => {} }: { min?: string; max?: string; onChange?: (d: string) => void }) {
  const [mois, setMois] = useState<DateIso>('2026-11-01');
  const [jour, setJour] = useState<DateIso | null>(null);
  return (
    <Calendar
      label="Date du rendez-vous"
      month={mois}
      onMonthChange={setMois}
      value={jour}
      onChange={(d) => {
        setJour(d);
        onChange(d);
      }}
      // Week-ends indisponibles.
      isDisabled={(d) => jourDeLaSemaine(d) >= 5}
      min={min}
      max={max}
      today="2026-11-05"
    />
  );
}

const jour = (nom: RegExp) => screen.getByRole('button', { name: nom });

describe('Calendar', () => {
  it('affiche le mois en grille, avec les jours de la semaine', () => {
    render(<Demo />);
    expect(screen.getByRole('grid', { name: 'Date du rendez-vous, novembre 2026' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
    expect(jour(/^jeudi 5 novembre 2026$/)).toHaveAttribute('aria-current', 'date');
  });

  it('signale les jours indisponibles ou passés et ne les choisit pas', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Demo onChange={onChange} />);
    expect(jour(/samedi 7 novembre 2026, indisponible/)).toHaveAttribute('aria-disabled', 'true');
    expect(jour(/mercredi 4 novembre 2026, indisponible/)).toBeInTheDocument();
    await user.click(jour(/samedi 7 novembre/));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('choisit un jour au clic', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Demo onChange={onChange} />);
    await user.click(jour(/^mardi 17 novembre 2026$/));
    expect(onChange).toHaveBeenCalledWith('2026-11-17');
    expect(screen.getByRole('gridcell', { selected: true })).toHaveTextContent('17');
  });

  it('n’a qu’une case tabulable et se pilote au clavier', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Demo onChange={onChange} />);
    const tabulables = screen.getAllByRole('button').filter((b) => b.closest('table') && b.tabIndex === 0);
    expect(tabulables).toHaveLength(1);
    expect(tabulables[0]).toHaveAccessibleName('jeudi 5 novembre 2026');

    tabulables[0].focus();
    await user.keyboard('{ArrowRight}');
    expect(jour(/^vendredi 6 novembre/)).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(jour(/^vendredi 13 novembre/)).toHaveFocus();
    await user.keyboard('{Home}');
    expect(jour(/^lundi 9 novembre/)).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('2026-11-09');
  });

  it('change de mois au clavier et avec les boutons, dans les bornes', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    expect(screen.getByRole('button', { name: 'Mois précédent' })).toBeDisabled();
    jour(/^jeudi 5 novembre/).focus();
    await user.keyboard('{PageDown}');
    expect(screen.getByRole('grid', { name: /décembre 2026/ })).toBeInTheDocument();
    expect(jour(/^samedi 5 décembre/)).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Mois suivant' }));
    expect(screen.getByRole('grid', { name: /janvier 2027/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mois suivant' })).toBeDisabled();
  });

  it('ne sort pas des bornes avec le clavier', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    jour(/^jeudi 5 novembre/).focus();
    await user.keyboard('{ArrowLeft}');
    expect(jour(/^jeudi 5 novembre/)).toHaveFocus();
  });

  it('signale les jours marqués, qui restent cliquables', async () => {
    const choisi = vi.fn();
    render(
      <Calendar
        label="Jours fermés"
        month="2026-11-01"
        onMonthChange={() => {}}
        value={null}
        onChange={choisi}
        isMarked={(d) => d === '2026-11-17'}
        markedLabel="fermé"
      />,
    );
    const marque = screen.getByRole('button', { name: /17 novembre 2026, fermé$/ });
    await userEvent.click(marque);
    expect(choisi).toHaveBeenCalledWith('2026-11-17');
  });
});
