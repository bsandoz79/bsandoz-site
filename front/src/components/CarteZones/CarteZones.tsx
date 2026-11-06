import { useEffect, useRef, useState } from 'react';
import { Button, ChoiceChips, Container } from '@bsandoz79/blocs';
import { choisir as choisirConsentement, useConsentement } from '../../app/consentement';
import { aDistance, carteTextes, detailCalcul, formatFrais, fraisKilometriques, listeVilles, origineCoutKm, villes, zoneSansFrais } from '../../data/zones';
import type { Carte } from './carteLeaflet';
import styles from './CarteZones.module.css';
import { usePosition, type EtatPosition } from './usePosition';

const t = carteTextes;
const TOUTES = 'toutes';

/** Avance de chargement : la carte se prépare un peu avant d'arriver à l'écran. */
const MARGE_APPROCHE = '300px';

/**
 * Zones d'intervention : cercles de 50 km sans frais autour d'Amiens et d'Abbeville, une ville au choix avec zoom.
 * La carte (OpenStreetMap, Leaflet) se charge d'elle-même quand on approche en défilant,
 * sauf si le visiteur a refusé les services tiers dans le bandeau.
 * Quand elle apparaît à l'écran, elle propose de situer le visiteur par rapport aux zones.
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
  const [prete, setPrete] = useState(false);
  const { etat: position, demander } = usePosition(cadre);

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
      setPrete(true);
    });
    return () => {
      etat.actif = false;
      carte.current?.detruire();
      carte.current = null;
      setPrete(false);
    };
  }, [active]);

  // Place le visiteur sur la carte dès que la carte et la position sont là.
  useEffect(() => {
    if (prete && position.statut === 'trouvee') carte.current?.placerPosition(position.lat, position.lng, position.situation.ville.id);
  }, [prete, position]);

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
          <p className={styles.intro}>{t.intro(zoneSansFrais())}</p>
          <ChoiceChips
            legend={t.choix}
            name="carte-ville"
            choices={[{ value: TOUTES, label: t.toutes }, ...villes.map((v) => ({ value: v.id, label: v.nom }))]}
            value={ville}
            onChange={choisir}
          />
        </div>

        <div className={styles.colonneCarte}>
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
          <Position etat={position} demander={demander} />
        </div>
      </Container>
    </section>
  );
}

/** Message sous la carte selon la position du visiteur, et bouton discret pour (re)demander. */
function Position({ etat, demander }: { etat: EtatPosition; demander: () => void }) {
  const p = t.position;
  let message: string | null = null;
  let calcul: string | null = null;
  let ton = styles.info;
  if (etat.statut === 'enCours') message = p.enCours;
  if (etat.statut === 'trouvee') {
    const { ville, km, dansZone } = etat.situation;
    message = dansZone ? p.dansZone(aDistance(km, ville.nom)) : p.horsZone(aDistance(km, ville.nom), formatFrais(fraisKilometriques(km)));
    ton = dansZone ? styles.succes : styles.info;
    if (!dansZone) calcul = `${p.calcul(detailCalcul(km))} (${origineCoutKm()})`;
  }
  if (etat.statut === 'refusee' && etat.bloquee) message = p.bloquee;
  if (etat.statut === 'introuvable') message = p.introuvable;
  const bouton = etat.statut === 'refusee' || etat.statut === 'introuvable' || etat.statut === 'attente';

  return (
    <div className={styles.position}>
      <div className={message ? `${styles.message} ${ton}` : styles.vide} aria-live="polite">
        {message && <p>{message}</p>}
        {calcul && <p className={styles.calcul}>{calcul}</p>}
      </div>
      {bouton && (
        <button type="button" className={styles.situer} onClick={demander}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <path
              d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          {p.bouton}
        </button>
      )}
    </div>
  );
}
