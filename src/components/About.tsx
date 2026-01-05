import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-bone">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">About Kaluki</h2>
        <p className="text-center text-charcoal/70 max-w-2xl mx-auto mb-12">
          Artist statement and journey.
        </p>

        <div className="flex justify-center mb-10">
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden ring-2 ring-ochre/30 shadow-lg bg-bone">
            <Image
              src="/art/bio.webp"
              alt="Portrait of Kaluki"
              fill
              sizes="144px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-display text-ochre mb-2">10+</div>
            <div className="text-sm text-charcoal/60">Years of Mastery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display text-ochre mb-2">Nairobi</div>
            <div className="text-sm text-charcoal/60">Based in Kenya</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display text-ochre mb-2">8B Graphite</div>
            <div className="text-sm text-charcoal/60">Signature Medium</div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none text-charcoal">
          <p>
            Kaluki is a Nairobi‑based pencil artist whose work bridges technical precision and African storytelling. With over a decade dedicated to hyper‑realistic graphite and charcoal, Kaluki transforms everyday moments—portraits, wildlife, cultural symbols—into intimate, larger‑than‑life drawings.
          </p>
          <p>
            Each piece begins with a vision of texture: the grain of skin, the curve of a braid, the quiet dignity in an elder’s eyes. Using 8B graphite and charcoal on archival paper, Kaluki builds layers of tone that invite viewers closer, revealing details only visible up close.
          </p>
          <p>
            Exhibited locally and collected internationally, Kaluki’s art is a meditation on identity, memory, and the power of the hand‑drawn line in a digital age.
          </p>
        </div>
      </div>
    </section>
  );
}
