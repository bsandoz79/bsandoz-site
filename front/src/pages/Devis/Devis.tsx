import { ContactRapide } from '../../components/ContactRapide';
import { PageMeta } from '../../components/PageMeta';
import { pages } from '../../data/pages';

/** Demande de devis : le formulaire de contact, court, avec le titre de la page. Baptiste répond avec une proposition. */
export function Devis() {
  return (
    <>
      <PageMeta title={pages.devis.title} description={pages.devis.description} />
      <ContactRapide titre={pages.devis.heading} niveau={1} />
    </>
  );
}
