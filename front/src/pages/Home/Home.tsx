import { BlocModifiable } from '../../components/BlocModifiable';
import { CarteZones } from '../../components/CarteZones';
import { ContactRapide } from '../../components/ContactRapide';
import { PageMeta } from '../../components/PageMeta';
import { StructuredData } from '../../components/StructuredData';
import { pages } from '../../data/pages';
import { questionsFaq } from '../../data/faq';
import { jsonLdEntreprise, jsonLdFaq } from '../../data/seo';
import { Autonomie } from './sections/Autonomie';
import { Comparatif } from './sections/Comparatif';
import { Faq } from './sections/Faq';
import { Hero } from './sections/Hero';
import { Metiers } from './sections/Metiers';
import { Methode } from './sections/Methode';
import { Realisations } from './sections/Realisations';

/** Page d'accueil : un site que le client modifie lui-même, les réalisations, la méthode, le comparatif, le contact. */
export function Home() {
  return (
    <>
      <PageMeta title={pages.accueil.title} description={pages.accueil.description} />
      <StructuredData data={jsonLdEntreprise()} />
      <StructuredData data={jsonLdFaq(questionsFaq)} />
      <BlocModifiable id="accueil.hero">
        <Hero />
      </BlocModifiable>
      <BlocModifiable id="accueil.metiers">
        <Metiers />
      </BlocModifiable>
      <BlocModifiable id="accueil.autonomie">
        <Autonomie />
      </BlocModifiable>
      <BlocModifiable id="accueil.realisations">
        <Realisations />
      </BlocModifiable>
      <BlocModifiable id="accueil.methode">
        <Methode />
      </BlocModifiable>
      <BlocModifiable id="accueil.comparatif">
        <Comparatif />
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
