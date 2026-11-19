import type { PreviewSection, SitePreviewModel } from '@bsandoz79/blocs';
import type { Configuration } from './calculs';
import { options, type MetierId, type OptionId } from './offres';

/** Entreprises d'exemple de l'aperçu (cahier des charges, section 5). */
export const entreprisesExemple: Record<
  MetierId,
  { nom: string; activite: string; slug: string; couleur: string; accroche: string; recherche: string }
> = {
  artisan: {
    nom: 'Atelier Brillance',
    activite: 'Detailing auto à domicile',
    slug: 'atelier-brillance',
    couleur: '#1F6FB2',
    accroche: 'Votre voiture comme neuve, sans bouger de chez vous',
    recherche: 'detailing auto Amiens',
  },
  batiment: {
    nom: 'Atelier Vasseur',
    activite: 'Plomberie et chauffage',
    slug: 'atelier-vasseur',
    couleur: '#1E5A8C',
    accroche: 'Dépannage et installation, devis rapide',
    recherche: 'plombier Amiens',
  },
  beaute: {
    nom: 'Salon Éclat',
    activite: 'Coiffure et esthétique',
    slug: 'salon-eclat',
    couleur: '#A23A6B',
    accroche: 'Réservez votre rendez-vous en ligne',
    recherche: 'coiffeur Amiens',
  },
  liberal: {
    nom: 'Cabinet Aubrac',
    activite: 'Conseil juridique',
    slug: 'cabinet-aubrac',
    couleur: '#22344F',
    accroche: 'Vos questions, une réponse claire',
    recherche: 'avocat Amiens',
  },
  cours: {
    nom: 'Studio Tempo',
    activite: 'Coaching sportif',
    slug: 'studio-tempo',
    couleur: '#D9572B',
    accroche: 'Réservez votre séance en un clic',
    recherche: 'coach sportif Amiens',
  },
  hebergement: {
    nom: 'Gîte Les Tilleuls',
    activite: 'Gîte et chambres d’hôtes',
    slug: 'gite-les-tilleuls',
    couleur: '#4F7A3A',
    accroche: 'Réservez en direct, sans commission',
    recherche: 'gîte près d’Amiens',
  },
  association: {
    nom: 'Club Horizon',
    activite: 'Association sportive',
    slug: 'club-horizon',
    couleur: '#2C6E91',
    accroche: 'Actualités, événements et adhésions',
    recherche: 'club sportif Amiens',
  },
  evenementiel: {
    nom: 'Studio Lumière',
    activite: 'Photographe de mariage',
    slug: 'studio-lumiere',
    couleur: '#5B4A8B',
    accroche: 'Votre date est-elle libre ? Demandez-la',
    recherche: 'photographe mariage Amiens',
  },
  commerce: {
    nom: 'Maison Lumen',
    activite: 'Boutique déco à Amiens',
    slug: 'maison-lumen',
    couleur: '#8A5A44',
    accroche: 'Des objets choisis, livrés ou à retirer',
    recherche: 'boutique déco Amiens',
  },
  restaurant: {
    nom: 'Le Petit Comptoir',
    activite: 'Bistrot de quartier',
    slug: 'le-petit-comptoir',
    couleur: '#B5452B',
    accroche: 'Cuisine maison, ambiance de quartier',
    recherche: 'restaurant Amiens',
  },
  sante: {
    nom: 'Studio Équilibre',
    activite: 'Coach bien-être',
    slug: 'studio-equilibre',
    couleur: '#2E8B6F',
    accroche: 'Prenez soin de vous, à votre rythme',
    recherche: 'coach bien-être Amiens',
  },
  autre: {
    nom: 'Votre entreprise',
    activite: 'Votre activité',
    slug: 'votre-entreprise',
    couleur: '#16213E',
    accroche: 'Votre accroche ici',
    recherche: 'votre métier Amiens',
  },
};

