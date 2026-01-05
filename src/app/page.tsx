import Image from "next/image";
import Gallery from "@/components/Gallery";
import StudioDiary from "@/components/StudioDiary";
import CommissionForm from "@/components/CommissionForm";
import ProcessSlider from "@/components/ProcessSlider";
import About from "@/components/About";
import MotionSection from "@/components/MotionSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-bone text-charcoal paper-grain">
      <MotionSection>
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <Image
            src="/art/the lady of art - kaluki.webp"
            alt="Hero: The Lady of Art by Kaluki"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-umbra/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-umbra/35 to-transparent" />
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight">
              Kaluki
            </h1>
            <p className="font-sans text-lg md:text-xl text-bone/90 max-w-2xl mx-auto mb-8">
              Hyper‑realistic pencil & charcoal drawings. African identity rendered in graphite.
            </p>
            <a
              href="#gallery"
              className="inline-block bg-ochre hover:bg-ochre/90 text-white font-sans font-semibold px-8 py-4 rounded-full transition-colors interactive"
            >
              View the Gallery
            </a>
          </div>
        </section>
      </MotionSection>
      <MotionSection>
        <About />
      </MotionSection>
      <MotionSection>
        <Gallery />
      </MotionSection>
      <MotionSection>
        <ProcessSlider />
      </MotionSection>
      <MotionSection>
        <StudioDiary />
      </MotionSection>
      <MotionSection>
        <CommissionForm />
      </MotionSection>
    </div>
  );
}
