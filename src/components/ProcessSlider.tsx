"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProcessSlider() {
  const [position, setPosition] = useState(50);

  return (
    <section className="py-24 px-6 bg-bone">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Process Revealed</h2>
        <p className="text-center text-charcoal/70 max-w-2xl mx-auto mb-12">
          Slide to compare the initial sketch with the finished hyper‑realistic drawing.
        </p>

        <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <Image
              src="/art/elephant comparison left.webp"
              alt="Initial sketch"
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - position}% 0 0)`,
            }}
          >
            <Image
              src="/art/elephant comparison right.webp"
              alt="Finished drawing"
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>

          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
            style={{ left: `${position}%` }}
            onDrag={(e) => {
              const rect = e.currentTarget.parentElement?.getBoundingClientRect();
              if (!rect) return;
              const x = e.clientX - rect.left;
              const percent = (x / rect.width) * 100;
              setPosition(Math.min(100, Math.max(0, percent)));
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-umbra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>

          <div className="absolute top-4 left-4 bg-umbra/80 text-white px-3 py-1 rounded-full text-sm">
            Sketch
          </div>
          <div className="absolute top-4 right-4 bg-umbra/80 text-white px-3 py-1 rounded-full text-sm">
            Final
          </div>
        </div>

        <p className="text-center text-sm text-charcoal/60 mt-6">
          Drag the slider to reveal the transformation.
        </p>
      </div>
    </section>
  );
}
