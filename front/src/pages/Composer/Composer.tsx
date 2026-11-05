import { useRef, type KeyboardEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { onglets, titres } from '../../data/configurateur';
import { pages } from '../../data/pages';
import { Apercu } from './Apercu';
import { ConfigurateurInformatique } from './ConfigurateurInformatique';
import { ConfigurateurWeb } from './ConfigurateurWeb';
import type { Onglet } from './stockage';
import { useComposer } from './useComposer';
import styles from './Composer.module.css';

const ONGLETS: { id: Onglet; label: string }[] = [
  { id: 'web', label: onglets.web },
  { id: 'informatique', label: onglets.informatique },
];

/** Configurateur `/composer` : onglets « Sites & applis » et « Informatique sur place ». */
export function Composer() {
  const { search } = useLocation();
  const composer = useComposer(search);
  const { onglet } = composer.etat;
  const refs = useRef<Record<Onglet, HTMLButtonElement | null>>({ web: null, informatique: null });
  const textes = onglet === 'web' ? titres.web : titres.informatique;

  // Onglets accessibles : flèches gauche/droite, Début et Fin.
  function onKeyDown(event: KeyboardEvent) {
    const index = ONGLETS.findIndex((o) => o.id === onglet);
    const cibles: Record<string, number> = {
      ArrowRight: (index + 1) % ONGLETS.length,
      ArrowLeft: (index - 1 + ONGLETS.length) % ONGLETS.length,
      Home: 0,
      End: ONGLETS.length - 1,
    };
    if (!(event.key in cibles)) return;
    event.preventDefault();
    const suivant = ONGLETS[cibles[event.key]].id;
    composer.choisirOnglet(suivant);
    refs.current[suivant]?.focus();
  }

  return (
    <>
      <PageMeta title={pages.composer.title} description={pages.composer.description} />
      <Container className={styles.page}>
        <div className={styles.entete}>
          <div className={styles.onglets} role="tablist" aria-label={onglets.label} onKeyDown={onKeyDown}>
            {ONGLETS.map((o) => (
              <button
                key={o.id}
                ref={(el) => {
                  refs.current[o.id] = el;
                }}
                type="button"
                role="tab"
                id={`onglet-${o.id}`}
                aria-selected={onglet === o.id}
                aria-controls={`panneau-${o.id}`}
                tabIndex={onglet === o.id ? 0 : -1}
                className={styles.onglet}
                onClick={() => composer.choisirOnglet(o.id)}
              >
                {o.label}
              </button>
            ))}
          </div>
          <h1 className={styles.titre}>{textes.title}</h1>
          <p className={styles.sousTitre}>{textes.subtitle}</p>
        </div>

        <div className={styles.colonnes}>
          <div role="tabpanel" id={`panneau-${onglet}`} aria-labelledby={`onglet-${onglet}`} className={styles.panneau}>
            {onglet === 'web' ? <ConfigurateurWeb composer={composer} /> : <ConfigurateurInformatique composer={composer} />}
          </div>
          <Apercu onglet={onglet} config={composer.etat.config} />
        </div>
      </Container>
    </>
  );
}
