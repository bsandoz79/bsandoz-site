# Cahier des charges – bsandoz.fr

Site freelance de Baptiste Sandoz (micro-entreprise « Création de sites web & développement », Amiens). Il transforme un visiteur (artisan, commerçant, indépendant, particulier) en demande de devis ou en rendez-vous qualifié.

Maquette de référence : `docs/maquette/*.dc.html` (reproduire fidèlement le design, les textes et les comportements).

---

## 1. Objectifs
1. Comprendre en 5 secondes ce que fait Baptiste et pour qui.
2. Montrer des réalisations concrètes et testables.
3. Afficher des prix clairs et expliquer la différence entre vitrine et site fonctionnel.
4. Laisser le visiteur composer son projet (configurateur avec aperçu en direct) ou le décrire avec ses mots.
5. Prendre un rendez-vous découverte gratuit (1 h), chez lui dans un rayon de 50 km d'Amiens, en visio ou par téléphone.
6. Suivre la demande dans un espace client, avec les échanges synchronisés avec les mails.
7. Être bien référencé localement (« création site internet Amiens », pages par métier).

Différent de `portfolio.bsandoz.fr` (destiné aux recruteurs) : ici on parle bénéfices, sans jargon. Le portfolio est lié dans le menu, la section « Pourquoi moi » et le pied de page.

## 2. Deux catégories de services (onglets en haut)
- **Sites & applis** : sites vitrines, sites fonctionnels (rendez-vous, devis, boutique, appli…).
- **Informatique sur place** : installation d'ordinateur, passage de Windows à Linux, imprimante/box/wifi, dépannage et nettoyage, seconde vie d'un vieil ordinateur, sauvegarde des données, formation à domicile. **Réseau et NAS = « Bientôt disponible »** (affiché, non sélectionnable, pas de prix). Pas de prix pour l'instant : « Tarif sur devis ». Public : particulier ou professionnel.

## 3. Pages
| Page | URL | Contenu |
| --- | --- | --- |
| Accueil | `/` | Hero, bande des métiers, problèmes → solutions, offres, réalisations, méthode, pourquoi moi, appel à l'action, pied de page (maquette `Main` et `Mobile`) |
| Tarifs | `/tarifs` | 3 formules, encadré « pourquoi le fonctionnel coûte plus cher », simulateur, après la mise en ligne (`Tarifs`) |
| Composer mon site | `/composer` | Configurateur interactif + aperçu en direct (`Configurateur`) |
| Réalisations | `/realisations` | Études de cas (besoin, solution, captures, démo) |
| Pages métier | `/site-artisan`, `/site-ecommerce`, `/site-restaurant`, `/site-independant` | Textes en section 9, exemple de réalisation, appel à l'action |
| Informatique | `/informatique` | Services sur place, « Bientôt disponible » pour le réseau |
| À propos | `/a-propos` | Photo, parcours, valeurs, zone |
| Demande de devis | `/devis` | Parcours en 5 étapes (`Devis`) |
| Rendez-vous | `/rendez-vous` | Rendez-vous découverte gratuit (`RDV`) |
| FAQ | `/faq` | Section 9.7 |
| Légal | `/mentions-legales`, `/cgv`, `/confidentialite` | Obligations légales (SIRET à ajouter après immatriculation) |
| Espace client | `/mon-espace` | (`EspaceClient`) |
| Back-office | `/admin` | Demandes, devis, prix, disponibilités (Baptiste seul) |

## 4. Offres et prix (sites)
Prix nets, TVA non applicable (art. 293 B du CGI). Après mise en ligne : 50 € de l'heure, demi-heure entamée due. Abonnement hébergement + maintenance : sur demande, non mis en avant.

| Formule | Prix | Contenu | Délai |
| --- | --- | --- | --- |
| Vitrine | 99 € | 1 page sur un modèle, contenus fournis, 1 série de retouches, mise en ligne + HTTPS, mentions légales, 1 h de formation si le client gère l'hébergement ; domaine et hébergement à sa charge | 3 jours |
| Vitrine+ | 390 € | Jusqu'à 5 pages, design personnalisé, formulaire, galerie, SEO local + fiche Google, 2 séries de retouches | 1 à 2 semaines |
| Fonctionnel | dès 989 € | Sur mesure : RDV, devis, boutique, appli, espace client | 3 à 6 semaines |

### Options (prix à garder dans `src/data/`, jamais en dur)
| id | Option | Prix |
| --- | --- | --- |
| page | Page supplémentaire | 50 € |
| galerie | Galerie photos | 80 € |
| textes | Rédaction des textes | 60 € / page |
| logo | Logo simple | 150 € |
| avantapres | Avant / après | 80 € |
| avis | Avis Google affichés | 60 € |
| seo | SEO avancé | 150 € |
| anglais | Site en anglais | 150 € |
| rdv | Rendez-vous en ligne | 400 € |
| acompte | Acompte en ligne | 150 € |
| calcul | Calculateur de prix | dès 300 € |
| pwa | Appli sur téléphone | 200 € |
| espace | Espace client | 300 € |
| boutique | Boutique en ligne | dès 600 € |
| table | Réservation de table | 300 € |
| clickcollect | Click & collect | 300 € |

