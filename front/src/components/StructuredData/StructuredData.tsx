/** Données structurées schema.org (JSON-LD) d'une page, lues par les moteurs de recherche. */
export function StructuredData({ data }: { data: object }) {
  // « < » est échappé pour qu'aucun texte ne puisse fermer la balise script.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
