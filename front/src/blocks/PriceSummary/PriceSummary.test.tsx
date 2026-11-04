import { render, screen, within } from '@testing-library/react';
import { PriceSummary } from './PriceSummary';

describe('PriceSummary', () => {
  it('affiche le total dans une zone annoncée et le détail des lignes', () => {
    render(
      <PriceSummary
        title="Votre estimation"
        eyebrow="Artisan"
        total="1 539 €"
        caption="3 à 6 semaines"
        lines={[
          { label: 'Site', amount: '989 €' },
          { label: 'Rendez-vous', amount: '400 €' },
        ]}
        footnote="Indicatif."
      />,
    );
    const summary = screen.getByRole('complementary', { name: 'Votre estimation' });
    const total = within(summary).getByText('1 539 €');
    expect(total).toHaveAttribute('aria-live', 'polite');
    expect(within(summary).getAllByRole('listitem')).toHaveLength(2);
    expect(summary).toHaveTextContent('Artisan');
    expect(summary).toHaveTextContent('3 à 6 semaines');
    expect(summary).toHaveTextContent('Indicatif.');
  });

  it('barre les lignes offertes et les signale par écrit', () => {
    render(
      <PriceSummary title="Estimation" total="100 €" lines={[{ label: 'Avis', amount: '60 €', free: true }]} freeLabel="Offert" />,
    );
    const line = screen.getByRole('listitem');
    expect(line).toHaveTextContent('Avis · Offert');
    expect(line.querySelector('s')).toHaveTextContent('60 €');
  });

  it('affiche son contenu libre et n’affiche pas de liste vide', () => {
    render(
      <PriceSummary title="Estimation" total="99 €">
        <a href="/devis">Recevoir mon devis</a>
      </PriceSummary>,
    );
    expect(screen.getByRole('link', { name: 'Recevoir mon devis' })).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
