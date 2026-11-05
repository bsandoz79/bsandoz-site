import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { espaceTextes } from '../../data/espace';
import { pages } from '../../data/pages';
import { utiliserLien } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes;
const page = pages.lienConnexion;

/**
 * Page ouverte depuis le lien d'activation ou de connexion reçu par mail.
 * Le lien n'est consommé que par la requête POST envoyée ici (pas par la simple ouverture de l'adresse).
 */
export function Lien() {
  const navigate = useNavigate();
  const [parametres] = useSearchParams();
  const jeton = parametres.get('jeton') ?? '';
  const [etat, setEtat] = useState<'en-cours' | 'absent' | 'invalide' | 'erreur'>(jeton ? 'en-cours' : 'absent');
  // Un lien ne sert qu'une fois : on ne l'envoie qu'une seule fois, même si React rejoue l'effet.
  const envoye = useRef(false);

  useEffect(() => {
    if (!jeton || envoye.current) return;
    envoye.current = true;
    utiliserLien(jeton)
      .then((resultat) => {
        if (resultat === 'ok') navigate(pages.monEspace.path, { replace: true });
        else setEtat(resultat);
      })
      .catch(() => setEtat('erreur'));
  }, [jeton, navigate]);

  const texte = { 'en-cours': t.chargement, absent: t.lien.absent, invalide: t.lien.invalide, erreur: t.erreurReseau }[etat];

  return (
    <>
      <PageMeta title={page.title} description={page.description} noindex />
      <Container size="narrow" className={styles.page}>
        <h1 className={styles.titre}>{page.heading}</h1>
        <p className={etat === 'en-cours' ? styles.intro : styles.erreur} role={etat === 'en-cours' ? 'status' : 'alert'}>
          {texte}
        </p>
        {etat !== 'en-cours' && (
          <Link to={t.lien.nouveau.to} className={buttonClassName({ className: styles.lienDiscret })}>
            {t.lien.nouveau.label}
          </Link>
        )}
      </Container>
    </>
  );
}
