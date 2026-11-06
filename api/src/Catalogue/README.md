# Module Catalogue

Prix modifiés depuis le back-office. Le site garde ses prix dans son code (`front/src/data/offres.ts`) : ce module ne stocke que ceux qui ont été changés, et le site les applique à son chargement. Sans rien en base, ou si l'API ne répond pas, le site affiche les prix de son code. Module **autonome**.

## Couches
- `Domain/` : `PrixPersonnalise` (clé `formule.vitrine`, `option.rdv`… et montant en euros entiers), `PrixInvalide`, le port `PrixEnregistres`.
- `Application/` : `ModifierLesPrix` (tout ou rien).
- `Infrastructure/` : `Doctrine/` (table `catalogue_prix`), `Http/PrixController.php`.

## Points d'entrée
| Méthode | Adresse | Réponses |
| --- | --- | --- |
| GET | `/prix` | 200 `{ prix: { "formule.vitrine": 120 } }`, public |

La modification passe par le back-office : `POST /backoffice/prix` (`api/src/BackOffice/PrixController.php`).

## Installer le module dans l'API d'un client
1. Copier `src/Catalogue/` et `config/packages/catalogue.yaml` ; déclarer la correspondance `Catalogue` dans `doctrine.yaml`.
2. Migration `migrations/Version20261106100000.php`.

## Tests
- `tests/Catalogue/CatalogueTest.php` : clés et montants, tout ou rien.
- `tests/BackOffice/PrixBackOfficeTest.php` (MySQL) : lecture publique, droits, modification, remise à zéro.
