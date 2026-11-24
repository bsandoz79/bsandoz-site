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

  it('carte bancaire et Klarna ont leur pastille', () => {
    render(<MoyensPaiement label="Paiements" moyens={['cb', 'klarna']} />);
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Carte bancaireCarte bancaire', 'Klarna.Klarna']);
  });

  it('avec une adresse, la pastille ouvre le site officiel dans un nouvel onglet', () => {
    render(<MoyensPaiement label="Paiements" moyens={['klarna', 'virement']} liens={{ klarna: 'https://www.klarna.com/fr/' }} />);
    const lien = screen.getByRole('link', { name: 'Klarna, site officiel (nouvel onglet)' });
    expect(lien).toHaveAttribute('href', 'https://www.klarna.com/fr/');
    expect(lien).toHaveAttribute('target', '_blank');
    expect(lien).toHaveAttribute('rel', 'noopener noreferrer');
    // Sans adresse : une simple pastille.
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});
