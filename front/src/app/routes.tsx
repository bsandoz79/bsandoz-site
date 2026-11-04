import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { pages } from '../data/pages';
import { APropos } from '../pages/APropos';
import { Composer } from '../pages/Composer';
import { Home } from '../pages/Home';
import { Informatique } from '../pages/Informatique';
import { Metier } from '../pages/Metier';
import { NotFound } from '../pages/NotFound';
import { Placeholder } from '../pages/Placeholder';
import { Realisations } from '../pages/Realisations';
import { Tarifs } from '../pages/Tarifs';

type PageKey = keyof typeof pages;

/** Pages déjà construites. Les autres affichent un contenu provisoire en attendant leur branche du plan. */
const builtPages: Partial<Record<PageKey, ReactElement>> = {
  accueil: <Home />,
  tarifs: <Tarifs />,
  composer: <Composer />,
  informatique: <Informatique />,
  artisan: <Metier id="artisan" />,
  ecommerce: <Metier id="ecommerce" />,
  restaurant: <Metier id="restaurant" />,
  independant: <Metier id="independant" />,
  realisations: <Realisations />,
  aPropos: <APropos />,
};

/** Routes du site, toutes sous la mise en page commune. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {(Object.keys(pages) as PageKey[]).map((key) => (
          <Route
            key={key}
            path={pages[key].path}
            element={builtPages[key] ?? <Placeholder page={pages[key]} />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
