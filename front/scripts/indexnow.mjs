/**
 * Après la mise en ligne : annonce les pages du site à IndexNow (Bing, Yandex, Seznam…), pour qu'elles soient
 * relues sans attendre. Lit `dist/indexnow.json` (généré au build, jamais envoyé sur le serveur).
 * Usage : node front/scripts/indexnow.mjs front/dist/indexnow.json
 * Ne fait jamais échouer le déploiement : un refus est seulement signalé.
 */
import { readFileSync } from 'node:fs';

const requete = JSON.parse(readFileSync(process.argv[2] ?? 'front/dist/indexnow.json', 'utf8'));
try {
  const reponse = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(requete),
  });
  // 200 : reçu ; 202 : reçu, clé en cours de vérification. Le reste : clé introuvable, trop de requêtes…
  const ok = reponse.status === 200 || reponse.status === 202;
  console.log(`IndexNow : ${requete.urlList.length} pages annoncées, réponse ${reponse.status}${ok ? '' : ' (non acceptée)'}.`);
  if (!ok) console.log(`::warning title=IndexNow::Réponse ${reponse.status} : ${await reponse.text()}`);
} catch (erreur) {
  console.log(`::warning title=IndexNow::Envoi impossible : ${erreur.message}`);
}
