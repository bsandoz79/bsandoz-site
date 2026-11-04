import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it("affiche l'application", () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
