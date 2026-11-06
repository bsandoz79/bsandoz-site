/**
 * Identifiants et adresses des pages de réalisations, sans images : utilisés aussi par le plan du site
 * (`seo.ts`, lu par la configuration de Vite côté serveur, où les imports d'images ne fonctionnent pas).
 */
export const idsRealisations = ['christophe-poix-moto', 'demo-detailing', 'ordv'] as const;

export type IdRealisation = (typeof idsRealisations)[number];

export const cheminRealisation = (id: string) => `/realisations/${id}`;
