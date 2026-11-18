import { Link, useSearchParams } from 'react-router-dom';
import { ChoiceChips, Container, Reveal, SectionTitle, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { RealisationCard } from '../../components/RealisationCard';
import { pages } from '../../data/pages';
import { filtresRealisations, pageRealisations, type FiltreRealisation } from '../../data/realisations';
import { cartesRealisations, lireSecteur, secteurs, type Secteur } from '../../data/secteurs';
import styles from './Realisations.module.css';

/** Page Réalisations : une carte par projet ; chaque carte ouvre la page de ce seul projet. */
export function Realisations() {
  const page = pages.realisations;
  const t = pageRealisations;
  const [parametres, setParametres] = useSearchParams();
  const filtre = (filtresRealisations.find((f) => f.value === parametres.get('type'))?.value ?? 'tout') as FiltreRealisation;
  const secteur = lireSecteur(parametres.get('metier'));
  const liste = cartesRealisations(filtre, secteur);

  /** Garde l'autre filtre dans l'adresse ; « tout » et « tous » n'y figurent pas. */
  function regler(type: FiltreRealisation, metier: Secteur) {
    setParametres({ ...(type === 'tout' ? {} : { type }), ...(metier === 'tous' ? {} : { metier }) }, { replace: true });
  }

  return (
    <>
      <PageMeta title={page.title} description={page.description} />
      <section className={styles.intro} aria-labelledby="realisations-page-titre">
        <Container>
          <SectionTitle id="realisations-page-titre" level={1} title={page.heading} intro={t.intro} />
        </Container>
      </section>

      <Container className={styles.liste}>
        <div className={styles.filtre}>
          <ChoiceChips<FiltreRealisation>
            legend={t.filtre.legende}
            hideLegend
            name="filtre-realisations"
            choices={filtresRealisations}
            value={filtre}
            onChange={(valeur) => regler(valeur, secteur)}
          />
          <ChoiceChips<Secteur>
            legend={t.filtre.metier}
            hideLegend
            name="filtre-metier"
            choices={[...secteurs]}
            value={secteur}
            onChange={(valeur) => regler(filtre, valeur)}
          />
          <p className={styles.nombre} aria-live="polite">
            {t.filtre.nombre(liste.length)}
          </p>
        </div>
        {liste.length === 0 && <p className={styles.aucun}>{t.filtre.aucun}</p>}
        <ul className={styles.grille}>
          {liste.map((realisation, i) => (
            <Reveal as="li" key={realisation.id} delay={i * 80}>
              <RealisationCard realisation={realisation} headingLevel={2} />
            </Reveal>
          ))}
        </ul>
        <div className={styles.appel}>
          <p className={styles.appelTexte}>{t.appel.text}</p>
          <Link to={t.appel.to} className={buttonClassName({ size: 'lg' })}>
            {t.appel.label}
          </Link>
        </div>
      </Container>
    </>
  );
}
