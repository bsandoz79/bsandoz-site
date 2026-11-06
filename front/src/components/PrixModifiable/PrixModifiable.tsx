import { useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { useEdition } from '../../app/edition';
import { editionTextes as t } from '../../data/admin';
import { changerPrix, prixDeBase, prixModifiesActuels, useVersionPrix } from '../../data/prixEnLigne';
import { enregistrerPrix } from '../../pages/Admin/api';
import styles from './PrixModifiable.module.css';

type Props = {
  /** Clé du prix : `formule.vitrine`, `option.page`… */
  cle: string;
  /** Nom du prix, pour les lecteurs d'écran. */
  nom: string;
  /** Montant actuel, repris dans le champ. */
  montant: () => number;
  /** Affichage du prix : relu à chaque changement. */
  children: () => ReactNode;
};

/**
 * Un prix affiché sur le site. Pour un compte du back-office, un petit crayon permet de le changer sur place :
 * clic, nouveau montant, Entrée, et le prix est enregistré. Pour tous les autres, rien de plus que le prix.
 */
export function PrixModifiable({ cle, nom, montant, children }: Props) {
  useVersionPrix();
  const edition = useEdition();
  const [saisie, setSaisie] = useState<string | null>(null);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const crayon = useRef<HTMLButtonElement>(null);

  function fermer() {
    setSaisie(null);
    setErreur('');
    requestAnimationFrame(() => crayon.current?.focus());
  }

  async function enregistrer(evenement: FormEvent) {
    evenement.preventDefault();
    const texte = (saisie ?? '').trim();
    if (!/^\d+$/.test(texte)) {
      setErreur(t.invalide);
      return;
    }
    const valeur = Number(texte);
    // L'API garde les prix qui diffèrent du code : on envoie l'ensemble, avec ce changement.
    const modifies = { ...prixModifiesActuels(), [cle]: valeur };
    if (valeur === prixDeBase[cle]) delete modifies[cle];
    setEnvoi(true);
    setErreur('');
    try {
      if (await enregistrerPrix(modifies)) {
        changerPrix(modifies);
        fermer();
      } else setErreur(t.echec);
    } catch {
      setErreur(t.echec);
    } finally {
      setEnvoi(false);
    }
  }

  function surTouche(evenement: KeyboardEvent) {
    if (evenement.key === 'Escape') {
      evenement.preventDefault();
      fermer();
    }
  }

  if (saisie !== null) {
    return (
      <form className={styles.formulaire} onSubmit={enregistrer} onKeyDown={surTouche} noValidate>
        <input
          className={styles.champ}
          type="text"
          inputMode="numeric"
          aria-label={t.nouveauPrix(nom)}
          aria-invalid={erreur ? true : undefined}
          value={saisie}
          autoFocus
          onChange={(e) => setSaisie(e.target.value)}
        />
        <span className={styles.euro} aria-hidden="true">
          €
        </span>
        <button type="submit" className={styles.enregistrer} disabled={envoi}>
          {t.enregistrer}
        </button>
        <button type="button" className={styles.annuler} onClick={fermer}>
          {t.annuler}
        </button>
        {erreur && (
          <p className={styles.erreur} role="alert">
            {erreur}
          </p>
        )}
      </form>
    );
  }

  if (!edition) return <>{children()}</>;

  return (
    <div className={styles.ligne}>
      {children()}
      <button
        ref={crayon}
        type="button"
        className={styles.crayon}
        aria-label={t.modifierPrix(nom)}
        title={t.modifierPrix(nom)}
        onClick={() => setSaisie(String(montant()))}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1Z" />
        </svg>
      </button>
    </div>
  );
}
