import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { adminTextes } from '../../data/admin';
import { pages } from '../../data/pages';
import { DemandesAdmin } from './DemandesAdmin';
import { PrixAdmin } from './PrixAdmin';
import { listerDemandes, type Acces, type LigneDemande } from './api';
import styles from './Admin.module.css';

const t = adminTextes;
const page = pages.admin;

type Onglet = keyof typeof t.onglets;

/** Back-office : réservé aux adresses autorisées par l'API. Sans session, renvoie vers la connexion, puis ici. */
export function Admin() {
  const navigate = useNavigate();
  const [acces, setAcces] = useState<Acces | null>(null);
  const [demandes, setDemandes] = useState<LigneDemande[]>([]);
  const [onglet, setOnglet] = useState<Onglet>('demandes');

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
      {acces === 'ok' && (
        <>
          <nav aria-label={t.ongletsLibelle} className={styles.onglets}>
            {(Object.keys(t.onglets) as Onglet[]).map((id) => (
              <Button key={id} variant={onglet === id ? 'primary' : 'secondary'} aria-pressed={onglet === id} onClick={() => setOnglet(id)}>
                {t.onglets[id]}
              </Button>
            ))}
          </nav>
          {onglet === 'demandes' && <DemandesAdmin demandes={demandes} />}
          {onglet === 'prix' && <PrixAdmin />}
        </>
      )}
    </Container>
  );
}
