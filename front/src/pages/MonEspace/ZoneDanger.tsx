import { useState } from 'react';
import { Button } from '@bsandoz79/blocs';
import { espaceTextes } from '../../data/espace';
import { demanderSuppression, type Compte } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes.zoneDanger;

/** « Zone danger » : la suppression se confirme en deux temps ici, puis par le lien reçu par mail. */
export function ZoneDanger({ compte }: { compte: Compte }) {
  const [etape, setEtape] = useState<'repos' | 'confirmation' | 'envoye' | 'erreur'>('repos');

  async function envoyer() {
    try {
      setEtape((await demanderSuppression()) ? 'envoye' : 'erreur');
    } catch {
      setEtape('erreur');
    }
  }

  return (
    <section className={`${styles.carte} ${styles.danger}`} aria-labelledby="espace-danger">
      <h2 id="espace-danger">{t.titre}</h2>
      <h3>{t.supprimer}</h3>
      <p>{t.texte}</p>
      {etape === 'repos' && (
        <Button variant="secondary" onClick={() => setEtape('confirmation')}>
          {t.supprimer}
        </Button>
      )}
      {etape === 'confirmation' && (
        <div className={styles.actions}>
          <Button onClick={envoyer}>{t.confirmer}</Button>
          <Button variant="ghost" onClick={() => setEtape('repos')}>
            {t.garder}
          </Button>
        </div>
      )}
      {etape === 'envoye' && (
        <p className={styles.message} role="status">
          {t.envoye(compte.email)}
        </p>
      )}
      {etape === 'erreur' && (
        <p className={styles.erreur} role="alert">
          {espaceTextes.erreurReseau}
        </p>
      )}
    </section>
  );
}
