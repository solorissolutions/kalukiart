export type Work = {
  id: number;
  src: string;
  title: string;
  medium: string;
  dimensions: string;
  story: string;
  alt: string;
};

export const works: Work[] = [
  {
    id: 1,
    src: "/art/the lady of art - kaluki.webp",
    title: "The Lady of Art",
    medium: "Graphite & Charcoal",
    dimensions: "A3",
    story: "A portrait celebrating African femininity and quiet strength.",
    alt: "Close-up pencil portrait of an African woman; soft charcoal shadows, detailed hair texture and graphite grain.",
  },
  {
    id: 2,
    src: "/art/artistic handrawn african elephant.webp",
    title: "Majestic Elephant",
    medium: "Graphite",
    dimensions: "A2",
    story: "The gentle giant rendered in meticulous detail.",
    alt: "Graphite drawing of an African elephant; fine wrinkle texture, dusty highlights, and dense pencil shading.",
  },
  {
    id: 3,
    src: "/art/sunflower-black woman.webp",
    title: "Sunflower Soul",
    medium: "Charcoal",
    dimensions: "A3",
    story: "Contrast between delicate petals and resilient spirit.",
    alt: "Charcoal portrait of a Black woman with sunflower; high-contrast tones and velvety charcoal gradients.",
  },
  {
    id: 4,
    src: "/art/hand drawn artistic old man.webp",
    title: "Wisdom’s Lines",
    medium: "Graphite",
    dimensions: "A2",
    story: "Every wrinkle tells a story of a life lived.",
    alt: "Hyper-realistic graphite portrait of an elderly African man; crisp skin texture and layered pencil tones.",
  },
  {
    id: 5,
    src: "/art/hairstyle detailing with pencil drawing.webp",
    title: "Braided Heritage",
    medium: "Graphite & Charcoal",
    dimensions: "A3",
    story: "An ode to intricate African hairstyling traditions.",
    alt: "Pencil study of braided hairstyle; precise strand definition and deep charcoal shadowing.",
  },
  {
    id: 6,
    src: "/art/the happy child of africa pencil drawn by kaluki.webp",
    title: "Joyful Innocence",
    medium: "Graphite",
    dimensions: "A4",
    story: "Unfiltered happiness captured in a fleeting moment.",
    alt: "Graphite portrait of a smiling African child; luminous highlights and soft tonal blending.",
  },
];
