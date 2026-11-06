import { useState } from 'react';
import { Button, TextField } from '@bsandoz79/blocs';
import { adminTextes } from '../../data/admin';
import { formatPrix } from '../../data/offres';
import { envoyerDevis, type DemandeAdmin, type LigneDevis, type Resultat } from './api';
import styles from './Admin.module.css';

const t = adminTextes.devis;

type Saisie = { libelle: string; prix: string };

const prixValide = (prix: string) => /^\d+$/.test(prix.trim());

/** Saisie du devis : un seul par demande, et il ne se modifie plus une fois envoyé, d'où la confirmation. */
export function FormulaireDevis({ demande, onEnvoye }: { demande: DemandeAdmin; onEnvoye: (action: Promise<Resultat>) => void }) {
  const [lignes, setLignes] = useState<Saisie[]>([{ libelle: '', prix: '' }]);
  const [erreur, setErreur] = useState('');
  const [aConfirmer, setAConfirmer] = useState(false);

  const total = lignes.reduce((somme, l) => somme + (prixValide(l.prix) ? Number(l.prix) : 0), 0);

  function modifier(index: number, champ: keyof Saisie, valeur: string) {
    setAConfirmer(false);
    setLignes((l) => l.map((ligne, i) => (i === index ? { ...ligne, [champ]: valeur } : ligne)));
  }

  function verifier() {
    if (lignes.some((l) => !l.libelle.trim() || !prixValide(l.prix))) {
      setErreur(t.invalide);
      return;
    }
    setErreur('');
    setAConfirmer(true);
  }

  function envoyer() {
    const aEnvoyer: LigneDevis[] = lignes.map((l) => ({ libelle: l.libelle.trim(), prix: Number(l.prix) }));
    onEnvoye(envoyerDevis(demande.id, aEnvoyer, adminTextes.demandes.echec));
  }

  return (
    <div className={styles.formulaire}>
      {lignes.map((ligne, i) => (
        <div key={i} className={styles.ligneDevis}>
          <TextField label={`${t.libelle} ${i + 1}`} maxLength={160} value={ligne.libelle} onChange={(e) => modifier(i, 'libelle', e.target.value)} />
          <TextField label={`${t.prix} ${i + 1}`} inputMode="numeric" value={ligne.prix} onChange={(e) => modifier(i, 'prix', e.target.value)} />
          {lignes.length > 1 && (
            <Button variant="ghost" onClick={() => setLignes((l) => l.filter((_, j) => j !== i))}>
              {t.retirer(i + 1)}
            </Button>
          )}
        </div>
      ))}
      <div>
        <Button variant="secondary" onClick={() => setLignes((l) => [...l, { libelle: '', prix: '' }])}>
          {t.ajouter}
        </Button>
      </div>
      <p className={styles.titreLigne}>
        {t.total} : {formatPrix(total)}
      </p>
      {erreur && (
        <p className={styles.erreur} role="alert">
          {erreur}
        </p>
      )}
      {aConfirmer ? (
        <div className={styles.confirmation} role="group" aria-label={t.envoyer}>
          <p>{t.confirmer(formatPrix(total))}</p>
          <div className={styles.actions}>
            <Button onClick={envoyer}>{t.oui}</Button>
            <Button variant="ghost" onClick={() => setAConfirmer(false)}>
              {t.non}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Button onClick={verifier}>{t.envoyer}</Button>
        </div>
      )}
    </div>
  );
}