Options proposées selon le choix :
- Vitrine : page, galerie, textes, logo
- Vitrine+ : avantapres, avis, textes, logo, seo, anglais
- Fonctionnel par métier : artisan (rdv, acompte, calcul, pwa, espace, avantapres) · commerce (boutique, clickcollect, espace, seo, avis, pwa) · restaurant (table, clickcollect, avis, pwa, anglais) · santé/bien-être (rdv, acompte, espace, pwa, avis) · autre (rdv, calcul, boutique, espace, pwa, seo)

Précisions (sous-questions) : rdv → « Où ont lieu vos rendez-vous ? » chez le client / chez vous / les deux · boutique → moins de 20 (0 €) / 20 à 100 (+200 €) / plus de 100 (+500 €) · calcul → surface / véhicule / quantité / distance · pwa → notifications oui / non · table → acompte grandes tablées oui (+150 €) / non.

### Packs offerts
| Pack | Si le client prend | Offert |
| --- | --- | --- |
| Réservation sereine | rdv + acompte | Avis Google (60 €) |
| Tout-en-un | rdv + acompte + espace | Appli sur téléphone (200 €) |
| Boutique visible | boutique + seo | Avis Google (60 €) |
| Restaurant complet | table + clickcollect | Avis Google (60 €) |
| Image de marque | logo + textes | Page supplémentaire (50 €) |

Affichage : valeur barrée, « Offert : − X € », prix payé. Si un pack est presque complet (il manque une option), suggestion « Ajoutez X et je vous offre Y (valeur Z €) ».

### Comparaison marché (afficher la source)
| Cas | Fourchette | Source |
| --- | --- | --- |
| Vitrine | 300 – 1 200 € (site une page, freelance) | Plateya, 2026 |
| Vitrine+ | 800 – 4 000 € (vitrine 5–10 pages, freelance) | Plateya, 2026 |
| Fonctionnel avec boutique | 3 000 – 40 000 € (e-commerce en agence, médiane 10 000 €) | La Fabrique du Net, 2026 |
| Fonctionnel sans boutique | 6 000 – 45 000 € (sur mesure / applicatif en agence, médiane 18 000 €) | La Fabrique du Net, 2026 |

Deux barres : marché (de bas à haut) et « mon prix », + phrase « Soit X € de moins que le bas de la fourchette du marché » si moins cher.

