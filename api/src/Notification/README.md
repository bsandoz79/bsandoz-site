# Module Notification

E-mails, rappels, fichiers .ics ; plus tard relevé IMAP des réponses (V2/V3).

## Couches
- `Domain/` : règles métier (entités, objets valeur, ports). Aucune dépendance à Symfony, Doctrine ou à un autre module.
- `Application/` : cas d'usage, qui pilotent le domaine par ses ports.
- `Infrastructure/` : adaptateurs (contrôleurs HTTP, correspondance Doctrine en XML, envoi de mails).
