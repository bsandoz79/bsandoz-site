# Pré-devis automatique par mail

Branche `feature/predevis` · 2026-11-05

## Ce qui a été fait
- `src/data/predevis.ts` : fonctions pures qui calculent le pré-devis d'une demande. Elles donnent la formule conseillée, les options retenues, la fourchette de prix, le délai et 3 options suggérées au plus (celles qui complètent un pack d'abord, pour qu'une option soit offerte), puis le texte de l'e-mail.
  - Si le visiteur est passé par « Composer mon site », c'est sa configuration qui sert.
  - Sinon, les besoins cochés et le métier donnent la formule et les options. Un restaurant qui veut « prendre des rendez-vous » se voit proposer la réservation de table.
  - Si rien ne permet de trancher (« Je ne sais pas encore »), le mail présente les trois formules et leurs prix.
- `construireEnvoi` joint le pré-devis (champ `predevis`).
- `api/devis.php` le place dans l'accusé de réception (nouveau sujet : « Votre demande de devis et une première estimation ») et dans le mail de Baptiste. Le texte est limité à 3 000 caractères et ses retours chariot sont retirés. Sans pré-devis, l'ancien mail part inchangé.
- Page de confirmation : annonce la première estimation par e-mail.

## À quoi ça sert
Le visiteur reçoit tout de suite un ordre de prix crédible, calculé avec **les mêmes prix** que le configurateur et la page Tarifs, et des idées d'options utiles à son métier. Baptiste voit dans son mail ce qui a été annoncé.

Choix : le calcul est fait dans le site, pas recopié en PHP, pour garder une source unique des prix (`offres.ts`). Le texte envoyé n'est qu'une estimation indicative ; le mail le précise, et le script le traite comme du texte brut, borné.

## Comment l'utiliser
Rien à faire : chaque demande envoyée depuis `/devis` contient le pré-devis. Pour l'appeler ailleurs :
```ts
texteDuPreDevis(preDevis({ metier: 'artisan', besoins: ['rdv'] }, null));
```

## Tests
- **unitaires** : `src/data/predevis.test.ts` (19 tests : formule déduite des besoins, options par métier, métier par défaut, options hors catalogue écartées, suggestions avec les packs d'abord, 2 à 4 suggestions par métier, reprise de la configuration, prix fixe des vitrines, aucun prix sans formule, texte de l'e-mail) ; `demande.test.ts` (pré-devis joint, d'après les besoins ou la configuration).
- **fonctionnels** : `Devis.test.tsx` (le pré-devis part avec la demande, la confirmation annonce l'estimation).
- **manuel / intégration** : `devis.php` dans PHP 8.3 (Docker) avec un faux `sendmail` : avec pré-devis, sans pré-devis (ancienne version de la page), pré-devis trop long tronqué à 3 000 caractères, retours chariot retirés.

Lancer : `npm run test -w front`

## Fichiers principaux
- `front/src/data/predevis.ts`, `predevis.test.ts`
- `front/src/pages/Devis/demande.ts`, `front/src/data/devis.ts`
- `front/public/api/devis.php`
- `docs/fonctionnalites/demande-de-devis.md`, `docs/fonctionnalites/prix-et-calculs.md`

## Reste ouvert
- **Lien de suivi** de la demande (cahier des charges) : il viendra avec l'espace client (V3). En attendant, le mail propose un rendez-vous découverte.
- Envoi réel à tester sur o2switch (adresse `no-reply@bsandoz.fr` à créer, déjà noté pour la demande de devis).
- Les correspondances besoin → option (par exemple « Faire des devis » → calculateur de prix) sont à relire.
