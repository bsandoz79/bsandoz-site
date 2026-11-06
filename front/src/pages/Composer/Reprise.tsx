import { useEffect, useRef, type KeyboardEvent } from 'react';
import { buttonClassName } from '@bsandoz79/blocs';
import { reprise as t } from '../../data/configurateur';
import styles from './Composer.module.css';

/**
 * Fenêtre « Voulez-vous reprendre là où vous en étiez ? », à l'arrivée sur le configurateur
 * quand la visite précédente avait laissé une estimation. Échap = reprendre (rien n'est effacé).
 */
export function Reprise({ resume, onReprendre, onRecommencer }: { resume: string; onReprendre: () => void; onRecommencer: () => void }) {
  const oui = useRef<HTMLButtonElement>(null);
  const fenetre = useRef<HTMLDivElement>(null);

  useEffect(() => oui.current?.focus(), []);

  // Le focus reste dans la fenêtre : Tab et Maj+Tab tournent entre ses deux boutons.
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onReprendre();
      return;
    }
    if (event.key !== 'Tab') return;
    const boutons = Array.from(fenetre.current?.querySelectorAll('button') ?? []);
    const index = boutons.indexOf(document.activeElement as HTMLButtonElement);
    const suivant = event.shiftKey ? (index - 1 + boutons.length) % boutons.length : (index + 1) % boutons.length;
    event.preventDefault();
    boutons[suivant]?.focus();
  }

  return (
    <div className={styles.repriseFond}>
      <div
        ref={fenetre}
        className={`${styles.reprise} anim-appear`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reprise-titre"
        aria-describedby="reprise-texte"
        onKeyDown={onKeyDown}
      >
        <h2 id="reprise-titre" className={styles.repriseTitre}>
          {t.titre}
        </h2>
        <p id="reprise-texte" className={styles.repriseTexte}>
          {t.texte} <strong>{resume}</strong>
        </p>
        <div className={styles.repriseActions}>
          <button ref={oui} type="button" className={buttonClassName()} onClick={onReprendre}>
            {t.oui}
          </button>
          <button type="button" className={buttonClassName({ variant: 'secondary' })} onClick={onRecommencer}>
            {t.non}
          </button>
        </div>
      </div>
    </div>
  );
}
