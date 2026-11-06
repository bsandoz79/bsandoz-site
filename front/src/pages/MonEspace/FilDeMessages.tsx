import { useState, type FormEvent } from 'react';
import { Button, TextField } from '@bsandoz79/blocs';
import { dateLisible, espaceTextes } from '../../data/espace';
import { ecrireMessage, type MaDemande } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes.demandes.fil;

/** Échanges d'une demande : messages du site, réponses reçues par mail, notes d'appel. */
export function FilDeMessages({ demande, onEnvoye }: { demande: MaDemande; onEnvoye: (misAJour: MaDemande) => void }) {
  const [corps, setCorps] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  async function envoyer(evenement: FormEvent) {
    evenement.preventDefault();
    if (envoi) return;
    if (!corps.trim()) {
      setErreur(t.vide);
      return;
    }
    setEnvoi(true);
    setErreur('');
    try {
      const resultat = await ecrireMessage(demande.id, corps);
      if (resultat.ok) {
        setCorps('');
        onEnvoye(resultat.demande);
      } else setErreur(resultat.erreur);
    } catch {
      setErreur(espaceTextes.erreurReseau);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className={styles.fil}>
      <h4>{t.titre}</h4>
      {demande.messages.length === 0 ? (
        <p className={styles.aide}>{t.aucun}</p>
      ) : (
        <ol className={styles.messages}>
          {demande.messages.map((m) => (
            <li key={m.id} className={m.auteur === 'client' ? styles.messageClient : styles.messagePro}>
              <p className={styles.aide}>{t.entete(m.auteur, m.origine, dateLisible(m.envoyeLe))}</p>
              <p className={styles.corpsMessage}>{m.corps}</p>
            </li>
          ))}
        </ol>
      )}
      <form onSubmit={envoyer} noValidate className={styles.formulaire}>
        <TextField
          label={t.champ}
          hint={t.aide}
          multiline
          rows={3}
          maxLength={5000}
          value={corps}
          onChange={(e) => setCorps(e.target.value)}
          error={erreur || undefined}
        />
        <div className={styles.actions}>
          <Button type="submit" disabled={envoi}>
            {envoi ? t.envoi : t.envoyer}
          </Button>
        </div>
      </form>
    </div>
  );
}
