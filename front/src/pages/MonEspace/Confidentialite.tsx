import { useEffect, useState } from 'react';
import { Button, buttonClassName } from '@bsandoz79/blocs';
import { espaceTextes } from '../../data/espace';
import { modifierProfil, urlMesDonnees, type Compte } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes.confidentialite;
type EtatLocalisation = 'granted' | 'denied' | 'prompt' | 'inconnu';

/** État de l'autorisation de localisation dans ce navigateur (rien n'est stocké côté serveur). */
async function etatLocalisation(): Promise<EtatLocalisation> {
  try {
    const statut = await navigator.permissions.query({ name: 'geolocation' });
    return statut.state;
  } catch {
    return 'inconnu';
  }
}

/** « Confidentialité et préférences » : localisation, notifications par mail, téléchargement de ses données. */
export function Confidentialite({ compte, onChange }: { compte: Compte; onChange: (compte: Compte) => void }) {
  const [localisation, setLocalisation] = useState<EtatLocalisation>('inconnu');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let actif = true;
    etatLocalisation().then((etat) => actif && setLocalisation(etat));
    return () => {
      actif = false;
    };
  }, []);

  function autoriser() {
    navigator.geolocation?.getCurrentPosition(
      () => setLocalisation('granted'),
      () => etatLocalisation().then(setLocalisation),
    );
  }

  async function changerNotifications(active: boolean) {
    setMessage('');
    try {
      const resultat = await modifierProfil({
        nom: compte.nom,
        entreprise: compte.entreprise,
        telephone: compte.telephone,
        adresse: compte.adresse,
        notifications: active,
      });
      if (resultat.ok) {
        onChange(resultat.compte);
        setMessage(t.preferencesEnregistrees);
      } else setMessage(espaceTextes.erreurReseau);
    } catch {
      setMessage(espaceTextes.erreurReseau);
    }
  }

  return (
    <section className={styles.carte} aria-labelledby="espace-confidentialite">
      <h2 id="espace-confidentialite">{t.titre}</h2>

      <h3>{t.localisation}</h3>
      <p>
        <strong>{t.etats[localisation]}</strong> {t.localisationAide}
      </p>
      {localisation !== 'granted' && localisation !== 'inconnu' && (
        <>
          <Button variant="secondary" onClick={autoriser}>
            {t.autoriser}
          </Button>
          <p className={styles.aide}>{t.aideNavigateur}</p>
        </>
      )}

      <h3>{t.notifications}</h3>
      <label className={styles.caseACocher}>
        <input type="checkbox" checked={compte.notifications} onChange={(e) => changerNotifications(e.target.checked)} />
        <span>
          {t.notifications}
          <span className={styles.aide}> — {t.notificationsAide}</span>
        </span>
      </label>
      {message && (
        <p className={styles.message} role="status">
          {message}
        </p>
      )}

      <h3>{t.donnees}</h3>
      <p>{t.donneesAide}</p>
      <a href={urlMesDonnees()} className={buttonClassName({ variant: 'secondary', className: styles.lienBouton })} download>
        {t.telecharger}
      </a>
    </section>
  );
}
