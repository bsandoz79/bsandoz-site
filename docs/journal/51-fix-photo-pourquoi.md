# Photo de la section « Pourquoi travailler avec moi »

Branche `fix/photo-pourquoi` · 2026-11-06

## Ce qui a été fait
En bas de l'accueil, la section « Pourquoi travailler avec moi » affiche votre photo à la place de l'emplacement « [photo à compléter] ». C'est la même image que celle du haut de l'accueil et de la page À propos (`assets/baptiste/portrait.webp`), chargée seulement à l'approche de la section.

## Tests
- **fonctionnels** : `Home.test.tsx` vérifie la photo et son texte alternatif dans la section, et l'absence de « [photo à compléter] ».

Résultats : site 368 et bibliothèque 70 tests verts ; lint et build verts.
