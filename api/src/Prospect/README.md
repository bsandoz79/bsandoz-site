# Module Prospect

Demandes de devis et devis (V3) : la demande envoyée depuis le site est numérotée et suivie de « Reçue » à « Livré » ; le devis, établi par le professionnel, est accepté par le client depuis son espace. Fil de messages : plus tard (IMAP).

## Couches
- `Domain/` : règles métier (entités, objets valeur, ports). Aucune dépendance à Symfony, Doctrine ou à un autre module.
- `Application/` : cas d'usage, qui pilotent le domaine par ses ports.
- `Infrastructure/` : adaptateurs (contrôleurs HTTP, correspondance Doctrine en XML, envoi de mails).
