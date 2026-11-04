# Aperçu de site (`SitePreview`)

Dessine un site d'exemple dans une fenêtre de navigateur : en-tête, hero, sections (calculateur, réservation, boutique, galerie, avis…), pied de page, bandeau « installer l'appli » et résultat de recherche. Tout vient d'un modèle : le bloc ne connaît aucun métier.

## Utilisation
```tsx
import { SitePreview } from '../blocks/SitePreview';

<SitePreview
  label="Aperçu de votre futur site"
  caption="Aperçu en direct · exemple"
  description="Site d'exemple avec réservation en ligne."
  model={{
    name: 'Atelier Brillance', tagline: 'Detailing', domain: 'www.atelier.fr', accent: '#1F6FB2',
    hero: 'Votre voiture comme neuve', cta: 'Réserver', nav: ['Accueil', 'Prestations'],
    sections: [{ type: 'contactButtons', buttons: ['Appeler', 'Écrire'] }],
    footer: ['Atelier Brillance', 'Mentions légales'],
  }}
  emptyMessage="Choisissez un type de site."
/>
```

## Propriétés
| Prop | Type | Rôle |
| --- | --- | --- |
| `label` | `string` | nom de l'encadré (`aside`) |
| `caption` | `string` | mention au-dessus |
| `description` | `string` | phrase lue par les lecteurs d'écran à la place du dessin |
| `model` | `SitePreviewModel \| null` | site à dessiner |
| `emptyMessage` | `string` | affiché sans modèle |

Sections possibles (`type`) : `calculator`, `booking`, `table`, `shop`, `note`, `gallery`, `beforeAfter`, `reviews`, `contactForm`, `contactButtons`.

La couleur du site d'exemple (`accent`) passe par la variable CSS `--preview-accent`.

## Accessibilité
- Le dessin est caché aux lecteurs d'écran (`aria-hidden`) ; la `description`, en zone `aria-live`, résume l'aperçu et annonce ses changements.
- Animation d'apparition des sections coupée si « réduire les animations ».
