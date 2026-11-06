import { Fragment, Suspense, lazy, useRef, useState, type ReactNode } from 'react';
import { useEdition } from '../../app/edition';
import { editionTextes as t } from '../../data/admin';
import { blocs } from '../../data/blocs';
import { useVersionContenus } from '../../data/contenusEnLigne';
import { useVersionPrix } from '../../data/prixEnLigne';
import styles from './BlocModifiable.module.css';

// Le panneau n'est téléchargé que par les comptes qui s'en servent.
const PanneauBloc = lazy(() => import('./PanneauBloc'));

/**
 * Un bloc de page. Pour un compte du back-office, un crayon ouvre un panneau avec tout ce que contient le bloc :
 * textes, prix, images. Pour tous les autres, le bloc s'affiche tel quel, sans élément en plus.
 */
export function BlocModifiable({ id, plein, children }: { id: keyof typeof blocs; plein?: boolean; children: ReactNode }) {
  const contenus = useVersionContenus();
  const prix = useVersionPrix();
  const edition = useEdition();
  const [ouvert, setOuvert] = useState(false);
  const crayon = useRef<HTMLButtonElement>(null);
  const bloc = blocs[id];
  // Après un enregistrement, le bloc est réaffiché avec ses nouvelles valeurs.
  const contenu = <Fragment key={`${contenus}-${prix}`}>{children}</Fragment>;

  if (!edition) return contenu;

  return (
    <div className={plein ? `${styles.bloc} ${styles.plein}` : styles.bloc}>
      {contenu}
      <button
        ref={crayon}
        type="button"
        className={styles.crayon}
        aria-label={t.modifierBloc(bloc.titre)}
        title={t.modifierBloc(bloc.titre)}
        onClick={() => setOuvert(true)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1Z" />
        </svg>
        {t.modifier}
      </button>
      {ouvert && (
        <Suspense fallback={null}>
          <PanneauBloc
            bloc={bloc}
            onFermer={() => {
              setOuvert(false);
              requestAnimationFrame(() => crayon.current?.focus());
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
