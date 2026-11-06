# FAQ sur l'accueil

Branche `feature/faq-accueil` · 2026-11-06

## Ce qui a été fait
- La FAQ devient une section de l'accueil, tout en bas, juste avant la carte (`pages/Home/sections/Faq.tsx`, ancre `#faq`).
- 3 questions sont affichées au départ. Le bouton « Voir plus de questions (n) » en ajoute 3 à chaque clic, puis disparaît quand tout est affiché.
- Le focus clavier passe à la première nouvelle question, pour continuer la lecture.
- Le lien « Questions fréquentes » du pied de page mène à `/#faq`.
- L'ancienne adresse `/faq` redirige vers `/#faq`. Elle n'est plus dans le plan du site.
- Les données structurées FAQPage sont désormais sur l'accueil.
- L'ancienne page `pages/Faq` est supprimée. L'appel « Prendre rendez-vous / Décrire mon projet » faisait doublon avec le formulaire de contact placé juste au-dessus.
- Réglages dans `data/faq.ts` : `faqAccueil` (titres, `parPaquet`) et `lienFaq`.

## Tests
- `Home.test.tsx`, bloc « Questions fréquentes » :
  - la section est juste avant la carte, avec l'ancre `#faq` ;
  - elle affiche 3 questions, puis 6, puis toutes ;
  - le focus passe sur la nouvelle question ;
  - une réponse se déplie avec les délais lus dans les données ;
  - l'adresse `/faq` mène à la section, qui défile jusqu'à l'écran.
- `seo.test.tsx` : l'accueil porte ProfessionalService et FAQPage.
- Lancer : `npm run test -w front -- Home seo`.
- Manuel : arrivée par `/faq` sur mobile et sur ordinateur (l'adresse devient `/#faq`, la section est à l'écran), puis clic sur « Voir plus ».

## Reste ouvert
Rien.
