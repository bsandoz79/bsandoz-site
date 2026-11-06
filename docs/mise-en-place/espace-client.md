# Espace client

Compte ouvert automatiquement, connexion par lien ou mot de passe, appareils connectés, mes rendez-vous, mes demandes et devis, mes données, suppression du compte.

## Quels modules ?
| Combinaison | État |
| --- | --- |
| **Auth + Booking + Prospect + Liaisons** | **à utiliser** : c'est l'API de bsandoz.fr, entièrement testée |
| Auth seul | essayé, mais sans liaison **rien n'ouvre les comptes** : il faut appeler `OuvrirCompte` soi-même. Migrations `Version20261105195537.php` et `Version20261105202211.php`, et `composer remove --no-scripts dompdf/dompdf` |
| Auth + Booking, ou Auth + Prospect | **pas prêt, jamais essayé** : `DonneesApresSuppression` et `EspaceDonneesController` utilisent les trois modules, et la page importe `MesDemandes` et `MesRendezVous` |

Pour une combinaison à deux modules, il faudra retirer le module absent de ces fichiers et de la page. **Ne pas supprimer `DonneesApresSuppression`** : supprimer un compte n'effacerait plus ses rendez-vous ni ses demandes.

**Back-office** : la page `/admin` permet au client de suivre ses demandes et d'établir ses devis.

## Fichiers à copier
**Site** (marche à suivre : [Le site](commun.md#le-site)) :

| Élément | Fichiers de `front/src/` |
| --- | --- |
| Pages | `pages/MonEspace/`, `pages/Admin/` |
| Données | `data/admin.ts`, `data/espace.ts`, `data/pages.ts`, `data/navigation.ts`, `data/seo.ts`, `data/faq.ts`, `data/offres.ts` |
| Autres | `app/api.ts`, `components/PageMeta/` |

Plus les fichiers du site de [Rendez-vous](rendez-vous.md) et de [Demandes de devis](demandes-de-devis.md).

Blocs : `npm run livrer -- Button Calendar ChoiceChips Container OptionCard Stepper TextField --vers <projet>/src/blocs`

Routes à déclarer : `/mon-espace`, `/mon-espace/connexion`, `/mon-espace/lien`, `/mon-espace/mot-de-passe`, `/mon-espace/email`, `/mon-espace/suppression`, `/admin`. Les mails utilisent ces adresses : ne pas les changer. Les exclure du sitemap, et ajouter `Disallow: /mon-espace` et `Disallow: /admin` dans `robots.txt`.

**API** (marche à suivre : [L'API](commun.md#lapi)) : tout garder, avec `src/Liaisons/`, `src/BackOffice/`, `src/Catalogue/` et toutes les migrations. Aucune dépendance à retirer.

## Réglages
Dans `.env.local`, en plus des variables de [Rendez-vous](rendez-vous.md) et de [Demandes de devis](demandes-de-devis.md) :
```sh
AUTH_URL_SITE=https://client.fr
AUTH_EXPEDITEUR=no-reply@client.fr
AUTH_EXPEDITEUR_NOM="Nom du client"
AUTH_COOKIE_SECURISE=1
BACKOFFICE_EMAILS=contact@client.fr
```
Puis, une fois sur le serveur : `php bin/console backoffice:ouvrir-acces contact@client.fr "Nom du client"`.
Dans `config/packages/auth.yaml`, changer `auth.cookie_nom` (`bsandoz_session` → `client_session`).

Faire aussi les modifications de code de [Demandes de devis](demandes-de-devis.md). Sa politique de confidentialité doit parler de l'espace client et du cookie de session : la mienne (`data/legal.ts`) peut servir de point de départ, à faire relire.

## Base de données
Tables `auth_compte`, `auth_lien`, `auth_session`, en plus de celles des autres modules, créées par les migrations.

## Mails
Activation, connexion, mot de passe, changement d'adresse, suppression. Ils contiennent les liens de connexion : **s'ils n'arrivent pas, personne ne peut entrer**. Voir [Les mails](commun.md#les-mails).

## Domaine
**Le site et l'API doivent être sur le même domaine** (`client.fr` et `api.client.fr`), en HTTPS, y compris si je gère pour lui : voir [Le domaine](commun.md#le-domaine). `AUTH_URL_SITE` est l'adresse du site, pas celle de l'API.

## Vérifications finales
Dans un vrai navigateur, sur le vrai domaine (jamais essayé hors des tests) :
- [ ] Prendre un rendez-vous avec une nouvelle adresse : le mail d'activation arrive, le lien connecte.
- [ ] Actualiser la page : la personne reste connectée. **C'est le test du cookie.**
- [ ] Le cookie est `Secure`, `HttpOnly`, `SameSite=Lax`, et porte le nom choisi (outils du navigateur).
- [ ] Le lien utilisé une seconde fois : refusé.
- [ ] Choisir un mot de passe, se déconnecter, se reconnecter ; 6 mauvais essais : blocage.
- [ ] Mes rendez-vous : le rendez-vous est là, l'annulation marche.
- [ ] Mes demandes : écrire un message, et l'autre personne reçoit le mail.
- [ ] Une autre personne connectée ne voit rien de la première, et `/admin` lui répond « Accès réservé ».
- [ ] Back-office : établir un devis, le client le reçoit par mail et l'accepte dans son espace.
- [ ] Télécharger ses données, puis supprimer le compte : rendez-vous et demandes effacés.
- [ ] [Vérifications communes](commun.md#vérifications-finales).

## Selon la façon de livrer
- **Autonome** : les comptes sont chez lui. Il répond seul aux demandes d'accès ou de suppression.
- **Je gère** : j'héberge les comptes de ses clients, et une fuite chez moi le toucherait aussi : qui prévient qui, et sous quel délai, doit être écrit au contrat. Voir [Si je gère pour lui](README.md#si-je-gère-pour-lui).
