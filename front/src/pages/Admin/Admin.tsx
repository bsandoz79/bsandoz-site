import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { adminTextes } from '../../data/admin';
import { pages } from '../../data/pages';
import { DemandesAdmin } from './DemandesAdmin';
import { listerDemandes, type Acces, type LigneDemande } from './api';
import styles from './Admin.module.css';

const t = adminTextes;
const page = pages.admin;

/** Back-office : réservé aux adresses autorisées par l'API. Sans session, renvoie vers la connexion, puis ici. */
export function Admin() {
  const navigate = useNavigate();
  const [acces, setAcces] = useState<Acces | null>(null);
  const [demandes, setDemandes] = useState<LigneDemande[]>([]);

  useEffect(() => {
    let actif = true;
    listerDemandes()
      .then((resultat) => {
        if (!actif) return;
        if (resultat.acces === 'connexion') {
          navigate(`${pages.connexion.path}?retour=${encodeURIComponent(page.path)}`, { replace: true });
          return;
        }
        setDemandes(resultat.demandes);
        setAcces(resultat.acces);
      })
      .catch(() => actif && setAcces('erreur'));
    return () => {
      actif = false;
    };
  }, [navigate]);

  return (
    <Container className={styles.page}>
      <PageMeta title={page.title} description={page.description} noindex />
      <h1>{page.heading}</h1>
      {acces === null && <p>{t.chargement}</p>}
      {acces === 'erreur' && <p role="alert">{t.erreur}</p>}
      {acces === 'interdit' && (
        <section className={styles.carte}>
          <h2>{t.interdit.titre}</h2>
          <p>{t.interdit.texte}</p>
        </section>
      )}
      {acces === 'ok' && <DemandesAdmin demandes={demandes} />}
    </Container>
  );
}