## 5. Configurateur (`/composer`) – comportement
Référence complète : `docs/maquette/Configurateur.dc.html` (logique JS à porter en TypeScript dans `src/data/` + hooks).
- Onglets « Sites & applis » / « Informatique sur place ».
- Étapes qui s'ouvrent l'une après l'autre (animation d'apparition) : type → activité → options → précisions → suggestions → estimation.
- Estimation : total, fourchette (−5 % / +10 %, arrondi à 10 €) pour le fonctionnel, délai, détail des lignes, packs offerts, comparaison marché, boutons « Recevoir mon devis détaillé » et « En parler en rendez-vous ».
- **Colonne de droite : aperçu en direct** d'un site d'exemple qui se construit selon les choix (nom, couleur et accroche selon le métier ; calendrier de réservation, acompte, calculateur, boutique, table, click & collect, galerie, avant/après, avis, logo, FR | EN, « Mon compte », « Installer l'appli », résultat Google pour le SEO).
- **Sous 1 000 px de large, l'aperçu est masqué**, seule la colonne de gauche reste.
- La configuration est conservée dans le navigateur et transmise au parcours de devis.

Exemples d'entreprises dans l'aperçu : artisan « Atelier Brillance » (#1F6FB2), commerce « Maison Lumen » (#8A5A44), restaurant « Le Petit Comptoir » (#B5452B), santé « Studio Équilibre » (#2E8B6F), autre « Votre entreprise » (#16213E).

## 6. Parcours de demande de devis (`/devis`)
1. Activité · 2. Besoins (cartes à cocher : prendre des rendez-vous, montrer mes réalisations, être contacté, calculer un prix, faire des devis, avoir une appli, vendre en ligne, être trouvé sur Google, je ne sais pas encore) · 3. Avec vos mots (texte libre, photos, lien d'un site aimé) · 4. Budget et délai · 5. Coordonnées + consentement RGPD + récapitulatif.
Barre de progression, retour sans perte, sauvegarde dans le navigateur, anti-spam (champ piège + limitation).
Après envoi : mail d'accusé de réception avec pré-devis (fourchette + 2–4 options suggérées selon le métier + lien de suivi) ; alerte et fiche pour Baptiste. **V1 : envoi simple par mail. Reformulation IA : plus tard.**

## 7. Rendez-vous découverte (`/rendez-vous`)
- Choix : « Je le décris en ligne » ou « Je préfère en parler de vive voix ».
- Lieu : chez vous (≤ 50 km d'Amiens, contrôle de l'adresse, message « Abbeville, 47 km : je me déplace gratuitement »), visio, téléphone.
- Calendrier du mois, jours indisponibles grisés, créneaux d'une heure qui tiennent compte du trajet.
- Coordonnées, récapitulatif, confirmation par mail avec lien pour déplacer/annuler, fichier .ics.
- **Bloc Calendrier réutilisable** (`src/blocks/Calendar`) : utilisé ici et plus tard dans le kit de réservation des clients.

## 8. Espace client (`/mon-espace`)
- Menu : Mes demandes, Mes rendez-vous, Mon compte, Sécurité, Confidentialité, Nouvelle demande.
- Mes demandes : n°, statut (Reçue → En étude → Devis envoyé → Accepté → En cours → Livré), derniers échanges (mails, notes d'appel), devis avec bouton « Accepter le devis » et PDF.
- Mes rendez-vous : ajouter à l'agenda, déplacer, annuler.
- Mon compte : nom, entreprise, e-mail (confirmation par mail si changé), téléphone, adresse.
- Sécurité : changement de mot de passe **par lien envoyé par mail** (valable 1 h) + confirmation affichée ; appareils connectés.
- Confidentialité : localisation désactivée si refusée, interrupteur pour la réactiver + aide navigateur ; notifications par mail ; téléchargement de ses données.
- **Zone danger** : suppression du compte (mail de confirmation ; factures conservées 10 ans).
- Compte créé automatiquement à la première demande ou au premier rendez-vous, activé par un lien reçu par mail.

## 9. Textes
Voir les textes intégrés dans la maquette (`Main`, `Tarifs`, `Devis`, `RDV`, `Configurateur`, `EspaceClient`). Points clés :
- Hero : « Un site qui travaille pour vous, même quand vous êtes sur le terrain. » + mots qui tournent (plus de clients · moins d'appels manqués · des rendez-vous la nuit · des devis en 2 minutes).
- Problèmes → solutions (4 cartes), méthode en 4 étapes, « Pourquoi travailler avec moi » (un seul interlocuteur, prix affichés, votre site vous appartient, vous restez autonome).
- Pages métier :
  - Artisans à domicile : « Vos clients réservent pendant que vous travaillez. »
  - Commerce : « Vendez aussi en ligne, et soyez trouvé sur Google. »
  - Restaurants : « Votre carte, vos horaires et vos réservations, toujours à jour. »
  - Santé/bien-être : « Moins de temps au téléphone, plus avec vos clients. »
- Informatique : « Votre PC ne passe pas à Windows 11 ? Ne le jetez pas. » (Windows 10 n'est plus mis à jour depuis octobre 2025.)
- FAQ : délais, quoi fournir, propriété du site, hébergement, modifications, WordPress (rarement, sur mesure le plus souvent), paiement (acompte à la commande, solde à la mise en ligne).
- Réalisations : Christophe Poix Moto (site une page), démo detailing (réservation avec acompte), O'RDV (plateforme de réservation).
- **Ne jamais inventer d'avis, de chiffres ou de résultats** : laisser des emplacements `[à compléter]`.

## 10. Design
- Couleurs : bleu marine #16213E, rose #C9184A (foncé #9E0F38, doux #FCE7EE, clair #F28CAB), fond #F7F6FA, bordures #E4E2EC.
- Typo : Plus Jakarta Sans (titres), Inter (texte).
- Animations douces (apparition au défilement, mots qui tournent, bande défilante, cartes qui se soulèvent), désactivées si « réduire les animations ».
- Mobile d'abord, barre « Estimer » fixe en bas sur mobile, accessibilité AA.

## 11. Technique
- Front : React + Vite + TypeScript, React Router, CSS Modules + `src/styles/`, pré-rendu des pages publiques pour le SEO.
- V2 : API Symfony (monolithe modulaire, cœur hexagonal) : modules Auth (lien magique, mot de passe), Prospect (demande, devis, messages), Booking (rendez-vous), Notification (mails, rappels), relevé IMAP pour rattacher les réponses mail au fil.
- Hébergement o2switch : `bsandoz.fr` (prod), `preview.bsandoz.fr` (tests), `api.bsandoz.fr` (V2).
- SEO : balises par page, données structurées `LocalBusiness`, `FAQPage`, `Offer`, sitemap, robots.txt, fiche Google Business.
- Mesure d'audience sans cookie tiers.
