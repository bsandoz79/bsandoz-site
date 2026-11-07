import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';

function renderLayout() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<h1>Accueil</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('Layout', () => {
  it('assemble en-tête, contenu, pied de page et barre mobile', () => {
    renderLayout();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Accueil');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Demande de devis' })).toBeInTheDocument();
  });

  it("va jusqu'à l'ancre demandée dans l'adresse", () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    vi.mocked(window.scrollTo).mockClear();
    render(
      <MemoryRouter initialEntries={['/#cible']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<h1 id="cible">Accueil</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(scrollIntoView).toHaveBeenCalled();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("propose en premier un lien d'évitement vers le contenu", async () => {
    const user = userEvent.setup();
    renderLayout();
    await user.tab();
    const skip = screen.getByRole('link', { name: 'Aller au contenu' });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('href', `#${screen.getByRole('main').id}`);
  });
});
