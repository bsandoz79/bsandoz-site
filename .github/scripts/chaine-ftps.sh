#!/usr/bin/env bash
# Prépare le fichier d'autorités de certification pour lftp, quand le serveur FTPS n'envoie pas
# ses certificats intermédiaires (cas d'o2switch : seul le certificat du serveur est envoyé).
#
# Usage : .github/scripts/chaine-ftps.sh <serveur> <fichier de sortie>
#
# Sécurité : les intermédiaires sont téléchargés aux adresses officielles écrites dans les certificats (AIA),
# puis la chaîne complète est VÉRIFIÉE avec les seules racines du système. Le fichier produit n'est écrit
# que si elle est authentique, et n'ajoute jamais de certificat auto-signé : la confiance reste celle du système.
set -euo pipefail

SERVEUR="$1"
SORTIE="$2"
SYSTEME=/etc/ssl/certs/ca-certificates.crt
TRAVAIL=$(mktemp -d)

openssl s_client -starttls ftp -connect "$SERVEUR:21" -servername "$SERVEUR" < /dev/null 2> /dev/null \
  | openssl x509 > "$TRAVAIL/serveur.pem"

: > "$TRAVAIL/intermediaires.pem"
COURANT="$TRAVAIL/serveur.pem"
for n in 1 2 3 4; do
  URL=$(openssl x509 -in "$COURANT" -noout -ext authorityInfoAccess 2> /dev/null \
    | sed -n 's/.*CA Issuers - URI:\(http[^ ]*\).*/\1/p' | head -1)
  [ -z "$URL" ] && break
  curl -fsS --max-time 15 "$URL" -o "$TRAVAIL/$n.der"
  openssl x509 -inform DER -in "$TRAVAIL/$n.der" -out "$TRAVAIL/$n.pem" 2> /dev/null || cp "$TRAVAIL/$n.der" "$TRAVAIL/$n.pem"
  # Un certificat auto-signé est une racine : on s'arrête, seules celles du système font foi.
  if [ "$(openssl x509 -in "$TRAVAIL/$n.pem" -noout -subject)" = "subject=$(openssl x509 -in "$TRAVAIL/$n.pem" -noout -issuer | sed 's/^issuer=//')" ]; then
    break
  fi
  cat "$TRAVAIL/$n.pem" >> "$TRAVAIL/intermediaires.pem"
  COURANT="$TRAVAIL/$n.pem"
done

# La chaîne doit remonter à une racine du système, pour le bon nom de serveur.
openssl verify -CAfile "$SYSTEME" -untrusted "$TRAVAIL/intermediaires.pem" -verify_hostname "$SERVEUR" "$TRAVAIL/serveur.pem" > /dev/null

cat "$SYSTEME" "$TRAVAIL/intermediaires.pem" > "$SORTIE"
echo "Chaîne de $SERVEUR vérifiée : $(grep -c 'BEGIN CERTIFICATE' "$TRAVAIL/intermediaires.pem") intermédiaire(s) ajouté(s)."
rm -rf "$TRAVAIL"
