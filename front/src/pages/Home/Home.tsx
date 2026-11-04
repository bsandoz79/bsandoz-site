import { PageMeta } from '../../components/PageMeta';
import { pages } from '../../data/pages';
import { AppelAction } from './sections/AppelAction';
import { Hero } from './sections/Hero';
import { Metiers } from './sections/Metiers';
import { Methode } from './sections/Methode';
import { Offres } from './sections/Offres';
import { Pourquoi } from './sections/Pourquoi';
import { Problemes } from './sections/Problemes';
import { Realisations } from './sections/Realisations';

/** Page d'accueil (maquette `Main` et `Mobile`). */
export function Home() {
  return (
    <>
      <PageMeta title={pages.accueil.title} description={pages.accueil.description} />
      <Hero />
      <Metiers />
      <Problemes />
      <Offres />
      <Realisations />
      <Methode />
      <Pourquoi />
      <AppelAction />
    </>
  );
}
