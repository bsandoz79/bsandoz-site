/** Minuscules, sans accents : « Électricien » et « electri » se rejoignent. */
export const normaliser = (texte: string) =>
  texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/** Suggestions pour une saisie : d'abord celles qui commencent par la saisie, puis celles qui la contiennent. */
export function filtrerSuggestions(suggestions: string[], saisie: string, max = 6): string[] {
  const s = normaliser(saisie);
  if (!s) return [];
  const debut = suggestions.filter((x) => normaliser(x).startsWith(s));
  const dedans = suggestions.filter((x) => !debut.includes(x) && normaliser(x).includes(s));
  return [...debut, ...dedans].filter((x) => normaliser(x) !== s).slice(0, max);
}
