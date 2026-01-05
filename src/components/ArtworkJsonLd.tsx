import { works } from "@/lib/works";

export default function ArtworkJsonLd() {
  const graph = works.map((w) => ({
    "@type": "VisualArtwork",
    name: w.title,
    artform: "Drawing",
    artMedium: w.medium,
    artworkSurface: "Paper",
    description: w.story,
    image: w.src,
    creator: {
      "@type": "Person",
      name: "Kaluki",
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
