import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CLE_CONSENTEMENT, reinitialiserConsentement } from '../../app/consentement';
import { bandeau } from '../../data/consentement';
import { pages } from '../../data/pages';
import { BandeauCookies } from './BandeauCookies';

function renderBandeau(chemin = '/') {
  return render(
    <MemoryRouter initialEntries={[chemin]}>
      <BandeauCookies />
    </MemoryRouter>,
  );
}

const region = () => screen.queryByRole('region', { name: bandeau.label });

describe('BandeauCookies', () => {
  beforeEach(() => {
    window.localStorage.clear();
    reinitialiserConsentement();
  });

  it('s’affiche à la première visite, avec un lien vers la politique de confidentialité', () => {
    renderBandeau();
    expect(region()).toHaveTextContent('OpenStreetMap');
    expect(screen.getByRole('link', { name: bandeau.enSavoirPlus.label })).toHaveAttribute('href', pages.confidentialite.path);
  });

  it('n’est pas une fenêtre bloquante : ni dialogue, ni focus capturé', () => {
    renderBandeau();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(document.body);
  });

  it.each([
    [bandeau.accepter, 'accepte'],
    [bandeau.refuser, 'refuse'],
  ])('« %s » enregistre le choix et ferme le bandeau', async (bouton, choix) => {
    const user = userEvent.setup();
    renderBandeau();
    await user.click(screen.getByRole('button', { name: bouton }));
    expect(region()).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(CLE_CONSENTEMENT)!).choix).toBe(choix);
  });

  it('la croix ferme pour cette visite seulement', async () => {
    const user = userEvent.setup();
    const { unmount } = renderBandeau();
    await user.click(screen.getByRole('button', { name: bandeau.fermer }));
    expect(region()).not.toBeInTheDocument();
    unmount();

    act(() => reinitialiserConsentement()); // rechargement
    renderBandeau();
    expect(region()).toBeInTheDocument();
  });

  it('se place au-dessus de la barre mobile seulement là où elle est affichée', () => {
    const { unmount } = renderBandeau('/');
    expect(region()!.className).toMatch(/auDessusBarre/);
    unmount();
    renderBandeau(pages.composer.path);
    expect(region()!.className).not.toMatch(/auDessusBarre/);
  });
});
