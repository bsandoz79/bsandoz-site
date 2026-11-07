/**
 * Adresse d'envoi du formulaire de contact. Par défaut, le script déposé avec le site sur o2switch (`public/api/devis.php`,
 * envoi par mail seulement). Une fois l'API en ligne, `VITE_DEVIS_URL=https://api.bsandoz.fr/demandes` au build :
 * la demande est alors enregistrée, suivie dans l'espace client, et le compte client est ouvert.
 * Les deux adresses acceptent exactement le même formulaire.
 */
export const urlEnvoiDevis = (import.meta.env.VITE_DEVIS_URL as string | undefined) || '/api/devis.php';
