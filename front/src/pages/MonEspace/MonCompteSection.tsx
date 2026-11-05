import { useState, type FormEvent } from 'react';
import { Button, TextField } from '@bsandoz79/blocs';
import { espaceTextes } from '../../data/espace';
import { demanderChangementEmail, emailValide, modifierProfil, type Compte, type ErreursChamps } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes.monCompte;

/** « Mon compte » : coordonnées, puis changement d'e-mail confirmé par la nouvelle adresse. */
export function MonCompteSection({ compte, onChange }: { compte: Compte; onChange: (compte: Compte) => void }) {
  const [profil, setProfil] = useState({ nom: compte.nom, entreprise: compte.entreprise, telephone: compte.telephone, adresse: compte.adresse });
  const [erreurs, setErreurs] = useState<ErreursChamps>({});
  const [enregistre, setEnregistre] = useState(false);
  const [nouvelEmail, setNouvelEmail] = useState('');
  const [erreurEmail, setErreurEmail] = useState('');
  const [emailEnvoye, setEmailEnvoye] = useState('');

  const champ = (cle: keyof typeof profil) => ({
    value: profil[cle],
    error: erreurs[cle],
    onChange: (e: { target: { value: string } }) => {
      setProfil({ ...profil, [cle]: e.target.value });
      setEnregistre(false);
    },
  });

  async function enregistrer(event: FormEvent) {
    event.preventDefault();
    try {
      const resultat = await modifierProfil({ ...profil, notifications: compte.notifications });
      if (resultat.ok) {
        setErreurs({});
        setEnregistre(true);
        onChange(resultat.compte);
      } else setErreurs(resultat.erreurs);
    } catch {
      setErreurs({ general: espaceTextes.erreurReseau });
    }
  }

  async function changerEmail(event: FormEvent) {
    event.preventDefault();
    setEmailEnvoye('');
    if (!emailValide(nouvelEmail)) {
      setErreurEmail('Adresse e-mail invalide.');
      return;
    }
    try {
      const resultat = await demanderChangementEmail(nouvelEmail);
      if (resultat.ok) {
        setErreurEmail('');
        setEmailEnvoye(t.lienEnvoye(nouvelEmail.trim()));
        setNouvelEmail('');
      } else setErreurEmail(resultat.erreur);
    } catch {
      setErreurEmail(espaceTextes.erreurReseau);
    }
  }

  return (
    <section className={styles.carte} aria-labelledby="espace-compte">
      <h2 id="espace-compte">{t.titre}</h2>
      <form className={styles.formulaire} onSubmit={enregistrer} noValidate>
        <TextField label={t.nom} autoComplete="name" required {...champ('nom')} />
        <TextField label={t.entreprise} autoComplete="organization" {...champ('entreprise')} />
        <TextField label={t.telephone} type="tel" autoComplete="tel" {...champ('telephone')} />
        <TextField label={t.adresse} autoComplete="street-address" {...champ('adresse')} />
        {erreurs.general && (
          <p className={styles.erreur} role="alert">
            {erreurs.general}
          </p>
        )}
        <Button type="submit">{t.enregistrer}</Button>
        {enregistre && (
          <p className={styles.message} role="status">
            {t.enregistre}
          </p>
        )}
      </form>

      <form className={styles.formulaire} onSubmit={changerEmail} noValidate>
        <h3>{t.email}</h3>
        <p>
          <strong>{compte.email}</strong>
        </p>
        <TextField
          label={t.nouvelEmail}
          hint={t.emailAide}
          type="email"
          autoComplete="email"
          value={nouvelEmail}
          error={erreurEmail || undefined}
          onChange={(e) => setNouvelEmail(e.target.value)}
        />
        <Button type="submit" variant="secondary">
          {t.envoyerLien}
        </Button>
        {emailEnvoye && (
          <p className={styles.message} role="status">
            {emailEnvoye}
          </p>
        )}
      </form>
    </section>
  );
}
