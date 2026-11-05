import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { dateLisible, espaceTextes } from '../../data/espace';
import { pages } from '../../data/pages';
import {
  appareilsConnectes,
  compteConnecte,
  deconnecterLesAutres,
  demanderLien,
  seDeconnecter,
  type AppareilConnecte,
  type Compte,
} from './compte';
import { Confidentialite } from './Confidentialite';
import { MesRendezVous } from './MesRendezVous';
import { MonCompteSection } from './MonCompteSection';
import { ZoneDanger } from './ZoneDanger';
import styles from './MonEspace.module.css';

const t = espaceTextes;
const page = pages.monEspace;

/** Espace client : compte, sécurité (mot de passe par lien), appareils connectés. Réservé aux personnes connectées. */
export function MonEspace() {
  const navigate = useNavigate();
  const [compte, setCompte] = useState<Compte | null>(null);
  const [appareils, setAppareils] = useState<AppareilConnecte[]>([]);
  const [erreur, setErreur] = useState('');
  const [messageLien, setMessageLien] = useState('');
  const [messageAppareils, setMessageAppareils] = useState('');

  useEffect(() => {
    let actif = true;
    compteConnecte()
      .then(async (trouve) => {
        if (!actif) return;
        if (!trouve) {
          navigate(pages.connexion.path, { replace: true });
          return;
        }
        setCompte(trouve);
        const liste = await appareilsConnectes();
        if (actif) setAppareils(liste);
      })
      .catch(() => actif && setErreur(t.erreurReseau));
    return () => {
      actif = false;
    };
  }, [navigate]);

  async function deconnecter() {
    try {
      await seDeconnecter();
    } finally {
      navigate(pages.connexion.path, { replace: true });
    }
  }

  async function recevoirLien() {
    if (!compte) return;
    try {
      const resultat = await demanderLien(compte.email, 'mot_de_passe');
      setMessageLien(resultat === 'envoye' ? t.compte.lienEnvoye(compte.email) : resultat === 'trop-d-essais' ? t.tropDEssais : t.erreurReseau);
    } catch {
      setMessageLien(t.erreurReseau);
    }
  }

  async function deconnecterAutres() {
    try {
      const n = await deconnecterLesAutres();
      setMessageAppareils(t.compte.autresDeconnectes(n));
      setAppareils(await appareilsConnectes());
    } catch {
      setMessageAppareils(t.erreurReseau);
    }
  }

  if (!compte) {
    return (
      <>
        <PageMeta title={page.title} description={page.description} noindex />
        <Container size="narrow" className={styles.page}>
          <h1 className={styles.titre}>{page.heading}</h1>
          <p className={erreur ? styles.erreur : styles.intro} role={erreur ? 'alert' : 'status'}>
            {erreur || t.chargement}
          </p>
        </Container>
      </>
    );
  }

  const autres = appareils.filter((a) => !a.courant).length;

  return (
    <>
      <PageMeta title={page.title} description={page.description} noindex />
      <Container size="narrow" className={styles.page}>
        <div className={styles.entete}>
          <div>
            <h1 className={styles.titre}>{t.compte.bonjour(compte.nom)}</h1>
            <p className={styles.intro}>{compte.email}</p>
          </div>
          <Button variant="secondary" onClick={deconnecter}>
            {t.compte.deconnexion}
          </Button>
        </div>

        <MesRendezVous />

        <p className={styles.intro}>{t.compte.aVenir}</p>

        <MonCompteSection compte={compte} onChange={setCompte} />

        <section className={styles.carte} aria-labelledby="espace-securite">
          <h2 id="espace-securite">{t.compte.securite}</h2>
          <h3>{t.compte.motDePasse}</h3>
          <p>
            {compte.motDePasse ? t.compte.modifieLe(dateLisible(compte.motDePasseModifieLe)) : t.compte.sansMotDePasse}{' '}
            {t.compte.lienSecurise}
          </p>
          <Button variant="secondary" onClick={recevoirLien}>
            {t.compte.recevoirLien}
          </Button>
          {messageLien && (
            <p className={styles.message} role="status">
              {messageLien}
            </p>
          )}
        </section>

        <section className={styles.carte} aria-labelledby="espace-appareils">
          <h2 id="espace-appareils">{t.compte.appareils}</h2>
          <ul className={styles.appareils}>
            {appareils.map((a) => (
              <li key={a.id}>
                <span className={styles.appareil}>{a.appareil}</span>
                <span className={styles.aide}>{t.compte.actifLe(dateLisible(a.derniereActivite))}</span>
                {a.courant && <span className={styles.courant}>{t.compte.cetAppareil}</span>}
              </li>
            ))}
          </ul>
          {autres > 0 && (
            <Button variant="secondary" onClick={deconnecterAutres}>
              {t.compte.deconnecterAutres}
            </Button>
          )}
          {messageAppareils && (
            <p className={styles.message} role="status">
              {messageAppareils}
            </p>
          )}
        </section>

        <Confidentialite compte={compte} onChange={setCompte} />
        <ZoneDanger compte={compte} />
      </Container>
    </>
  );
}
