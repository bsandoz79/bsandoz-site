import { ContactRapide } from '../../components/ContactRapide';
import { PageMeta } from '../../components/PageMeta';
import { StructuredData } from '../../components/StructuredData';
import { pages } from '../../data/pages';
import { jsonLdEntreprise } from '../../data/seo';
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
      <StructuredData data={jsonLdEntreprise()} />
      <Hero />
      <Metiers />
      <Problemes />
      <Offres />
      <Realisations />
      <Methode />
      <Pourquoi />
      <ContactRapide />
    </>
  );
}
