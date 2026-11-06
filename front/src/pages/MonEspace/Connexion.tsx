import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Container, TextField } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { espaceTextes } from '../../data/espace';
import { pages } from '../../data/pages';
import { adresseDeRetour, compteConnecte, demanderLien, emailValide, seConnecter } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes;
const page = pages.connexion;

/** Connexion à l'espace client : par mot de passe, ou par un lien reçu par mail. */
export function Connexion() {
  const navigate = useNavigate();
  const [recherche] = useSearchParams();
  const retour = adresseDeRetour(recherche.get('retour'));
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [erreurEmail, setErreurEmail] = useState('');
  const [message, setMessage] = useState('');
  const [enCours, setEnCours] = useState(false);

  // Déjà connecté : directement dans l'espace.
  useEffect(() => {
    const etat = { actif: true };
    compteConnecte()
      .then((compte) => {
        if (etat.actif && compte) navigate(retour, { replace: true });
      })
      .catch(() => undefined);
    return () => {
      etat.actif = false;
    };
  }, [navigate, retour]);

  async function connecter(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setErreur('');
    if (!emailValide(email)) {
      setErreurEmail('Adresse e-mail invalide.');
      return;
    }
    setErreurEmail('');
    setEnCours(true);
    try {
      const resultat = await seConnecter(email, motDePasse);
      if (resultat.ok) {
        navigate(retour, { replace: true });
        return;
      }
      setErreur(resultat.raison === 'identifiants' ? t.connexion.incorrect : resultat.raison === 'trop-d-essais' ? t.tropDEssais : t.erreurReseau);
    } catch {
      setErreur(t.erreurReseau);
    }
    setEnCours(false);
  }

  async function recevoirLien() {
    setMessage('');
    setErreur('');
    if (!emailValide(email)) {
      setErreurEmail('Indiquez votre adresse e-mail pour recevoir le lien.');
      return;
    }
    setErreurEmail('');
    try {
      const resultat = await demanderLien(email, 'connexion');
      if (resultat === 'envoye') setMessage(t.connexion.lien.envoye(email.trim()));
      else setErreur(resultat === 'trop-d-essais' ? t.tropDEssais : t.erreurReseau);
    } catch {
      setErreur(t.erreurReseau);
    }
  }

  return (
    <>
      <PageMeta title={page.title} description={page.description} noindex />
      <Container size="narrow" className={styles.page}>
        <h1 className={styles.titre}>{page.heading}</h1>
        <p className={styles.intro}>{t.connexion.intro}</p>

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

        <form className={`${styles.carte} ${styles.formulaire}`} onSubmit={connecter} noValidate>
          <TextField
            label={t.connexion.email}
            type="email"
            autoComplete="email"
            required
            value={email}
            error={erreurEmail || undefined}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label={t.connexion.motDePasse}
            type="password"
            autoComplete="current-password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
          <Button type="submit" disabled={enCours}>
            {enCours ? t.connexion.enCours : t.connexion.seConnecter}
          </Button>
          <Link to={t.connexion.oubli.to} className={styles.lienDiscret}>
            {t.connexion.oubli.label}
          </Link>
        </form>

        <section className={styles.carte} aria-labelledby="connexion-lien">
          <h2 id="connexion-lien">{t.connexion.lien.titre}</h2>
          <p>{t.connexion.lien.texte}</p>
          <Button variant="secondary" onClick={recevoirLien}>
            {t.connexion.lien.bouton}
          </Button>
        </section>

        <p className={styles.aide}>{t.connexion.premiereFois}</p>
      </Container>
    </>
  );
}
