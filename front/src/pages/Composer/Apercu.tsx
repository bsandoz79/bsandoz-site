import { SitePreview } from '../../blocks/SitePreview';
import { apercuTextes, modeleApercu } from '../../data/apercu';
import type { Configuration } from '../../data/calculs';
import { bonASavoir } from '../../data/configurateur';
import type { Onglet } from './stockage';
import styles from './Composer.module.css';

type Props = { onglet: Onglet; config: Configuration };

/**
 * Colonne de droite du configurateur : aperçu en direct (sites) ou « bon à savoir » (informatique).
 * Masquée sous 1 000 px de large : seule la colonne des choix reste.
 */
export function Apercu({ onglet, config }: Props) {
  if (onglet === 'informatique') {
    return (
      <aside className={`${styles.apercu} anim-appear`} aria-label={bonASavoir.label}>
        <div className={styles.bonASavoir}>
          <p className={styles.bonEyebrow}>{bonASavoir.eyebrow}</p>
          <p className={styles.bonTitre}>{bonASavoir.title}</p>
          <p>{bonASavoir.text}</p>
        </div>
        <div className={styles.deroule}>
          <p className={styles.bonEyebrow}>{bonASavoir.etapesTitre}</p>
          <ol className={styles.derouleListe}>
            {bonASavoir.etapes.map((etape) => (
              <li key={etape.titre}>
                <strong>{etape.titre}</strong> : {etape.texte}
              </li>
            ))}
          </ol>
        </div>
      </aside>
    );
  }

  const { modele, description } = modeleApercu(config);
  return (
    <SitePreview
      className={styles.apercu}
      label={apercuTextes.label}
      caption={apercuTextes.caption}
      description={description}
      model={modele}
      emptyMessage={apercuTextes.vide}
    />
  );
}
