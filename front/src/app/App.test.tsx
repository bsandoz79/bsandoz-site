import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it("affiche l'accueil avec le routeur du navigateur", () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
