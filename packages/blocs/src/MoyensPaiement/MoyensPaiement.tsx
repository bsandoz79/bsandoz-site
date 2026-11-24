import type { ReactNode } from 'react';
import styles from './MoyensPaiement.module.css';

/** Moyens de paiement connus du bloc (chacun a sa pastille). */
export type MoyenPaiement = 'cb' | 'visa' | 'mastercard' | 'amex' | 'applepay' | 'googlepay' | 'klarna' | 'stripe' | 'virement' | 'paypal' | 'especes' | 'cheque';

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
  /**
   * Adresse à ouvrir pour un moyen (son site officiel) : la pastille devient un lien, ouvert dans un nouvel onglet.
   * Un moyen sans adresse reste une simple pastille.
   */
  liens?: Partial<Record<MoyenPaiement, string>>;
  /** Fin du nom des liens pour les lecteurs d'écran (« Klarna, site officiel (nouvel onglet) »). */
  lienSuffixe?: string;
  className?: string;
}

const NOMS: Record<MoyenPaiement, string> = {
  cb: 'Carte bancaire',
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  applepay: 'Apple Pay',
  googlepay: 'Google Pay',
  klarna: 'Klarna',
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
    case 'cb':
      return (
        <span className={styles.cb} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.icone} focusable="false">
            <rect x="2.5" y="5.5" width="19" height="13" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M2.5 9.5h19" stroke="currentColor" strokeWidth="2.2" />
            <path d="M6 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Carte bancaire
        </span>
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
  klarna: 'Klarna.',
  stripe: 'stripe',
  paypal: 'PayPal',
  especes: 'Espèces',
  cheque: 'Chèque',
};

const FONDS: Partial<Record<MoyenPaiement, string>> = { amex: styles.carteAmex, klarna: styles.carteKlarna };
const classesCarte = (m: MoyenPaiement, lien: boolean) => [styles.carte, FONDS[m] ?? '', lien ? styles.lien : ''].filter(Boolean).join(' ');

/**
 * Ligne des moyens de paiement acceptés : une petite carte par moyen (Visa, Mastercard, Apple Pay, virement…),
 * avec un titre et une mention facultatifs. Chaque carte est nommée pour les lecteurs d'écran.
 */
export function MoyensPaiement({
  moyens, label, titre, mention, taille = 'normale', liens, lienSuffixe = 'site officiel (nouvel onglet)', className,
}: MoyensPaiementProps) {
  const classes = [styles.bloc, taille === 'petite' ? styles.petite : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={classes}>
      {titre && <p className={styles.titre}>{titre}</p>}
      <ul className={styles.liste} aria-label={label}>
        {moyens.map((m) => (
          <li key={m}>
            {liens?.[m] ? (
              <a href={liens[m]} target="_blank" rel="noopener noreferrer" className={classesCarte(m, true)} aria-label={`${NOMS[m]}, ${lienSuffixe}`}>
                <Marque moyen={m} />
              </a>
            ) : (
              <span className={classesCarte(m, false)}>
                <Marque moyen={m} />
                <span className={styles.sr}>{NOMS[m]}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
      {mention && <p className={styles.mention}>{mention}</p>}
    </div>
  );
}
