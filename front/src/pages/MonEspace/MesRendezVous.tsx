import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonClassName } from '@bsandoz79/blocs';
import { espaceTextes, jourLisible } from '../../data/espace';
import { annulerRendezVous, mesRendezVous, urlAgenda, type MonRendezVous } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes.rendezVous;

function lieu(r: MonRendezVous) {
  return r.lieu === 'chezvous' && r.adresse ? `chez vous, ${r.adresse}` : r.lieuLibelle.toLowerCase();
}

/** « Mes rendez-vous » dans l'espace client : à venir (agenda, déplacer, annuler), puis passés et annulés. */
export function MesRendezVous() {
  const [liste, setListe] = useState<MonRendezVous[] | null>(null);
  const [aConfirmer, setAConfirmer] = useState<string | null>(null);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  useEffect(() => {
    let actif = true;
    mesRendezVous()
      .then((trouves) => actif && setListe(trouves))
      .catch(() => actif && setListe([]));
    return () => {
      actif = false;
    };
  }, []);

  async function annuler(id: string) {
    setAConfirmer(null);
    try {
      const ok = await annulerRendezVous(id);
      setMessage(ok ? { texte: t.annuleOk, erreur: false } : { texte: t.echec, erreur: true });
      if (ok) setListe(await mesRendezVous());
    } catch {
      setMessage({ texte: t.echec, erreur: true });
    }
  }

  const aVenir = (liste ?? []).filter((r) => r.aVenir);
  const autres = (liste ?? []).filter((r) => !r.aVenir).reverse();

  return (
    <section className={styles.carte} aria-labelledby="espace-rendez-vous">
      <h2 id="espace-rendez-vous">{t.titre}</h2>
      {message && (
        <p className={message.erreur ? styles.erreur : styles.message} role={message.erreur ? 'alert' : 'status'}>
          {message.texte}
        </p>
      )}
      {liste !== null && aVenir.length === 0 && (
        <p>
          {t.aucun}{' '}
          <Link to={t.prendre.to} className={styles.lienDiscret}>
            {t.prendre.label}
          </Link>
        </p>
      )}
      {aVenir.length > 0 && (
        <ul className={styles.rendezVous}>
          {aVenir.map((r) => (
            <li key={r.id}>
              <p className={styles.appareil}>
                {jourLisible(r.jour)} · {r.debut} – {r.fin}
              </p>
              <p className={styles.aide}>
                {t.type} · {lieu(r)}
              </p>
              {aConfirmer === r.id ? (
                <div className={styles.actions}>
                  <Button onClick={() => annuler(r.id)}>{t.confirmer}</Button>
                  <Button variant="ghost" onClick={() => setAConfirmer(null)}>
                    {t.garder}
                  </Button>
                </div>
              ) : (
                <div className={styles.actions}>
                  <a href={urlAgenda(r.id)} className={buttonClassName({ variant: 'secondary' })} download>
                    {t.agenda}
                  </a>
                  <Link to={t.deplacer.to} className={buttonClassName({ variant: 'secondary' })}>
                    {t.deplacer.label}
                  </Link>
                  <Button variant="ghost" onClick={() => setAConfirmer(r.id)}>
                    {t.annuler}
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {aVenir.length > 0 && <p className={styles.aide}>{t.deplacerAide}</p>}
      {autres.length > 0 && (
        <>
          <h3>{t.passes}</h3>
          <ul className={styles.rendezVous}>
            {autres.map((r) => (
              <li key={r.id}>
                <p>
                  {jourLisible(r.jour)} · {r.debut} – {r.fin}
                  {r.statut === 'annule' && <span className={styles.annule}> ({t.annule})</span>}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
