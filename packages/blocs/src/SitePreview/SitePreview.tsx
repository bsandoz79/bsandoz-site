import type { CSSProperties } from 'react';
import styles from './SitePreview.module.css';

/** Une section du site d'exemple. Tous les textes sont fournis par l'appelant. */
export type PreviewSection =
  | { type: 'calculator'; title: string; label: string; value: string; result: string }
  | { type: 'booking'; title: string; subtitle: string; days: string[]; slots: string[]; deposit?: string }
  | { type: 'table'; title: string; details: string[] }
  | { type: 'shop'; title: string; products: string[] }
  | { type: 'note'; text: string }
  | { type: 'gallery'; count: number }
  | { type: 'beforeAfter'; before: string; after: string }
  | { type: 'reviews'; title: string; text: string }
  | { type: 'contactForm'; title: string }
  | { type: 'contactButtons'; buttons: string[] };

export type SitePreviewModel = {
  name: string;
  tagline: string;
  domain: string;
  /** Couleur principale du site d'exemple (couleur CSS). */
  accent: string;
  hero: string;
  cta: string;
  nav: string[];
  /** Petites mentions dans la barre de navigation (« FR | EN », « Mon compte »). */
  navBadges?: string[];
  /** Initiales du logo, si un logo est prévu. */
  logo?: string;
  /** Résultat de recherche affiché au-dessus du site. */
  search?: { query: string; title: string; url: string };
  sections: PreviewSection[];
  footer: string[];
  /** Bandeau « installer l'appli ». */
  install?: { title: string; text: string };
};

export type SitePreviewProps = {
  /** Nom de l'aperçu (pour les lecteurs d'écran). */
  label: string;
  /** Mention au-dessus de l'aperçu (« Aperçu en direct · exemple »). */
  caption?: string;
  /** Phrase décrivant l'aperçu, lue à la place du dessin. */
  description: string;
  /** Modèle du site ; sans modèle, `emptyMessage` est affiché. */
  model: SitePreviewModel | null;
  emptyMessage?: string;
  className?: string;
};

function Section({ section }: { section: PreviewSection }) {
  switch (section.type) {
    case 'calculator':
      return (
        <div className={styles.block}>
          <span className={styles.blockTitle}>{section.title}</span>
          <span className={styles.row}>
            <span>{section.label}</span>
            <strong>{section.value}</strong>
          </span>
          <span className={styles.slider}>
            <span />
          </span>
          <span className={styles.accentText}>{section.result}</span>
        </div>
      );
    case 'booking':
      return (
        <div className={styles.block}>
          <span className={styles.row}>
            <span className={styles.blockTitle}>{section.title}</span>
            <span className={styles.muted}>{section.subtitle}</span>
          </span>
          <span className={styles.days}>
            {section.days.map((day, i) => (
              <span key={day} className={i === 3 ? styles.dayOn : undefined}>
                {day}
              </span>
            ))}
          </span>
          <span className={styles.slots}>
            {section.slots.map((slot, i) => (
              <span key={slot} className={i === 0 ? styles.slotOn : undefined}>
                {slot}
              </span>
            ))}
          </span>
          {section.deposit && <span className={styles.deposit}>{section.deposit}</span>}
        </div>
      );
    case 'table':
      return (
        <div className={styles.block}>
          <span className={styles.blockTitle}>{section.title}</span>
          <span className={styles.slots}>
            {section.details.map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
          </span>
        </div>
      );
    case 'shop':
      return (
        <div className={styles.block}>
          <span className={styles.blockTitle}>{section.title}</span>
          <span className={styles.products}>
            {section.products.map((product, i) => (
              <span key={`${product}-${i}`} className={styles.product}>
                <span className={styles.productImage} />
                <span>{product}</span>
              </span>
            ))}
          </span>
        </div>
      );
    case 'note':
      return <div className={`${styles.block} ${styles.note}`}>{section.text}</div>;
    case 'gallery':
      return (
        <div className={styles.gallery}>
          {Array.from({ length: section.count }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      );
    case 'beforeAfter':
      return (
        <div className={styles.beforeAfter}>
          <span>{section.before}</span>
          <span>{section.after}</span>
          <span className={styles.handle} />
        </div>
      );
    case 'reviews':
      return (
        <div className={`${styles.block} ${styles.reviews}`}>
          <span className={styles.blockTitle}>{section.title}</span>
          <span className={styles.muted}>{section.text}</span>
        </div>
      );
    case 'contactForm':
      return (
        <div className={styles.block}>
          <span className={styles.blockTitle}>{section.title}</span>
          <span className={styles.field} />
          <span className={styles.field} />
        </div>
      );
    case 'contactButtons':
      return (
        <div className={styles.buttons}>
          {section.buttons.map((button) => (
            <span key={button}>{button}</span>
          ))}
        </div>
      );
  }
}

/**
 * Aperçu dessiné d'un site d'exemple, construit à partir d'un modèle.
 * Le dessin est caché aux lecteurs d'écran, qui lisent la `description`.
 */
export function SitePreview({ label, caption, description, model, emptyMessage, className }: SitePreviewProps) {
  const style = model ? ({ '--preview-accent': model.accent } as CSSProperties) : undefined;

  return (
    <aside className={[styles.preview, className ?? ''].filter(Boolean).join(' ')} aria-label={label} style={style}>
      {caption && <p className={styles.caption}>{caption}</p>}
      <p className="sr-only" aria-live="polite">
        {description}
      </p>
      {model ? (
        <div className={styles.stage} aria-hidden="true">
          {model.search && (
            <div className={styles.search}>
              <span className={styles.muted}>{model.search.query}</span>
              <span className={styles.searchTitle}>{model.search.title}</span>
              <span className={styles.searchUrl}>{model.search.url}</span>
            </div>
          )}
          <div className={styles.browser}>
            <div className={styles.bar}>
              <span className={styles.dots}>
                <span />
                <span />
                <span />
              </span>
              <span className={styles.address}>{model.domain}</span>
            </div>
            <div className={styles.siteHeader}>
              <span className={styles.brand}>
                {model.logo && <span className={styles.logo}>{model.logo}</span>}
                <span>{model.name}</span>
              </span>
              <span className={styles.nav}>
                {model.nav.map((item) => (
                  <span key={item}>{item}</span>
                ))}
                {model.navBadges?.map((badge) => (
                  <span key={badge} className={styles.navBadge}>
                    {badge}
                  </span>
                ))}
              </span>
            </div>
            <div className={styles.hero}>
              <span className={styles.heroTag}>{model.tagline}</span>
              <span className={styles.heroTitle}>{model.hero}</span>
              <span className={styles.heroCta}>{model.cta}</span>
            </div>
            <div className={styles.sections}>
              {model.sections.map((section, i) => (
                <div key={`${section.type}-${i}`} className={styles.apparition}>
                  <Section section={section} />
                </div>
              ))}
            </div>
            <div className={styles.footer}>
              {model.footer.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            {model.install && (
              <div className={`${styles.install} ${styles.apparition}`}>
                <span className={styles.installIcon} />
                <span>
                  <strong>{model.install.title}</strong> {model.install.text}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        emptyMessage && <p className={styles.empty}>{emptyMessage}</p>
      )}
    </aside>
  );
}
