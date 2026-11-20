import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Reveal, Visionneuse, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { pageRealisations, realisationParId, realisations } from '../../data/realisations';
import { NotFound } from '../NotFound';
import styles from './Realisation.module.css';

const t = pageRealisations;

/** Page d'un seul projet : contexte, besoin, solution, fonctionnalités, captures, démo, projets voisins. */
export function Realisation() {
  const { id } = useParams();
  const realisation = realisationParId(id);
  // Capture agrandie par-dessus la page (au lieu d'un nouvel onglet) ; null : aucune.
  const [agrandie, setAgrandie] = useState<number | null>(null);
  if (!realisation) return <NotFound />;

  const rang = realisations.indexOf(realisation);
  const precedent = realisations[(rang - 1 + realisations.length) % realisations.length];
  const suivant = realisations[(rang + 1) % realisations.length];
  const [couverture, ...autres] = realisation.captures;
  const images = realisation.captures.map((c) => ({ url: c.src, description: `${realisation.titre} : ${c.legende}` }));

  return (
    <>
      <PageMeta title={`${realisation.titre} · Réalisations`} description={realisation.resume} />

      <section className={styles.hero} aria-labelledby="projet-titre">
        <Container className={styles.heroInner}>
          <Link to={t.retour.to} className={styles.retour}>
            {t.retour.label}
          </Link>
          <p className={styles.categorie}>{realisation.categorie}</p>
          <h1 id="projet-titre" className={styles.titre}>
            {realisation.titre}
          </h1>
          <p className={styles.resume}>{realisation.resume}</p>
          <div className={styles.meta}>
            <span className={styles.pastille}>{realisation.annee}</span>
            {realisation.technos.map((techno) => (
              <span key={techno} className={styles.pastille}>
                {techno}
              </span>
            ))}
          </div>
          {realisation.demo && (
            <a href={realisation.demo.url} className={buttonClassName({ size: 'lg', className: styles.demo })} target="_blank" rel="noopener noreferrer">
              {realisation.demo.label} <span aria-hidden="true">↗</span>
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          )}
        </Container>
      </section>

      <Container className={styles.corps}>
        {couverture ? (
          <figure className={styles.couverture}>
            <span className={styles.dots} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <button type="button" className={styles.agrandir} onClick={() => setAgrandie(0)} aria-label={`${t.agrandir} : ${couverture.legende}`}>
              <img src={couverture.src} alt="" className={styles.image} />
            </button>
          </figure>
        ) : (
          <p className={styles.aVenir}>{t.capturesAVenir}</p>
        )}

        <div className={styles.etude}>
          {[
            [t.contexte, realisation.contexte],
            [t.besoin, realisation.besoin],
            [t.solution, realisation.solution],
          ].map(([titre, texte]) => (
            <Reveal key={titre} as="section" className={styles.bloc}>
              <h2 className={styles.blocTitre}>{titre}</h2>
              <p>{texte}</p>
            </Reveal>
          ))}
        </div>

        {realisation.fonctionnalites.length > 0 && (
          <Reveal as="section" className={styles.fonctionnalites}>
            <h2 className={styles.blocTitre}>
              {t.fonctionnalites}
            </h2>
            <ul>
              {realisation.fonctionnalites.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Reveal>
        )}

        {autres.length > 0 && (
          <section aria-labelledby="projet-captures">
            <h2 id="projet-captures" className={styles.blocTitre}>
              {t.captures}
            </h2>
            <ul className={styles.galerie}>
              {autres.map((capture, i) => (
                <li key={capture.src}>
                  <figure className={styles.vignette}>
                    <button type="button" className={styles.vignetteLien} onClick={() => setAgrandie(i + 1)} aria-label={`${t.agrandir} : ${capture.legende}`}>
                      <img src={capture.src} alt="" loading="lazy" decoding="async" />
                    </button>
                    <figcaption>{capture.legende}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Visionneuse photos={images} index={agrandie} onChange={setAgrandie} onClose={() => setAgrandie(null)} />

        <nav className={styles.voisins} aria-label="Autres réalisations">
          <Link to={precedent.lien.to} className={styles.voisin}>
            <span className={styles.voisinSens}>← {t.precedent}</span>
            <span className={styles.voisinTitre}>{precedent.titre}</span>
          </Link>
          <Link to={suivant.lien.to} className={`${styles.voisin} ${styles.voisinSuivant}`}>
            <span className={styles.voisinSens}>{t.suivant} →</span>
            <span className={styles.voisinTitre}>{suivant.titre}</span>
          </Link>
        </nav>

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
