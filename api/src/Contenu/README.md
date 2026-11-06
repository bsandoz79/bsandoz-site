# Module Contenu

Textes et images modifiés depuis les pages du site (crayon sur chaque bloc). Le site garde ses textes dans son code (`front/src/data/`) : ce module ne stocke que ce qui a été changé, et le site l'applique à son chargement. Sans rien en base, ou si l'API ne répond pas, le site affiche les textes de son code. Module **autonome**.

## Couches
- `Domain/` : `ContenuPersonnalise` (clé `accueil.hero.badge`… et texte brut, 5 000 caractères au plus), `ContenuInvalide`, le port `ContenusEnregistres`.
- `Application/` : `ModifierLesContenus` (tout ou rien, une valeur `null` revient au texte du code), `EnregistrerImage` (type lu dans le fichier, nom au hasard, 5 Mo au plus, JPEG, PNG ou WebP).
- `Infrastructure/` : `Doctrine/` (table `contenu_personnalise`), `Http/ContenusController.php`.

## Points d'entrée
| Méthode | Adresse | Réponses |
| --- | --- | --- |
| GET | `/contenus` | 200 `{ contenus: { "accueil.hero.badge": "…" } }`, public |

La modification passe par le back-office : `POST /backoffice/contenus` et `POST /backoffice/images` (`api/src/BackOffice/ContenusController.php`). Les images sont écrites dans `public/medias/`, servies telles quelles et jamais supprimées au déploiement.

## Installer le module dans l'API d'un client
1. Copier `src/Contenu/` et `config/packages/contenu.yaml` ; déclarer la correspondance `Contenu` dans `doctrine.yaml`.
2. Migration `migrations/Version20261106140000.php`.

## Tests
- `tests/Contenu/ContenuTest.php` : clés, longueur, tout ou rien, images.
- `tests/BackOffice/ContenusBackOfficeTest.php` (MySQL) : lecture publique, droits, modification, retour au texte du code, envoi d'image.
