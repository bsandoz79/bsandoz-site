import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { pages } from '../data/pages';
import { NotFound } from '../pages/NotFound';
import { Placeholder } from '../pages/Placeholder';

/**
 * Routes du site. Chaque page affiche pour l'instant un contenu provisoire ;
 * elle sera remplacée par sa vraie page dans la branche correspondante du plan.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {Object.values(pages).map((page) => (
          <Route key={page.path} path={page.path} element={<Placeholder page={page} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
