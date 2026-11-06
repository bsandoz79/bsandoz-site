# Déploiement bloqué par des tests

Branche `fix/tests-url-devis` · 2026-11-06

## Le problème
Après la création de la variable GitHub `VITE_DEVIS_URL`, le déploiement du site échouait : `Devis.test.tsx` et `ContactRapide.test.tsx` attendaient `/api/devis.php` en dur, alors que les envois partaient bien vers `https://api.bsandoz.fr/demandes`. Un test rouge bloque l'envoi du site. Les variables `VITE_*` sont lues aussi pendant les tests de la CI.

## Ce qui a été fait
Les deux tests lisent `urlEnvoiDevis` (`data/devis.ts`) au lieu d'une adresse écrite en dur.

## Tests
Suite du site lancée avec `VITE_DEVIS_URL` et `VITE_API_URL` réglées comme sur GitHub, puis sans elles : 441 tests verts les deux fois.

## Reste ouvert
Rien.
