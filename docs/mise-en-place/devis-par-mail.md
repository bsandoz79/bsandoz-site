# Devis par mail

Formulaire court, reçu par mail, sans base de données : script PHP `devis.php`. Pour enregistrer et numéroter les demandes, voir [Demandes de devis](demandes-de-devis.md).

## Fichiers à copier
Marche à suivre : [Le site](commun.md#le-site).

| Élément | Fichiers |
| --- | --- |
| Page | `front/src/pages/Devis/` |
| Formulaire | `front/src/components/ContactRapide/` |
| Données | `front/src/data/` : `devis.ts`, `contact.ts`, `pages.ts`, `navigation.ts` |
| Autres | `front/src/components/PageMeta/` |
| Script | `front/public/api/devis.php` → `public/api/devis.php` |

Blocs : `npm run livrer -- Button ChoiceChips Container TextField --vers <projet>/src/blocs`

## Réglages
- `devis.php` : `DESTINATAIRE`, `EXPEDITEUR` et les textes des mails, écrits pour bsandoz.fr.
- `data/contact.ts` : textes du formulaire et liste des activités, à adapter au métier du client.
- `data/navigation.ts` : adresse e-mail et téléphone affichés à côté du formulaire.

## Base de données
Aucune.

## Mails
`devis.php` utilise la fonction `mail()` du serveur. L'adresse de `EXPEDITEUR` doit exister, avec SPF et DKIM : voir [Les mails](commun.md#les-mails).

## Domaine
Le script est sur le même domaine que le site, à l'adresse `/api/devis.php`. **Ne pas** fixer `VITE_DEVIS_URL`. L'hébergement doit servir du PHP et autoriser `mail()`.

## Vérifications finales
- [ ] Une demande complète : le client reçoit le mail, le visiteur reçoit l'accusé.
- [ ] « Autre » ouvre le champ pour préciser l'activité, et l'activité précisée arrive dans le mail.
- [ ] Trop d'envois : erreur attendue (1 par minute, 3 par heure).
- [ ] [Vérifications communes](commun.md#vérifications-finales).

## Selon la façon de livrer
- **Autonome** : les mails partent de son serveur.
- **Je gère** : les demandes passent par mon serveur, avec les coordonnées de ses prospects, ce que sa politique de confidentialité doit dire. Mon serveur doit être autorisé à envoyer dans le DNS de son domaine.
