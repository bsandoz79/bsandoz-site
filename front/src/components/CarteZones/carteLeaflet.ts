/**
 * Partie Leaflet de la carte, chargée à la demande (import dynamique) : rien n'est téléchargé
 * tant que le visiteur n'a pas choisi d'afficher la carte.
 */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RAYON_KM, carteTextes, type Ville } from '../../data/zones';

export type Carte = {
  /** Affiche toutes les zones (`null`) ou une seule ville, et zoome dessus. */
  afficher: (id: string | null) => void;
  detruire: () => void;
};

/** Couleur d'une variable CSS du thème (les cercles suivent le thème nuit ou clair). */
function couleur(nom: string, secours: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(nom).trim() || secours;
}

export function creerCarte(element: HTMLElement, villes: Ville[]): Carte {
  const carte = L.map(element, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: `<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">${carteTextes.attribution}</a>`,
  }).addTo(carte);

  const rose = couleur('--color-rose', 'crimson');
  const blanc = couleur('--color-text-on-dark', 'white');
  const cercles = new Map(
    villes.map((ville) => {
      const groupe = L.featureGroup([
        L.circle([ville.lat, ville.lng], {
          radius: RAYON_KM * 1000,
          color: rose,
          weight: 2,
          fillColor: rose,
          fillOpacity: 0.12,
        }),
        L.circleMarker([ville.lat, ville.lng], { radius: 6, color: blanc, weight: 2, fillColor: rose, fillOpacity: 1 }).bindTooltip(
          ville.nom,
          { permanent: true, direction: 'top', offset: [0, -8] },
        ),
      ]);
      return [ville.id, groupe] as const;
    }),
  );
  // Limites calculées depuis le centre et le rayon : un cercle pas encore posé sur la carte n'en a pas.
  const limitesDe = new Map(villes.map((ville) => [ville.id, L.latLng(ville.lat, ville.lng).toBounds(RAYON_KM * 2000)] as const));

  function toutesLesLimites(ids: string[]) {
    const limites = L.latLngBounds([]);
    for (const cle of ids) {
      const l = limitesDe.get(cle);
      if (l) limites.extend(l);
    }
    return limites;
  }

  function afficher(id: string | null) {
    const ids = id && cercles.has(id) ? [id] : [...cercles.keys()];
    for (const [cle, groupe] of cercles) {
      if (ids.includes(cle)) groupe.addTo(carte);
      else groupe.remove();
    }
    carte.flyToBounds(toutesLesLimites(ids), { padding: [24, 24], duration: 0.8 });
  }

  // Premier affichage : toutes les zones, sans animation.
  carte.fitBounds(toutesLesLimites([...cercles.keys()]), { padding: [24, 24] });
  for (const groupe of cercles.values()) groupe.addTo(carte);

  return { afficher, detruire: () => carte.remove() };
}
