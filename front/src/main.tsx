import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { preparerPrix } from './data/prixEnLigne';
import './index.css';

// Les pages sont chargées après les prix : plusieurs textes les calculent une seule fois, au chargement du code.
void preparerPrix().then(async () => {
  const { App } = await import('./app/App');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
