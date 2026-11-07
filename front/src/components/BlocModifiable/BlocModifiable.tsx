import { Fragment, Suspense, lazy, useRef, useState, type ReactNode } from 'react';
import { useEdition } from '../../app/edition';
import { editionTextes as t } from '../../data/admin';
import { blocs } from '../../data/blocs';
import { useVersionContenus } from '../../data/contenusEnLigne';
import { useVersionPrix } from '../../data/prixEnLigne';
import styles from './BlocModifiable.module.css';

// L'éditeur n'est téléchargé que par les comptes qui s'en servent.
const EditeurBloc = lazy(() => import('./EditeurBloc'));

/**
 * Un bloc de page. Pour un compte du back-office, « Modifier » encadre chaque texte, prix et image du bloc :
 * un clic dessus le modifie sur place. Pour tous les autres, le bloc s'affiche tel quel, sans élément en plus.
 */
export function BlocModifiable({ id, plein, children }: { id: keyof typeof blocs; plein?: boolean; children: ReactNode }) {
  const contenus = useVersionContenus();
  const prix = useVersionPrix();
  const edition = useEdition();
  const [ouvert, setOuvert] = useState(false);
  // Aperçu pendant l'édition : chaque changement validé réaffiche le bloc.
  const [apercu, setApercu] = useState(0);
  const crayon = useRef<HTMLButtonElement>(null);
  const racine = useRef<HTMLDivElement>(null);
  const bloc = blocs[id];
  const version = `${contenus}-${prix}-${apercu}`;
  const contenu = <Fragment key={version}>{children}</Fragment>;

  if (!edition) return contenu;

  const classes = [styles.bloc, plein ? styles.plein : '', ouvert ? styles.enEdition : ''].filter(Boolean).join(' ');
  return (
    <div ref={racine} className={classes}>
      {contenu}
      {!ouvert && (
        <button
          ref={crayon}
          type="button"
          data-edition
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
      )}
      {ouvert && (
        <Suspense fallback={null}>
          <EditeurBloc
            bloc={bloc}
            racine={racine}
            version={apercu + contenus + prix}
            onApercu={() => setApercu((n) => n + 1)}
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
