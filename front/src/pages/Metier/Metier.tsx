import { Link } from 'react-router-dom';
import { buttonClassName } from '../../blocks/Button';
import { Card } from '../../blocks/Card';
import { Container } from '../../blocks/Container';
import { Reveal } from '../../blocks/Reveal';
import { SectionTitle } from '../../blocks/SectionTitle';
import { SitePreview } from '../../blocks/SitePreview';
import { PageMeta } from '../../components/PageMeta';
import { RealisationCard } from '../../components/RealisationCard';
import { apercuTextes, modeleApercu } from '../../data/apercu';
import { lienComposerMetier, metierTextes, pagesMetier, type PageMetierId } from '../../data/metiers';
import { formuleParId, options, optionsParMetier, prixFormule, prixOption } from '../../data/offres';
import { pages } from '../../data/pages';
import { realisations } from '../../data/realisations';
import styles from './Metier.module.css';

type Props = { id: PageMetierId };

/** Page métier : promesse, fonctions utiles avec leur prix, exemple de site, réalisation, appel à l'action. */
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
  const lienComposer = lienComposerMetier(contenu.metier);

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
            <Link to={lienComposer} className={buttonClassName({ size: 'lg', className: 'anim-pulse' })}>
              {metierTextes.appel.composer}
            </Link>
            <Link to={metierTextes.appel.rdv.to} className={buttonClassName({ size: 'lg', variant: 'secondary' })}>
              {metierTextes.appel.rdv.label}
            </Link>
          </div>
        </Container>
      </section>

      <section className="section section--white" aria-labelledby="fonctions-titre">
        <Container className={styles.stack}>
          <SectionTitle
            id="fonctions-titre"
            eyebrow={metierTextes.fonctions.eyebrow}
            title={metierTextes.fonctions.title}
            intro={metierTextes.prix(prixFormule(formuleParId('fonctionnel')))}
          />
          <ul className={styles.grille}>
            {fonctions.map((optionId, i) => (
              <Reveal as="li" key={optionId} delay={(i % 3) * 60}>
                <Card tone="muted" className={styles.fonction}>
                  <h3 className={styles.fonctionNom}>{options[optionId].nom}</h3>
                  <p className={styles.muted}>{options[optionId].description}</p>
                  <p className={styles.prix}>{prixOption(options[optionId])}</p>
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
              eyebrow={metierTextes.exemple.eyebrow}
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
              <Link to={metierTextes.appel.rdv.to} className={`${buttonClassName({ size: 'lg' })} ${styles.outline}`}>
                {metierTextes.appel.rdv.label}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
