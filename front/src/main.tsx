import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { chargerContenus } from './data/contenusEnLigne';
import { preparerPrix } from './data/prixEnLigne';
// Polices hébergées avec le site (aucun appel à Google Fonts).
import '@fontsource-variable/inter';
import '@fontsource-variable/plus-jakarta-sans';
import './index.css';

// Les pages sont chargées après les prix : plusieurs textes les calculent une seule fois, au chargement du code.
// Les contenus sont demandés tout de suite, et appliqués une fois les données chargées.
const contenus = chargerContenus();

void preparerPrix().then(async () => {
  const { appliquerContenus } = await import('./data/blocs');
  appliquerContenus(await contenus);
  const { App } = await import('./app/App');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
