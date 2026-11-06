/** Plus grand côté d'une image envoyée. */
const COTE_MAX = 1600;

/**
 * Prépare une image choisie sur l'appareil : réduite à 1 600 px au plus, convertie en WebP
 * (les informations du fichier, comme la position GPS d'une photo, ne suivent pas). Renvoie son contenu en base64.
 */
export async function imageEnBase64(fichier: File): Promise<string> {
  const image = await createImageBitmap(fichier);
  const echelle = Math.min(1, COTE_MAX / Math.max(image.width, image.height));
  const toile = document.createElement('canvas');
  toile.width = Math.round(image.width * echelle);
  toile.height = Math.round(image.height * echelle);
  toile.getContext('2d')?.drawImage(image, 0, 0, toile.width, toile.height);
  image.close();
  const blob = await new Promise<Blob | null>((resoudre) => toile.toBlob(resoudre, 'image/webp', 0.85));
  if (!blob) throw new Error('Image illisible');
  const octets = new Uint8Array(await blob.arrayBuffer());
  let binaire = '';
  for (let i = 0; i < octets.length; i += 0x8000) binaire += String.fromCharCode(...octets.subarray(i, i + 0x8000));
  return btoa(binaire);
}
