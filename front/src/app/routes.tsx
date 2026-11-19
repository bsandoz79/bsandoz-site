import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ancienneAdresseFaq, lienFaq } from '../data/faq';
import { pages } from '../data/pages';
import { Admin } from '../pages/Admin';
import { APropos } from '../pages/APropos';
import { Devis } from '../pages/Devis';
import { Home } from '../pages/Home';
import { Informatique } from '../pages/Informatique';
import { Legal } from '../pages/Legal';
import { Metier } from '../pages/Metier';
import { ConfirmerEmail, ConfirmerSuppression, Connexion, Lien, MonEspace, MotDePasse } from '../pages/MonEspace';
import { NotFound } from '../pages/NotFound';
import { Placeholder } from '../pages/Placeholder';
import { Realisation } from '../pages/Realisation';
import { Realisations } from '../pages/Realisations';
import { RendezVous } from '../pages/RendezVous';

type PageKey = keyof typeof pages;

/** Pages déjà construites. Les autres affichent un contenu provisoire en attendant leur branche du plan. */
const builtPages: Partial<Record<PageKey, ReactElement>> = {
  accueil: <Home />,
  informatique: <Informatique />,
  artisan: <Metier id="artisan" />,
  ecommerce: <Metier id="ecommerce" />,
  restaurant: <Metier id="restaurant" />,
  independant: <Metier id="independant" />,
  batiment: <Metier id="batiment" />,
  beaute: <Metier id="beaute" />,
  liberal: <Metier id="liberal" />,
  cours: <Metier id="cours" />,
  hebergement: <Metier id="hebergement" />,
  association: <Metier id="association" />,
  evenementiel: <Metier id="evenementiel" />,
  realisations: <Realisations />,
  aPropos: <APropos />,
  devis: <Devis />,
  rendezVous: <RendezVous />,
  mentionsLegales: <Legal id="mentionsLegales" />,
  cgv: <Legal id="cgv" />,
  confidentialite: <Legal id="confidentialite" />,
  monEspace: <MonEspace />,
  connexion: <Connexion />,
  lienConnexion: <Lien />,
  motDePasse: <MotDePasse />,
  confirmerEmail: <ConfirmerEmail />,
  suppression: <ConfirmerSuppression />,
  admin: <Admin />,
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
        <Route path={`${pages.realisations.path}/:id`} element={<Realisation />} />
        {/* La FAQ est maintenant une section de l'accueil : l'ancienne adresse y mène. */}
        <Route path={ancienneAdresseFaq} element={<Navigate to={lienFaq} replace />} />
        {/* Les tarifs détaillés et l'estimation sont retirés : un seul prix « à partir de », le reste sur devis. */}
        <Route path="/tarifs" element={<Navigate to={pages.devis.path} replace />} />
        <Route path="/composer" element={<Navigate to={pages.devis.path} replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
