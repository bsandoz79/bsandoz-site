import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Container, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { espaceTextes } from '../../data/espace';
import { pages } from '../../data/pages';
import { confirmerSuppression } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes;
const page = pages.suppression;

/**
 * Page ouverte depuis le lien de suppression reçu par mail. Rien n'est supprimé à l'ouverture :
 * il faut cliquer sur le bouton (un logiciel qui « visite » les liens des mails ne supprime donc rien).
 */
export function ConfirmerSuppression() {
  const [parametres] = useSearchParams();
  const jeton = parametres.get('jeton') ?? '';
  const [etat, setEtat] = useState<'attente' | 'envoi' | 'fait' | 'invalide' | 'erreur'>(jeton ? 'attente' : 'invalide');

  async function supprimer() {
    setEtat('envoi');
    try {
      setEtat((await confirmerSuppression(jeton)) === 'ok' ? 'fait' : 'invalide');
    } catch {
      setEtat('erreur');
    }
  }

  return (
    <>
      <PageMeta title={page.title} description={page.description} noindex />
      <Container size="narrow" className={styles.page}>
        <h1 className={styles.titre}>{page.heading}</h1>
        {(etat === 'attente' || etat === 'envoi') && (
          <>
            <p className={styles.erreur}>{t.suppression.avertissement}</p>
            <div className={styles.actions}>
              <Button onClick={supprimer} disabled={etat === 'envoi'}>
                {t.suppression.bouton}
              </Button>
              <Link to={t.suppression.garder.to} className={buttonClassName({ variant: 'ghost' })}>
                {t.suppression.garder.label}
              </Link>
            </div>
          </>
        )}
        {etat === 'fait' && (
          <>
            <p className={styles.message} role="status">
              {t.suppression.fait}
            </p>
            <Link to={t.suppression.accueil.to} className={buttonClassName({ className: styles.lienDiscret })}>
              {t.suppression.accueil.label}
            </Link>
          </>
        )}
        {(etat === 'invalide' || etat === 'erreur') && (
          <p className={styles.erreur} role="alert">
            {etat === 'invalide' ? (jeton ? t.lien.invalide : t.lien.absent) : t.erreurReseau}
          </p>
        )}
      </Container>
    </>
  );
}
