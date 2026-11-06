import { useEffect, useRef, useState } from 'react';
import { Button, ChoiceChips, Container } from '@bsandoz79/blocs';
import { CLE_CARTE, carteTextes, listeVilles, villes } from '../../data/zones';
import type { Carte } from './carteLeaflet';
import styles from './CarteZones.module.css';

const t = carteTextes;
const TOUTES = 'toutes';

function carteAcceptee() {
  try {
    return window.localStorage.getItem(CLE_CARTE) === 'oui';
  } catch {
    return false;
  }
}

/**
 * Zones d'intervention : cercles de 50 km autour de chaque ville, une ville au choix avec zoom.
 * La carte (OpenStreetMap) ne se charge qu'à la demande du visiteur, puis aux visites suivantes.
 */
export function CarteZones() {
  const [acceptee, setAcceptee] = useState(carteAcceptee);
  const [ville, setVille] = useState<string>(TOUTES);
  const conteneur = useRef<HTMLDivElement>(null);
  const carte = useRef<Carte | null>(null);

  // Crée la carte (Leaflet chargé à la demande) une fois acceptée.
  useEffect(() => {
    if (!acceptee || !conteneur.current) return;
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
  }, [acceptee]);

  function choisir(id: string) {
    setVille(id);
    carte.current?.afficher(id === TOUTES ? null : id);
  }

  function accepter() {
    try {
      window.localStorage.setItem(CLE_CARTE, 'oui');
    } catch {
      // Stockage indisponible : la carte vaut pour cette visite.
    }
    setAcceptee(true);
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

        <div className={styles.cadre}>
          {acceptee ? (
            <div ref={conteneur} className={styles.carte} role="img" aria-label={t.legendeCarte(nomZone)} />
          ) : (
            <div className={styles.consentement}>
              <p>{t.consentement.texte}</p>
              <Button onClick={accepter}>{t.consentement.bouton}</Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
