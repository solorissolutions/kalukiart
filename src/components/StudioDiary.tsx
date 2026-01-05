"use client";

import { useEffect } from "react";
import Script from "next/script";

const embeds = [
  {
    id: "DKcOp_CsVPG",
    permalink: "https://www.instagram.com/p/DKcOp_CsVPG/?utm_source=ig_embed&utm_campaign=loading",
  },
  {
    id: "DIT9DJNt2F8",
    permalink: "https://www.instagram.com/p/DIT9DJNt2F8/?utm_source=ig_embed&utm_campaign=loading",
  },
  {
    id: "C9DMUIoNOT1",
    permalink: "https://www.instagram.com/p/C9DMUIoNOT1/?utm_source=ig_embed&utm_campaign=loading",
  },
];

export default function StudioDiary() {
  useEffect(() => {
    const w = window as unknown as { instgrm?: { Embeds?: { process?: () => void } } };
    w.instgrm?.Embeds?.process?.();
  }, []);

  return (
    <section id="studio-diary" className="py-24 px-6 bg-umbra text-bone">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Studio Diary</h2>
        <p className="text-center text-bone/80 max-w-2xl mx-auto mb-12">
          Behind the scenes: sketches, processes, and moments in the studio.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {embeds.map((e) => (
            <div key={e.id} className="rounded-lg overflow-hidden bg-bone">
              <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink={e.permalink}
                data-instgrm-version="14"
                style={{ margin: 0, width: "100%" }}
              >
                <a href={e.permalink} target="_blank" rel="noreferrer">
                  View this post on Instagram
                </a>
              </blockquote>
            </div>
          ))}
        </div>

        <Script
          async
          src="https://www.instagram.com/embed.js"
          strategy="lazyOnload"
          onLoad={() => {
            const w = window as unknown as { instgrm?: { Embeds?: { process?: () => void } } };
            w.instgrm?.Embeds?.process?.();
          }}
        />
      </div>
    </section>
  );
}
