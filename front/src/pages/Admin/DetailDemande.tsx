import { useState, type FormEvent } from 'react';
import { Button, TextField } from '@bsandoz79/blocs';
import { adminTextes } from '../../data/admin';
import { dateLisible, espaceTextes } from '../../data/espace';
import { formatPrix } from '../../data/offres';
import { FormulaireDevis } from './FormulaireDevis';
import { ajouterMessage, changerStatut, type DemandeAdmin, type Resultat } from './api';
import styles from './Admin.module.css';

const t = adminTextes;

/** Détail d'une demande : coordonnées, statut, devis, échanges. */
export function DetailDemande({ demande, onChange, onRetour }: { demande: DemandeAdmin; onChange: (d: DemandeAdmin) => void; onRetour: () => void }) {
  const [statut, setStatut] = useState(demande.statut);
  const [retour, setRetour] = useState<{ texte: string; erreur: boolean } | null>(null);
  const [corps, setCorps] = useState('');
  const [note, setNote] = useState(false);
  const [erreurFil, setErreurFil] = useState('');
  const d = demande.demandeur;

  async function appliquer(action: Promise<Resultat>, reussite: string) {
    setRetour(null);
    try {
      const resultat = await action;
      if (resultat.ok) {
        onChange(resultat.demande);
        setStatut(resultat.demande.statut);
        setRetour({ texte: reussite, erreur: false });
      } else {
        setStatut(demande.statut);
        setRetour({ texte: resultat.erreur, erreur: true });
      }
    } catch {
      setRetour({ texte: espaceTextes.erreurReseau, erreur: true });
    }
  }

  async function envoyerMessage(evenement: FormEvent) {
    evenement.preventDefault();
    if (!corps.trim()) {
      setErreurFil(t.fil.vide);
      return;
    }
    setErreurFil('');
    try {
      const resultat = await ajouterMessage(demande.id, corps, note, t.demandes.echec);
      if (resultat.ok) {
        onChange(resultat.demande);
        setCorps('');
        setNote(false);
      } else setErreurFil(resultat.erreur);
    } catch {
      setErreurFil(espaceTextes.erreurReseau);
    }
  }

  return (
    <div className={styles.detail}>
      <div>
        <Button variant="ghost" onClick={onRetour}>
          {t.demandes.retour}
        </Button>
      </div>
      {retour && (
        <p className={retour.erreur ? styles.erreur : styles.succes} role={retour.erreur ? 'alert' : 'status'}>
          {retour.texte}
        </p>
      )}

      <section className={styles.carte} aria-labelledby="demande-titre">
        <p className={styles.aide}>{t.demandes.entete(demande.numero, dateLisible(demande.envoyeeLe))}</p>
        <h2 id="demande-titre">{demande.titre}</h2>
        <h3>{t.demandes.coordonnees}</h3>
        <ul className={styles.coordonnees}>
          <li>{d.entreprise ? `${d.nom}, ${d.entreprise}` : d.nom}</li>
          <li>
            <a href={`mailto:${d.email}`}>{d.email}</a>
          </li>
          {d.telephone && (
            <li>
              <a href={`tel:${d.telephone.replace(/[\s.-]/g, '')}`}>{d.telephone}</a>
            </li>
          )}
        </ul>
        <h3>{t.demandes.recapitulatif}</h3>
        <p className={styles.texte}>{demande.recapitulatif}</p>
        {demande.predevis && (
          <details>
            <summary>{t.demandes.predevis}</summary>
            <p className={styles.texte}>{demande.predevis}</p>
          </details>
        )}
      </section>

      <section className={styles.carte} aria-labelledby="demande-statut">
        <h2 id="demande-statut">{t.demandes.avancement}</h2>
        <div className={styles.rangee}>
          <label className={styles.champ}>
            {t.demandes.statut}
            <select value={statut} onChange={(e) => setStatut(e.target.value)}>
              {demande.statuts.map((s) => (
                <option key={s.statut} value={s.statut}>
                  {s.libelle}
                </option>
              ))}
            </select>
          </label>
          <Button disabled={statut === demande.statut} onClick={() => appliquer(changerStatut(demande.id, statut, t.demandes.echec), t.demandes.statutEnregistre)}>
            {t.demandes.enregistrerStatut}
          </Button>
        </div>
      </section>

      <section className={styles.carte} aria-labelledby="demande-devis">
        <h2 id="demande-devis">{t.devis.titre}</h2>
        {demande.devis ? (
          <>
            <p className={styles.titreLigne}>{t.devis.numero(demande.devis.numero)}</p>
            <table className={styles.lignesDevis}>
              <tbody>
                {demande.devis.lignes.map((l, i) => (
                  <tr key={i}>
                    <td>{l.libelle}</td>
                    <td>{formatPrix(l.prix)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">{t.devis.total}</th>
                  <td>{formatPrix(demande.devis.total)}</td>
                </tr>
              </tfoot>
            </table>
            <p className={styles.aide}>
              {demande.devis.statut === 'accepte' ? t.devis.accepte(dateLisible(demande.devis.accepteLe)) : t.devis.envoye(dateLisible(demande.devis.envoyeLe))}
            </p>
          </>
        ) : (
          <FormulaireDevis demande={demande} onEnvoye={(a) => appliquer(a, t.devis.envoyeOk)} />
        )}
      </section>

      <section className={styles.carte} aria-labelledby="demande-fil">
        <h2 id="demande-fil">{t.fil.titre}</h2>
        {demande.messages.length === 0 ? (
          <p className={styles.aide}>{t.fil.aucun}</p>
        ) : (
          <ol className={styles.messages}>
            {demande.messages.map((m) => (
              <li key={m.id} className={m.auteur === 'professionnel' ? styles.messageMoi : styles.messageAutre}>
                <p className={styles.aide}>{t.fil.entete(m.auteur, m.origine, d.nom, dateLisible(m.envoyeLe))}</p>
                <p className={styles.texte}>{m.corps}</p>
              </li>
            ))}
          </ol>
        )}
        <form onSubmit={envoyerMessage} noValidate className={styles.formulaire}>
          <TextField label={t.fil.champ} multiline rows={3} maxLength={5000} value={corps} onChange={(e) => setCorps(e.target.value)} error={erreurFil || undefined} />
          <label className={styles.caseACocher}>
            <input type="checkbox" checked={note} onChange={(e) => setNote(e.target.checked)} />
            {t.fil.note}
          </label>
          <div>
            <Button type="submit">{note ? t.fil.noter : t.fil.envoyer}</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
