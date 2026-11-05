import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

const items = [
  { id: 'delais', question: 'Quels délais ?', answer: <p>Trois jours.</p> },
  { id: 'paiement', question: 'Comment payer ?', answer: <p>Acompte puis solde.</p> },
];

const details = (id: string) => document.getElementById(id) as HTMLDetailsElement;

describe('Accordion', () => {
  it('affiche les questions comme des titres, réponses repliées', () => {
    render(<Accordion items={items} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Quels délais ?',
      'Comment payer ?',
    ]);
    expect(details('delais').open).toBe(false);
  });

  it('déplie et replie une réponse au clic', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.click(screen.getByText('Comment payer ?'));
    expect(details('paiement').open).toBe(true);
    await user.click(screen.getByText('Comment payer ?'));
    expect(details('paiement').open).toBe(false);
  });

  it('ouvre la question demandée et règle le niveau des titres', () => {
    render(<Accordion items={items} defaultOpen="paiement" headingLevel={2} />);
    expect(details('paiement').open).toBe(true);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
  });
});