export const apercuTextes = {
  label: 'Aperçu de votre futur site',
  caption: "Exemple · squelette sans style : il montre seulement où se placent les parties. Votre site aura son propre design.",
  vide: "Choisissez un type de site : l'aperçu se remplit au fil de vos choix.",
  descriptionVide: "L'aperçu est vide : aucun type de site choisi.",
  description: (nom: string, fonctions: string[]) =>
    fonctions.length
      ? `Aperçu d'exemple du site « ${nom} », avec : ${fonctions.join(', ')}.`
      : `Aperçu d'exemple du site « ${nom} ».`,
  nav: {
    accueil: 'Accueil',
    prestations: 'Prestations',
    realisations: 'Réalisations',
    aPropos: 'À propos',
    boutique: 'Boutique',
    contact: 'Contact',
    langues: 'FR | EN',
    compte: 'Mon compte',
  },
  cta: {
    rdv: 'Réserver',
    table: 'Réserver une table',
    boutique: 'Voir la boutique',
    clickcollect: 'Commander',
    contact: 'Me contacter',
  },
  calcul: {
    titre: 'Calculez votre prix',
    exemples: {
      surface: ['Surface', '120 m²', '84 €'],
      vehicule: ['Véhicule', 'SUV', '89 €'],
      quantite: ['Quantité', '25 pièces', '210 €'],
      distance: ['Distance', '18 km', '27 €'],
    } as Record<string, [string, string, string]>,
    defaut: ['Votre critère', 'à définir', '— €'] as [string, string, string],
    prix: (montant: string) => `Prix estimé : ${montant}`,
  },
  rdv: {
    titre: 'Réservez en ligne',
    lieux: {
      client: "À domicile · frais selon l'adresse",
      chezvous: 'Sur place',
      deux: 'À domicile ou sur place',
    } as Record<string, string>,
    lieuDefaut: 'Créneaux en direct',
    jours: ['9', '10', '11', '12', '13', '14', '15'],
    creneaux: ['9:00', '10:30', '14:00'],
    acompte: 'Acompte de 30 € payé en ligne · carte, Apple Pay, Google Pay',
  },
  table: { titre: 'Réserver une table', details: ['4 personnes', 'Ven. 13', '20:00'] },
  boutique: { titre: 'Boutique', produits: ['Produit · 24 €', 'Produit · 39 €', 'Produit · 18 €'] },
  clickcollect: 'Commandez en ligne, retirez sur place dès 18:30',
  avantApres: { avant: 'Avant', apres: 'Après' },
  avis: { titre: '★★★★★ Avis Google', texte: '[note et avis réels du client]' },
  contact: 'Contact',
  boutonsContact: ['Appeler', 'Écrire un mail'],
  piedDePage: 'Mentions légales',
  appli: { titre: "Installer l'appli", texte: "sur l'écran d'accueil" },
  recherche: (requete: string) => `Google · « ${requete} »`,
};

const initiales = (nom: string) =>
  nom
    .split(' ')
    .map((mot) => mot.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

/**
 * Construit le modèle de l'aperçu à partir de la configuration (logique de la maquette `Configurateur`).
 */
export function modeleApercu(config: Configuration): { modele: SitePreviewModel | null; description: string } {
  const { formule } = config;
  if (!formule) return { modele: null, description: apercuTextes.descriptionVide };

  const a = (id: OptionId) => config.options.includes(id);
  const entreprise = entreprisesExemple[config.metier ?? 'autre'];
  const t = apercuTextes;

  const nav = [t.nav.accueil, t.nav.prestations];
  if (a('galerie') || a('avantapres')) nav.push(t.nav.realisations);
  if (a('page')) nav.push(t.nav.aPropos);
  if (a('boutique')) nav.push(t.nav.boutique);
  if (formule !== 'vitrine') nav.push(t.nav.contact);

  const navBadges: string[] = [];
  if (a('anglais')) navBadges.push(t.nav.langues);
  if (a('espace')) navBadges.push(t.nav.compte);

  const cta = a('rdv')
    ? t.cta.rdv
    : a('table')
      ? t.cta.table
      : a('boutique')
        ? t.cta.boutique
        : a('clickcollect')
          ? t.cta.clickcollect
          : t.cta.contact;

  const sections: PreviewSection[] = [];
  if (a('calcul')) {
    const [label, value, prix] = t.calcul.exemples[config.precisions.calcul ?? ''] ?? t.calcul.defaut;
    sections.push({ type: 'calculator', title: t.calcul.titre, label, value, result: t.calcul.prix(prix) });
  }
  if (a('rdv')) {
    sections.push({
      type: 'booking',
      title: t.rdv.titre,
      subtitle: t.rdv.lieux[config.precisions.rdv ?? ''] ?? t.rdv.lieuDefaut,
      days: t.rdv.jours,
      slots: t.rdv.creneaux,
      deposit: a('acompte') ? t.rdv.acompte : undefined,
    });
  }
  if (a('table')) sections.push({ type: 'table', title: t.table.titre, details: t.table.details });
  if (a('boutique')) sections.push({ type: 'shop', title: t.boutique.titre, products: t.boutique.produits });
  if (a('clickcollect')) sections.push({ type: 'note', text: t.clickcollect });
  if (a('galerie')) sections.push({ type: 'gallery', count: 3 });
  if (a('avantapres')) sections.push({ type: 'beforeAfter', before: t.avantApres.avant, after: t.avantApres.apres });
  if (a('avis')) sections.push({ type: 'reviews', title: t.avis.titre, text: t.avis.texte });
  if (formule === 'vitrine') sections.push({ type: 'contactButtons', buttons: t.boutonsContact });
  else sections.push({ type: 'contactForm', title: t.contact });

  const modele: SitePreviewModel = {
    name: entreprise.nom,
    tagline: entreprise.activite,
    domain: `www.${entreprise.slug}.fr`,
    accent: entreprise.couleur,
    hero: entreprise.accroche,
    cta,
    nav,
    navBadges,
    logo: a('logo') ? initiales(entreprise.nom) : undefined,
    search:
      a('seo') || formule === 'vitrinePlus'
        ? {
            query: t.recherche(entreprise.recherche),
            title: `${entreprise.nom} – ${entreprise.activite}`,
            url: `www.${entreprise.slug}.fr`,
          }
        : undefined,
    sections,
    footer: [entreprise.nom, t.piedDePage],
    install: a('pwa') ? { title: t.appli.titre, text: t.appli.texte } : undefined,
  };

  const fonctions = (Object.keys(options) as OptionId[]).filter(a).map((id) => options[id].nom.toLowerCase());
  return { modele, description: t.description(entreprise.nom, fonctions) };
}
