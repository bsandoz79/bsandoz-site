import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonClassName } from '@bsandoz79/blocs';
import { dateLisible, espaceTextes } from '../../data/espace';
import { formatPrix } from '../../data/offres';
import { accepterDevis, mesDemandes, urlDevisPdf, type MaDemande } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes.demandes;

/** « Mes demandes » : avancement de chaque demande, devis à accepter et PDF (comme la maquette `EspaceClient`). */
export function MesDemandes() {
  const [liste, setListe] = useState<MaDemande[] | null>(null);
  const [aConfirmer, setAConfirmer] = useState<string | null>(null);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  useEffect(() => {
    let actif = true;
    mesDemandes()
      .then((trouvees) => actif && setListe(trouvees))
      .catch(() => actif && setListe([]));
    return () => {
      actif = false;
    };
  }, []);

  async function accepter(id: string) {
    setAConfirmer(null);
    try {
      const misAJour = await accepterDevis(id);
      if (misAJour) {
        setListe((l) => (l ?? []).map((d) => (d.id === id ? misAJour : d)));
        setMessage({ texte: t.acceptationOk, erreur: false });
      } else setMessage({ texte: t.echec, erreur: true });
    } catch {
      setMessage({ texte: t.echec, erreur: true });
    }
  }

  return (
    <section className={styles.carte} aria-labelledby="espace-demandes">
      <div className={styles.entete}>
        <h2 id="espace-demandes">{t.titre}</h2>
        <Link to={t.nouvelle.to} className={buttonClassName({ variant: 'secondary' })}>
          {t.nouvelle.label}
        </Link>
      </div>
      {message && (
        <p className={message.erreur ? styles.erreur : styles.message} role={message.erreur ? 'alert' : 'status'}>
          {message.texte}
        </p>
      )}
      {liste !== null && liste.length === 0 && <p>{t.aucune}</p>}
      {(liste ?? []).map((d) => (
        <article key={d.id} className={styles.demande} aria-labelledby={`demande-${d.id}`}>
          <p className={styles.aide}>{t.entete(d.numero, dateLisible(d.envoyeeLe))}</p>
          <h3 id={`demande-${d.id}`}>{d.titre}</h3>
          <ol className={styles.etapes} aria-label={t.etapes}>
            {d.etapes.map((e) => (
              <li
                key={e.statut}
                className={e.atteinte ? styles.etapeAtteinte : undefined}
                aria-current={e.statut === d.statut ? 'step' : undefined}
              >
                {e.libelle}
              </li>
            ))}
          </ol>

          {d.devis && (
            <div className={styles.devis}>
              <h4>{t.devis(d.devis.numero)}</h4>
              <table className={styles.lignesDevis}>
                <tbody>
                  {d.devis.lignes.map((l) => (
                    <tr key={l.libelle}>
                      <td>{l.libelle}</td>
                      <td>{formatPrix(l.prix)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row">{t.total}</th>
                    <td>{formatPrix(d.devis.total)}</td>
                  </tr>
                </tfoot>
              </table>
              <p className={styles.aide}>{t.mentions}</p>
              {d.devis.statut === 'accepte' ? (
                <p className={styles.message}>{t.accepteLe(dateLisible(d.devis.accepteLe))}</p>
              ) : aConfirmer === d.id ? (
                <div className={styles.actions}>
                  <Button onClick={() => accepter(d.id)}>{t.confirmer}</Button>
                  <Button variant="ghost" onClick={() => setAConfirmer(null)}>
                    {t.garder}
                  </Button>
                </div>
              ) : null}
              <div className={styles.actions}>
                {d.devis.statut === 'envoye' && aConfirmer !== d.id && <Button onClick={() => setAConfirmer(d.id)}>{t.accepter}</Button>}
                <a href={urlDevisPdf(d.id)} className={buttonClassName({ variant: 'secondary' })} download>
                  {t.pdf}
                </a>
              </div>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
