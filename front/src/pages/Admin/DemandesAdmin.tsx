import { useState } from 'react';
import { Button } from '@bsandoz79/blocs';
import { adminTextes } from '../../data/admin';
import { dateLisible } from '../../data/espace';
import { DetailDemande } from './DetailDemande';
import { listerDemandes, voirDemande, type DemandeAdmin, type LigneDemande } from './api';
import styles from './Admin.module.css';

const t = adminTextes.demandes;

/** Liste des demandes, filtrable par statut ; un clic ouvre le détail. */
export function DemandesAdmin({ demandes }: { demandes: LigneDemande[] }) {
  const [liste, setListe] = useState(demandes);
  const [filtre, setFiltre] = useState('');
  const [ouverte, setOuverte] = useState<DemandeAdmin | null>(null);
  const [erreur, setErreur] = useState('');

  async function ouvrir(id: string) {
    setErreur('');
    try {
      const demande = await voirDemande(id);
      if (demande) setOuverte(demande);
      else setErreur(t.echec);
    } catch {
      setErreur(t.echec);
    }
  }

  async function revenir() {
    setOuverte(null);
    try {
      const { demandes: aJour } = await listerDemandes();
      setListe(aJour);
    } catch {
      // La liste déjà affichée reste valable.
    }
  }

  if (ouverte) return <DetailDemande demande={ouverte} onChange={setOuverte} onRetour={revenir} />;

  const statuts = [...new Map(liste.map((d) => [d.statut, d.statutLibelle])).entries()];
  const visibles = filtre ? liste.filter((d) => d.statut === filtre) : liste;

  return (
    <section className={styles.carte}>
      {erreur && (
        <p className={styles.erreur} role="alert">
          {erreur}
        </p>
      )}
      {liste.length === 0 ? (
        <p>{t.aucune}</p>
      ) : (
        <>
          <label className={styles.champ}>
            {t.filtre}
            <select value={filtre} onChange={(e) => setFiltre(e.target.value)}>
              <option value="">{t.tous}</option>
              {statuts.map(([statut, libelle]) => (
                <option key={statut} value={statut}>
                  {libelle}
                </option>
              ))}
            </select>
          </label>
          <ul className={styles.liste}>
            {visibles.map((d) => (
              <li key={d.id} className={styles.ligne}>
                <div>
                  <p className={styles.aide}>{t.entete(d.numero, dateLisible(d.envoyeeLe))}</p>
                  <p className={styles.titreLigne}>{d.titre}</p>
                  <p>{d.entreprise ? `${d.nom}, ${d.entreprise}` : d.nom}</p>
                </div>
                <div className={styles.actions}>
                  <span className={styles.badge}>{d.statutLibelle}</span>
                  <Button variant="secondary" onClick={() => ouvrir(d.id)} aria-label={`Ouvrir la demande ${d.numero}`}>
                    Ouvrir
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
