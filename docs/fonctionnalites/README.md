# Fonctionnalités

Une fiche par fonctionnalité : à quoi elle sert, le **chemin** suivi (fichiers et données), **comment l'appeler**, si elle est **réutilisable**, un **schéma**, ses **tests** et comment la **modifier**. Les schémas (Mermaid) s'affichent directement sur GitHub.

| Fiche | En bref | Réutilisable |
| --- | --- | --- |
| [Vue d'ensemble](00-vue-ensemble.md) | comment les dossiers s'articulent | — |
| [Navigation et mise en page](navigation.md) | routes, en-tête, pied de page, barre mobile | en partie (blocs) |
| [Prix et calculs](prix-et-calculs.md) | source unique des prix, estimation, packs, marché | oui (fonctions pures) |
| [Configurateur](configurateur.md) | `/composer` : composer son site, estimation | non (propre au site), blocs oui |
| [Aperçu en direct](apercu.md) | faux site qui se construit selon les choix | oui (`SitePreview`) |
| [Simulateur Tarifs](simulateur-tarifs.md) | simulation du Fonctionnel sur `/tarifs` | non, calculs oui |
| [Demande de devis](demande-de-devis.md) | parcours en 5 étapes + envoi par mail | oui (`Stepper`, `TextField`, script PHP adaptable) |
| [Rendez-vous découverte](rendez-vous.md) | calendrier, créneaux, zone de 50 km | oui (`Calendar`) |
| [Pages de contenu](pages-de-contenu.md) | accueil, métiers, réalisations, à propos, FAQ, informatique, légal | blocs oui |
| [SEO](seo.md) | titres, canonique, sitemap, données structurées | oui (fonctions pures) |
| [Blocs réutilisables](blocs.md) | boîte à outils @bsandoz79/blocs : 15 blocs, livraison par copie dans le site d'un client | oui |
| [API](api.md) | Symfony modulaire, route `/sante` | modules oui |
| [Module Booking](booking.md) | réservation, créneau pris refusé, mails + .ics, annulation | oui (API d'un client) |
| [Fil de messages](fil-de-messages.md) | échanges d'une demande : site, réponses par mail (IMAP), notes d'appel | oui (module Prospect) |
| [Comptes et connexion](comptes-et-connexion.md) | compte ouvert au premier rendez-vous, connexion par lien ou mot de passe, appareils | oui (module Auth) |
| [Mise en place chez un client](mise-en-place-client.md) | fiches d'installation sur un autre domaine, client autonome ou « je gère pour lui » | — |
| [Back-office](back-office.md) | `/admin` : demandes, devis, réponses, notes d'appel, prix | en partie |
| [Déploiement et CI](deploiement-et-ci.md) | tests automatiques, mise en ligne, retour à la V1 | — |

Règle : quand une fonctionnalité change, sa fiche est mise à jour dans la même branche (voir `.claude/CLAUDE.md`).
