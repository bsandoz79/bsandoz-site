import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { espaceTextes } from '../../data/espace';
import { pages } from '../../data/pages';
import { confirmerChangementEmail } from './compte';
import styles from './MonEspace.module.css';

const t = espaceTextes;
const page = pages.confirmerEmail;

/** Page ouverte depuis le lien reçu à la nouvelle adresse : confirme le changement (une seule fois). */
export function ConfirmerEmail() {
  const [parametres] = useSearchParams();
  const jeton = parametres.get('jeton') ?? '';
  const [resultat, setResultat] = useState<{ texte: string; ok: boolean } | null>(jeton ? null : { texte: t.lien.absent, ok: false });
  const envoye = useRef(false);

  useEffect(() => {
    if (!jeton || envoye.current) return;
    envoye.current = true;
    confirmerChangementEmail(jeton)
      .then((r) => {
        if (r.etat === 'ok') setResultat({ texte: t.confirmerEmail.ok(r.email), ok: true });
        else setResultat({ texte: r.etat === 'invalide' ? t.lien.invalide : r.etat === 'refuse' ? t.confirmerEmail.refuse : t.erreurReseau, ok: false });
      })
      .catch(() => setResultat({ texte: t.erreurReseau, ok: false }));
  }, [jeton]);

  return (
    <>
      <PageMeta title={page.title} description={page.description} noindex />
      <Container size="narrow" className={styles.page}>
        <h1 className={styles.titre}>{page.heading}</h1>
        {resultat === null ? (
          <p className={styles.intro} role="status">
            {t.chargement}
          </p>
        ) : (
          <>
            <p className={resultat.ok ? styles.message : styles.erreur} role={resultat.ok ? 'status' : 'alert'}>
              {resultat.texte}
            </p>
            <Link to={t.confirmerEmail.espace.to} className={buttonClassName({ className: styles.lienDiscret })}>
              {t.confirmerEmail.espace.label}
            </Link>
          </>
        )}
      </Container>
    </>
  );
}
