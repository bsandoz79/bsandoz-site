import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Container, TextField, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { espaceTextes } from '../../data/espace';
import { pages } from '../../data/pages';
import { definirMotDePasse, demanderLien, emailValide, erreurMotDePasse } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes;
const page = pages.motDePasse;

/** Sans lien : demander le lien par mail. Avec le lien du mail (`?jeton=`) : choisir le nouveau mot de passe. */
export function MotDePasse() {
  const [parametres] = useSearchParams();
  const jeton = parametres.get('jeton') ?? '';

  return (
    <>
      <PageMeta title={page.title} description={page.description} noindex />
      <Container size="narrow" className={styles.page}>
        <h1 className={styles.titre}>{page.heading}</h1>
        {jeton ? <NouveauMotDePasse jeton={jeton} /> : <DemandeDeLien />}
      </Container>
    </>
  );
}

function DemandeDeLien() {
  const [email, setEmail] = useState('');
  const [erreurEmail, setErreurEmail] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  async function envoyer(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setErreur('');
    if (!emailValide(email)) {
      setErreurEmail('Adresse e-mail invalide.');
      return;
    }
    setErreurEmail('');
    try {
      const resultat = await demanderLien(email, 'mot_de_passe');
      if (resultat === 'envoye') setMessage(t.motDePasse.demande.envoye(email.trim()));
      else setErreur(resultat === 'trop-d-essais' ? t.tropDEssais : t.erreurReseau);
    } catch {
      setErreur(t.erreurReseau);
    }
  }

  return (
    <>
      <p className={styles.intro}>{t.motDePasse.demande.intro}</p>
      {message && (
        <p className={styles.message} role="status">
          {message}
        </p>
      )}
      {erreur && (
        <p className={styles.erreur} role="alert">
          {erreur}
        </p>
      )}
      <form className={`${styles.carte} ${styles.formulaire}`} onSubmit={envoyer} noValidate>
        <TextField
          label={t.connexion.email}
          type="email"
          autoComplete="email"
          required
          value={email}
          error={erreurEmail || undefined}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit">{t.motDePasse.demande.bouton}</Button>
      </form>
    </>
  );
}

function NouveauMotDePasse({ jeton }: { jeton: string }) {
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreurChamp, setErreurChamp] = useState('');
  const [etat, setEtat] = useState<'saisie' | 'envoi' | 'enregistre' | 'invalide' | 'erreur'>('saisie');

  async function enregistrer(event: FormEvent) {
    event.preventDefault();
    const erreur = erreurMotDePasse(motDePasse, confirmation);
    setErreurChamp(erreur ?? '');
    if (erreur) return;
    setEtat('envoi');
    try {
      const resultat = await definirMotDePasse(jeton, motDePasse);
      if (resultat === 'ok') setEtat('enregistre');
      else if (resultat === 'refuse') {
        setErreurChamp(t.motDePasse.tropCourt);
        setEtat('saisie');
      } else setEtat(resultat);
    } catch {
      setEtat('erreur');
    }
  }

  if (etat === 'enregistre' || etat === 'invalide') {
    const lien = etat === 'enregistre' ? t.motDePasse.seConnecter : t.lien.nouveau;
    return (
      <>
        <p className={etat === 'enregistre' ? styles.message : styles.erreur} role={etat === 'enregistre' ? 'status' : 'alert'}>
          {etat === 'enregistre' ? t.motDePasse.enregistre : t.lien.invalide}
        </p>
        <Link to={etat === 'enregistre' ? lien.to : pages.motDePasse.path} className={buttonClassName({ className: styles.lienDiscret })}>
          {lien.label}
        </Link>
      </>
    );
  }

  return (
    <>
      {etat === 'erreur' && (
        <p className={styles.erreur} role="alert">
          {t.erreurReseau}
        </p>
      )}
      <form className={`${styles.carte} ${styles.formulaire}`} onSubmit={enregistrer} noValidate>
        <TextField
          label={t.motDePasse.nouveau}
          hint={t.motDePasse.aide}
          type="password"
          autoComplete="new-password"
          required
          value={motDePasse}
          error={erreurChamp || undefined}
          onChange={(e) => setMotDePasse(e.target.value)}
        />
        <TextField
          label={t.motDePasse.confirmation}
          type="password"
          autoComplete="new-password"
          required
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />
        <Button type="submit" disabled={etat === 'envoi'}>
          {t.motDePasse.enregistrer}
        </Button>
      </form>
    </>
  );
}
