import { render, screen, within } from '@testing-library/react';
import { MoyensPaiement } from './MoyensPaiement';

describe('MoyensPaiement', () => {
  it('liste les moyens demandés, dans l’ordre, nommés pour les lecteurs d’écran', () => {
    render(<MoyensPaiement label="Moyens de paiement acceptés" moyens={['visa', 'mastercard', 'applepay', 'virement']} />);
    const liste = screen.getByRole('list', { name: 'Moyens de paiement acceptés' });
    expect(within(liste).getAllByRole('listitem').map((li) => li.textContent?.replace(/^(VISA|Apple Pay|Virement)/, ''))).toEqual(['Visa', 'Mastercard', 'Apple Pay', 'Virement bancaire']);
  });

  it('n’affiche que ce qui est demandé', () => {
    render(<MoyensPaiement label="Paiements" moyens={['virement']} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByText('Visa')).not.toBeInTheDocument();
  });

  it('titre et mention facultatifs, taille réduite', () => {
    const { container } = render(<MoyensPaiement label="Paiements" moyens={['stripe']} titre="Paiement sécurisé" mention="Traité par Stripe." taille="petite" />);
    expect(screen.getByText('Paiement sécurisé')).toBeInTheDocument();
    expect(screen.getByText('Traité par Stripe.')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('petite');
  });
});
