import { useEffect, useRef, useState } from 'react';
import { Button, ChoiceChips, Container } from '@bsandoz79/blocs';
import { choisir as choisirConsentement, useConsentement } from '../../app/consentement';
import { carteTextes, listeVilles, villes } from '../../data/zones';
import type { Carte } from './carteLeaflet';
import styles from './CarteZones.module.css';

const t = carteTextes;
const TOUTES = 'toutes';

/** Avance de chargement : la carte se prépare un peu avant d'arriver à l'écran. */
const MARGE_APPROCHE = '300px';

/**
 * Zones d'intervention : cercles de 50 km autour de chaque ville, une ville au choix avec zoom.
 * La carte (OpenStreetMap, Leaflet) se charge d'elle-même quand on approche en défilant,
 * sauf si le visiteur a refusé les services tiers dans le bandeau.
 */
export function CarteZones() {
  const { choix } = useConsentement();
  const autorisee = choix !== 'refuse';
  // Sans IntersectionObserver (vieux navigateur), la carte se charge tout de suite.
  const [proche, setProche] = useState(() => typeof IntersectionObserver === 'undefined');
  const [ville, setVille] = useState<string>(TOUTES);
  const cadre = useRef<HTMLDivElement>(null);
  const conteneur = useRef<HTMLDivElement>(null);
  const carte = useRef<Carte | null>(null);

  // Surveille l'arrivée de la carte à l'écran.
  useEffect(() => {
    if (proche || !cadre.current) return;
    const observateur = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) setProche(true);
      },
      { rootMargin: MARGE_APPROCHE },
    );
    observateur.observe(cadre.current);
    return () => observateur.disconnect();
  }, [proche]);

  const active = autorisee && proche;

  // Crée la carte (Leaflet chargé à la demande).
  useEffect(() => {
    if (!active || !conteneur.current) return;
    const etat = { actif: true };
    import('./carteLeaflet').then(({ creerCarte }) => {
      if (!etat.actif || !conteneur.current) return;
      carte.current = creerCarte(conteneur.current, villes);
    });
    return () => {
      etat.actif = false;
      carte.current?.detruire();
      carte.current = null;
    };
  }, [active]);

  function choisir(id: string) {
    setVille(id);
    carte.current?.afficher(id === TOUTES ? null : id);
  }

  const nomZone = ville === TOUTES ? listeVilles(villes.map((v) => v.nom)) : (villes.find((v) => v.id === ville)?.nom ?? '');

  return (
    <section className={styles.section} aria-labelledby="carte-titre">
      <Container className={styles.inner}>
        <div className={styles.texte}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h2 id="carte-titre" className={styles.titre}>
            {t.titre}
          </h2>
          <p className={styles.intro}>{t.intro(listeVilles(villes.map((v) => v.nom)))}</p>
          <ChoiceChips
            legend={t.choix}
            name="carte-ville"
            choices={[{ value: TOUTES, label: t.toutes }, ...villes.map((v) => ({ value: v.id, label: v.nom }))]}
            value={ville}
            onChange={choisir}
          />
        </div>

        <div ref={cadre} className={styles.cadre}>
          {autorisee ? (
            <div ref={conteneur} className={styles.carte} role="img" aria-label={t.legendeCarte(nomZone)} />
          ) : (
            <div className={styles.consentement}>
              <p>{t.refusee.texte}</p>
              <Button variant="secondary" onClick={() => choisirConsentement('accepte')}>
                {t.refusee.bouton}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
