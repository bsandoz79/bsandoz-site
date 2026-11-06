import { useEffect, useState, type FormEvent } from 'react';
import { Button, TextField } from '@bsandoz79/blocs';
import { adminTextes } from '../../data/admin';
import { formatPrix, formules, options } from '../../data/offres';
import { lirePrixEnLigne, prixDeBase, type PrixModifies } from '../../data/prixEnLigne';
import { enregistrerPrix } from './api';
import styles from './Admin.module.css';

const t = adminTextes.prix;

const lignes = [
  { titre: t.formules, prix: formules.map((f) => ({ cle: `formule.${f.id}`, nom: f.nom })) },
  { titre: t.options, prix: Object.values(options).map((o) => ({ cle: `option.${o.id}`, nom: o.nom })) },
];

const valide = (valeur: string) => /^\d+$/.test(valeur.trim());

/** Modifier les prix affichés sur le site. Seuls ceux qui diffèrent du code sont envoyés. */
export function PrixAdmin() {
  const [saisie, setSaisie] = useState<Record<string, string> | null>(null);
  const [retour, setRetour] = useState<{ texte: string; erreur: boolean } | null>(null);

  useEffect(() => {
    let actif = true;
    const initial = (modifies: PrixModifies) =>
      Object.fromEntries(Object.entries(prixDeBase).map(([cle, base]) => [cle, String(modifies[cle] ?? base)]));
    lirePrixEnLigne()
      .then((modifies) => actif && setSaisie(initial(modifies)))
      .catch(() => actif && setRetour({ texte: t.lectureImpossible, erreur: true }));
    return () => {
      actif = false;
    };
  }, []);

  async function enregistrer(evenement: FormEvent) {
    evenement.preventDefault();
    if (!saisie) return;
    if (Object.values(saisie).some((v) => !valide(v))) {
      setRetour({ texte: t.invalide, erreur: true });
      return;
    }
    const modifies = Object.fromEntries(
      Object.entries(saisie)
        .map(([cle, valeur]) => [cle, Number(valeur)] as const)
        .filter(([cle, montant]) => montant !== prixDeBase[cle]),
    );
    setRetour(null);
    try {
      setRetour((await enregistrerPrix(modifies)) ? { texte: t.enregistre, erreur: false } : { texte: t.echec, erreur: true });
    } catch {
      setRetour({ texte: t.echec, erreur: true });
    }
  }

  return (
    <section className={styles.carte} aria-labelledby="admin-prix">
      <h2 id="admin-prix">{t.titre}</h2>
      <p className={styles.aide}>{t.aide}</p>
      {retour && (
        <p className={retour.erreur ? styles.erreur : styles.succes} role={retour.erreur ? 'alert' : 'status'}>
          {retour.texte}
        </p>
      )}
      {saisie && (
        <form onSubmit={enregistrer} noValidate className={styles.formulaire}>
          {lignes.map((groupe) => (
            <fieldset key={groupe.titre} className={styles.groupe}>
              <legend>{groupe.titre}</legend>
              <div className={styles.grille}>
                {groupe.prix.map(({ cle, nom }) => (
                  <TextField
                    key={cle}
                    label={nom}
                    hint={t.base(formatPrix(prixDeBase[cle]))}
                    inputMode="numeric"
                    value={saisie[cle]}
                    onChange={(e) => setSaisie({ ...saisie, [cle]: e.target.value })}
                  />
                ))}
              </div>
            </fieldset>
          ))}
          <div>
            <Button type="submit">{t.enregistrer}</Button>
          </div>
        </form>
      )}
    </section>
  );
}
