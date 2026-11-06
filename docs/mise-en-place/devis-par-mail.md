# Devis par mail

Formulaire en 5 étapes, reçu par mail, sans base de données : script PHP `devis.php`. Pour enregistrer et numéroter les demandes, voir [Demandes de devis](demandes-de-devis.md).

## Fichiers à copier
Marche à suivre : [Le site](commun.md#le-site).

| Élément | Fichiers |
| --- | --- |
| Page | `front/src/pages/Devis/` |
| Données | `front/src/data/` : `devis.ts`, `predevis.ts`, `calculs.ts`, `offres.ts`, `informatique.ts`, `pages.ts`, `navigation.ts`, `seo.ts`, `faq.ts` |
| Autres | `front/src/components/PageMeta/`, `front/src/pages/Composer/stockage.ts` |
| Script | `front/public/api/devis.php` → `public/api/devis.php` |

Blocs : `npm run livrer -- Button ChoiceChips Container OptionCard Stepper TextField --vers <projet>/src/blocs`

## Réglages
- `devis.php` : `DESTINATAIRE`, `EXPEDITEUR` et les textes des mails, écrits pour bsandoz.fr.
- `data/devis.ts` : étapes, besoins, budgets, délais, textes, signature.
- **`data/predevis.ts` et `data/offres.ts` : à refaire entièrement.** La première estimation envoyée au visiteur est calculée avec ces prix. Si on les laisse, ses prospects reçoivent **mes** tarifs. Si le client n'en veut pas, retirer le pré-devis de `construireEnvoi` (`pages/Devis/demande.ts`) et des textes.
- `pages/Composer/stockage.ts` lit la configuration de mon configurateur. Sans configurateur, il ne trouve rien et ne gêne pas.

## Base de données
Aucune.

## Mails
`devis.php` utilise la fonction `mail()` du serveur. L'adresse de `EXPEDITEUR` doit exister, avec SPF et DKIM : voir [Les mails](commun.md#les-mails).

## Domaine
Le script est sur le même domaine que le site, à l'adresse `/api/devis.php`. **Ne pas** fixer `VITE_DEVIS_URL`. L'hébergement doit servir du PHP et autoriser `mail()`.

## Vérifications finales
- [ ] Une demande complète avec une photo : le client reçoit le mail et la photo, le visiteur reçoit l'accusé.
- [ ] Le pré-devis donne les bons prix, ou n'apparaît pas.
- [ ] Trop d'envois : erreur attendue (1 par minute, 3 par heure).
- [ ] [Vérifications communes](commun.md#vérifications-finales).

## Selon la façon de livrer
- **Autonome** : les mails partent de son serveur.
- **Je gère** : les demandes passent par mon serveur, avec les coordonnées et les photos de ses prospects, ce que sa politique de confidentialité doit dire. Mon serveur doit être autorisé à envoyer dans le DNS de son domaine.
