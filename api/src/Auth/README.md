# Module Auth

Comptes clients (V3) : compte ouvert automatiquement et activé par un lien reçu par mail, connexion par lien (sans mot de passe) ou par mot de passe, changement du mot de passe par un lien valable 1 h, sessions et appareils connectés.

## Couches
- `Domain/` : règles métier (entités, objets valeur, ports). Aucune dépendance à Symfony, Doctrine ou à un autre module.
- `Application/` : cas d'usage, qui pilotent le domaine par ses ports.
- `Infrastructure/` : adaptateurs (contrôleurs HTTP, correspondance Doctrine en XML, envoi de mails).
