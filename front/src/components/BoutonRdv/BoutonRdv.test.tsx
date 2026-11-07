import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { pages } from '../../data/pages';
import { BoutonRdv } from './BoutonRdv';

describe('BoutonRdv', () => {
  it('est un vrai lien vers la prise de rendez-vous, nommé par son texte seul', () => {
    render(
      <MemoryRouter>
        <BoutonRdv label="Prendre un rendez-vous gratuit" />
      </MemoryRouter>,
    );
    const lien = screen.getByRole('link', { name: 'Prendre un rendez-vous gratuit' });
    expect(lien).toHaveAttribute('href', pages.rendezVous.path);
    // L'icône de calendrier est décorative.
    expect(lien.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
