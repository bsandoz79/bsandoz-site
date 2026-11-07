import { BoutonRdv } from '../../components/BoutonRdv';
import { Link } from 'react-router-dom';
import { Card, Container, Reveal, SectionTitle, SitePreview, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { RealisationCard } from '../../components/RealisationCard';
import { apercuTextes, modeleApercu } from '../../data/apercu';
import { metierTextes, pagesMetier, type PageMetierId } from '../../data/metiers';
import { options, optionsParMetier } from '../../data/offres';
import { pages } from '../../data/pages';
import { realisations } from '../../data/realisations';
import styles from './Metier.module.css';

type Props = { id: PageMetierId };

/** Page métier : promesse, fonctions utiles, exemple de site, réalisation, appel à l'action. Les prix sont dans le devis. */
export function Metier({ id }: Props) {
  const contenu = pagesMetier[id];
  const page = pages[contenu.page];
  const fonctions = optionsParMetier[contenu.metier];
  const { modele, description } = modeleApercu({
    formule: 'fonctionnel',
    metier: contenu.metier,
    options: contenu.exemple,
    precisions: {},
  });
  const realisation = realisations.find((r) => r.id === contenu.realisation);
  const lienComposer = pages.devis.path;

  return (
    <>
      <PageMeta title={page.title} description={page.description} />

      <section className={styles.hero} aria-labelledby="metier-titre">
        <Container className={styles.heroInner}>
          <p className={styles.badge}>{contenu.public}</p>
          <h1 id="metier-titre" className={styles.titre}>
            {page.heading}
          </h1>
          <p className={styles.intro}>{contenu.intro}</p>
          <div className={styles.actions}>
            <Link to={lienComposer} className={buttonClassName({ size: 'lg' })}>
              {metierTextes.appel.composer}
            </Link>
            <BoutonRdv to={metierTextes.appel.rdv.to} label={metierTextes.appel.rdv.label} />
          </div>
        </Container>
      </section>

      <section className="section section--white" aria-labelledby="fonctions-titre">
        <Container className={styles.stack}>
          <SectionTitle
            id="fonctions-titre"
            title={metierTextes.fonctions.title}
          />
          <ul className={styles.grille}>
            {fonctions.map((optionId, i) => (
              <Reveal as="li" key={optionId} delay={(i % 3) * 60}>
                <Card tone="muted" className={styles.fonction}>
                  <h3 className={styles.fonctionNom}>{options[optionId].nom}</h3>
                  <p className={styles.muted}>{options[optionId].description}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section" aria-labelledby="exemple-titre">
        <Container className={styles.colonnes}>
          <div className={styles.stack}>
            <SectionTitle
              id="exemple-titre"
              title={metierTextes.exemple.title}
              intro={metierTextes.exemple.note}
            />
            {realisation && (
              <div className={styles.realisation}>
                <p className={styles.realisationTitre}>{metierTextes.realisation.title}</p>
                <RealisationCard realisation={realisation} />
              </div>
            )}
          </div>
          <SitePreview label={apercuTextes.label} description={description} model={modele} />
        </Container>
      </section>

      <section className={styles.appel} aria-labelledby="appel-metier-titre">
        <Container>
          <div className={styles.appelBox}>
            <div className={styles.appelTexte}>
              <h2 id="appel-metier-titre" className={styles.appelTitre}>
                {metierTextes.appel.title}
              </h2>
              <p className={styles.appelIntro}>{metierTextes.appel.text}</p>
            </div>
            <div className={styles.actions}>
              <Link to={lienComposer} className={buttonClassName({ size: 'lg' })}>
                {metierTextes.appel.composer}
              </Link>
              <BoutonRdv to={metierTextes.appel.rdv.to} label={metierTextes.appel.rdv.label} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
