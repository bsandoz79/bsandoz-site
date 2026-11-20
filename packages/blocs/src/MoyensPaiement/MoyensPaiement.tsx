import type { ReactNode } from 'react';
import styles from './MoyensPaiement.module.css';

/** Moyens de paiement connus du bloc (chacun a sa pastille). */
export type MoyenPaiement = 'visa' | 'mastercard' | 'amex' | 'applepay' | 'googlepay' | 'stripe' | 'virement' | 'paypal' | 'especes' | 'cheque';

export interface MoyensPaiementProps {
  /** Moyens à afficher, dans l'ordre. N'afficher que ceux réellement acceptés. */
  moyens: MoyenPaiement[];
  /** Nom de la liste pour les lecteurs d'écran (ex. « Moyens de paiement acceptés »). */
  label: string;
  /** Titre visible facultatif, au-dessus des pastilles (ex. « Paiement sécurisé »). */
  titre?: ReactNode;
  /** Petite phrase sous les pastilles (ex. « Paiement chiffré, traité par Stripe. »). */
  mention?: ReactNode;
  /** `petite` : pastilles plus basses, pour un pied de page. */
  taille?: 'normale' | 'petite';
  className?: string;
}

const NOMS: Record<MoyenPaiement, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  applepay: 'Apple Pay',
  googlepay: 'Google Pay',
  stripe: 'Stripe',
  virement: 'Virement bancaire',
  paypal: 'PayPal',
  especes: 'Espèces',
  cheque: 'Chèque',
};

/** Marques dessinées simplement (texte et formes), sans reprendre les logos officiels. */
function Marque({ moyen }: { moyen: MoyenPaiement }) {
  switch (moyen) {
    case 'mastercard':
      return (
        <svg viewBox="0 0 38 24" className={styles.svg} aria-hidden="true" focusable="false">
          <circle cx="14" cy="12" r="9" fill="#eb001b" />
          <circle cx="24" cy="12" r="9" fill="#f79e1b" />
          <path d="M19 4.4a9 9 0 0 1 0 15.2a9 9 0 0 1 0-15.2z" fill="#ff5f00" />
        </svg>
      );
    case 'virement':
      return (
        <span className={styles.virement} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.icone} focusable="false">
            <path d="M3 9.5L12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3.5 20h17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Virement
        </span>
      );
    default:
      return <span className={styles[moyen]} aria-hidden="true">{TEXTES[moyen]}</span>;
  }
}

const TEXTES: Partial<Record<MoyenPaiement, string>> = {
  visa: 'VISA',
  amex: 'AMEX',
  applepay: 'Apple Pay',
  googlepay: 'Google Pay',
  stripe: 'stripe',
  paypal: 'PayPal',
  especes: 'Espèces',
  cheque: 'Chèque',
};

/**
 * Ligne des moyens de paiement acceptés : une petite carte par moyen (Visa, Mastercard, Apple Pay, virement…),
 * avec un titre et une mention facultatifs. Chaque carte est nommée pour les lecteurs d'écran.
 */
export function MoyensPaiement({ moyens, label, titre, mention, taille = 'normale', className }: MoyensPaiementProps) {
  const classes = [styles.bloc, taille === 'petite' ? styles.petite : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={classes}>
      {titre && <p className={styles.titre}>{titre}</p>}
      <ul className={styles.liste} aria-label={label}>
        {moyens.map((m) => (
          <li key={m} className={m === 'amex' ? `${styles.carte} ${styles.carteAmex}` : styles.carte}>
            <Marque moyen={m} />
            <span className={styles.sr}>{NOMS[m]}</span>
          </li>
        ))}
      </ul>
      {mention && <p className={styles.mention}>{mention}</p>}
    </div>
  );
}
