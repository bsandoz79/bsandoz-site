import { BlocModifiable } from '../../components/BlocModifiable';
import { CarteZones } from '../../components/CarteZones';
import { ContactRapide } from '../../components/ContactRapide';
import { PageMeta } from '../../components/PageMeta';
import { StructuredData } from '../../components/StructuredData';
import { pages } from '../../data/pages';
import { questionsFaq } from '../../data/faq';
import { jsonLdEntreprise, jsonLdFaq } from '../../data/seo';
import { Chiffres } from './sections/Chiffres';
import { Cibles } from './sections/Cibles';
import { Faq } from './sections/Faq';
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
      <StructuredData data={jsonLdFaq(questionsFaq)} />
      <BlocModifiable id="accueil.hero">
        <Hero />
      </BlocModifiable>
      <BlocModifiable id="accueil.chiffres">
        <Chiffres />
      </BlocModifiable>
      <BlocModifiable id="accueil.metiers">
        <Metiers />
      </BlocModifiable>
      <BlocModifiable id="accueil.problemes">
        <Problemes />
      </BlocModifiable>
      <BlocModifiable id="accueil.offres">
        <Offres />
      </BlocModifiable>
      <BlocModifiable id="accueil.cibles">
        <Cibles />
      </BlocModifiable>
      <BlocModifiable id="accueil.realisations">
        <Realisations />
      </BlocModifiable>
      <BlocModifiable id="accueil.methode">
        <Methode />
      </BlocModifiable>
      <BlocModifiable id="accueil.pourquoi">
        <Pourquoi />
      </BlocModifiable>
      <BlocModifiable id="accueil.faq">
        <Faq />
      </BlocModifiable>
      <BlocModifiable id="accueil.carte">
        <CarteZones />
      </BlocModifiable>
      <BlocModifiable id="accueil.contact">
        <ContactRapide />
      </BlocModifiable>
    </>
  );
}
