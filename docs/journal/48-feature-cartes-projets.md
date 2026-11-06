# Cartes de projets compactes et cliquables

Branche `feature/cartes-complements` · 2026-11-06

## Ce qui a été fait
- **Cartes plus courtes** : image de 160 px de haut, marges réduites, titre un cran plus petit, résumé d'une phrase coupé à deux lignes au plus.
- **Résumés réécrits**, droit au but : « Site vitrine d'un mécanicien moto qui se déplace à domicile. », « Démo : réservation en ligne, prix calculé et acompte. », « Plateforme de réservation avec espaces client et professionnel. »
- **Toute la carte est cliquable** (lien « étiré ») : il reste un seul lien, donc un seul arrêt au clavier, et le contour de focus entoure la carte entière.
- Essayé puis abandonné à votre demande : des encadrés « compléments » (page supplémentaire, boutique) sous les formules. La ligne « Page supplémentaire » reste dans chaque formule.

## Tests
- **unitaires** : un seul lien par carte, résumé de 80 caractères au plus.
- **manuel** : capture à 390 px ; un clic au milieu de l'image ouvre la page du projet (vérifié dans un vrai navigateur).

Résultats : site 366 et bibliothèque 70 tests verts ; lint et build verts.
