import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bone text-charcoal flex flex-col items-center justify-center px-6 paper-grain">
      <h1 className="font-display text-6xl md:text-8xl mb-4">404</h1>
      <p className="text-lg md:text-xl text-charcoal/70 text-center max-w-md mb-8">
        Oops! This page doesn’t exist. Let’s get you back to the art.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-ochre hover:bg-ochre/90 text-white font-sans font-semibold px-8 py-4 rounded-full transition-colors interactive"
      >
        <ArrowLeft size={20} />
        Take me back to the Art
      </Link>
    </div>
  );
}
