import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { pages } from '../data/pages';
import { APropos } from '../pages/APropos';
import { Composer } from '../pages/Composer';
import { Devis } from '../pages/Devis';
import { Faq } from '../pages/Faq';
import { Home } from '../pages/Home';
import { Informatique } from '../pages/Informatique';
import { Legal } from '../pages/Legal';
import { Metier } from '../pages/Metier';
import { Connexion, Lien, MonEspace, MotDePasse } from '../pages/MonEspace';
import { NotFound } from '../pages/NotFound';
import { Placeholder } from '../pages/Placeholder';
import { Realisations } from '../pages/Realisations';
import { RendezVous } from '../pages/RendezVous';
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
  faq: <Faq />,
  devis: <Devis />,
  rendezVous: <RendezVous />,
  mentionsLegales: <Legal id="mentionsLegales" />,
  cgv: <Legal id="cgv" />,
  confidentialite: <Legal id="confidentialite" />,
  monEspace: <MonEspace />,
  connexion: <Connexion />,
  lienConnexion: <Lien />,
  motDePasse: <MotDePasse />,
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
