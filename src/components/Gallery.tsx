"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { works, type Work } from "@/lib/works";

const DynamicMuseumGallery3D = dynamic(() => import("@/components/MuseumGallery3D"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-umbra/20 bg-bone p-6 text-charcoal shadow-lg">
      <div className="font-display text-2xl mb-2">Loading 3D Museum…</div>
      <p className="text-sm text-charcoal/70">
        Preparing the gallery space. If this takes too long, switch back to 2D.
      </p>
    </div>
  ),
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function Gallery() {
  const [focused, setFocused] = useState<Work | null>(null);
  const [mode, setMode] = useState<"grid" | "museum">("grid");

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; originX: number; originY: number }>(
    { active: false, startX: 0, startY: 0, originX: 0, originY: 0 }
  );

  const bounds = useMemo(() => {
    const el = viewportRef.current;
    if (!el) return { maxX: 0, maxY: 0 };
    const { width, height } = el.getBoundingClientRect();
    return {
      maxX: ((zoom - 1) * width) / 2,
      maxY: ((zoom - 1) * height) / 2,
    };
  }, [zoom, focused]);

  useEffect(() => {
    if (!focused) return;

    lastActiveRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
      lastActiveRef.current?.focus?.();
    };
  }, [focused]);

  useEffect(() => {
    if (!focused) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!focused) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setFocused(null);
        return;
      }

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setZoom((z) => clamp(Number((z + 0.25).toFixed(2)), 1, 4));
        return;
      }

      if (e.key === "-") {
        e.preventDefault();
        setZoom((z) => clamp(Number((z - 0.25).toFixed(2)), 1, 4));
        return;
      }

      if (e.key === "0") {
        e.preventDefault();
        setZoom(1);
        setPan({ x: 0, y: 0 });
        return;
      }

      const step = e.shiftKey ? 80 : 40;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPan((p) => ({ ...p, x: clamp(p.x + step, -bounds.maxX, bounds.maxX) }));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPan((p) => ({ ...p, x: clamp(p.x - step, -bounds.maxX, bounds.maxX) }));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setPan((p) => ({ ...p, y: clamp(p.y + step, -bounds.maxY, bounds.maxY) }));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setPan((p) => ({ ...p, y: clamp(p.y - step, -bounds.maxY, bounds.maxY) }));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focused, bounds.maxX, bounds.maxY]);

  useEffect(() => {
    if (!focused) return;
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [focused]);

  return (
    <>
      <section id="gallery" className="py-24 px-6 bg-bone">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Masterpieces</h2>
          <p className="text-center text-charcoal/70 max-w-2xl mx-auto mb-12">
            Click any piece to explore in high‑fidelity detail.
          </p>

          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex rounded-full border border-umbra/20 bg-bone p-1 shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  mode === "grid" ? "bg-ochre text-white" : "text-charcoal hover:bg-umbra/10"
                }`}
                onClick={() => setMode("grid")}
                aria-pressed={mode === "grid"}
              >
                2D Grid
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  mode === "museum" ? "bg-ochre text-white" : "text-charcoal hover:bg-umbra/10"
                }`}
                onClick={() => setMode("museum")}
                aria-pressed={mode === "museum"}
              >
                3D Museum
              </button>
            </div>
          </div>

          {mode === "museum" ? (
            <DynamicMuseumGallery3D
              works={works}
              onSelect={setFocused}
              onExit={focused ? undefined : () => setMode("grid")}
            />
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {works.map((work) => (
                <button
                  key={work.id}
                  type="button"
                  className="break-inside-avoid group cursor-pointer interactive w-full text-left"
                  onClick={() => setFocused(work)}
                  onContextMenu={(e) => e.preventDefault()}
                  aria-label={`Open focus view: ${work.title}`}
                >
                  <div className="relative overflow-hidden rounded-lg bg-umbra/5">
                    <Image
                      src={work.src}
                      alt={work.alt}
                      width={600}
                      height={800}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-umbra/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-display text-lg">{work.title}</h3>
                        <p className="text-sm">
                          {work.medium} · {work.dimensions}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {focused && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-umbra/95 p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="focus-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={() => setFocused(null)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <motion.div
              className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-bone rounded-lg shadow-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeBtnRef}
                className="absolute top-4 right-4 bg-ochre text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-ochre/90 transition-colors z-20"
                onClick={() => setFocused(null)}
                aria-label="Close focus view"
              >
                ×
              </button>

              <div className="grid lg:grid-cols-2 gap-6 p-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-charcoal/60">
                      Zoom: <span className="font-semibold text-charcoal">{Math.round(zoom * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-full border border-umbra/20 hover:bg-umbra/10 transition-colors"
                        onClick={() => setZoom((z) => clamp(Number((z - 0.25).toFixed(2)), 1, 4))}
                        aria-label="Zoom out"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-full border border-umbra/20 hover:bg-umbra/10 transition-colors"
                        onClick={() => {
                          setZoom(1);
                          setPan({ x: 0, y: 0 });
                        }}
                        aria-label="Reset zoom"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-full border border-umbra/20 hover:bg-umbra/10 transition-colors"
                        onClick={() => setZoom((z) => clamp(Number((z + 0.25).toFixed(2)), 1, 4))}
                        aria-label="Zoom in"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div
                    ref={viewportRef}
                    className="relative w-full h-[60vh] lg:h-[70vh] overflow-hidden rounded-lg bg-umbra/5 select-none"
                    onContextMenu={(e) => e.preventDefault()}
                    onWheel={(e) => {
                      e.preventDefault();
                      const delta = e.deltaY;
                      setZoom((z) => {
                        const next = clamp(Number((z + (delta > 0 ? -0.1 : 0.1)).toFixed(2)), 1, 4);
                        if (next === 1) setPan({ x: 0, y: 0 });
                        return next;
                      });
                    }}
                    onPointerDown={(e) => {
                      if (zoom <= 1) return;
                      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
                      dragRef.current = {
                        active: true,
                        startX: e.clientX,
                        startY: e.clientY,
                        originX: pan.x,
                        originY: pan.y,
                      };
                    }}
                    onPointerMove={(e) => {
                      if (!dragRef.current.active || zoom <= 1) return;
                      const dx = e.clientX - dragRef.current.startX;
                      const dy = e.clientY - dragRef.current.startY;
                      const nextX = clamp(dragRef.current.originX + dx, -bounds.maxX, bounds.maxX);
                      const nextY = clamp(dragRef.current.originY + dy, -bounds.maxY, bounds.maxY);
                      setPan({ x: nextX, y: nextY });
                    }}
                    onPointerUp={(e) => {
                      dragRef.current.active = false;
                      try {
                        (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: "center",
                        cursor: zoom > 1 ? "grab" : "default",
                      }}
                    >
                      <Image
                        src={focused.src}
                        alt={focused.alt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-contain pointer-events-none"
                        draggable={false}
                        priority
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-charcoal/60">
                    Keyboard: <span className="font-semibold">+</span>/<span className="font-semibold">-</span> to zoom,
                    <span className="font-semibold"> 0</span> reset, arrows pan, <span className="font-semibold">Esc</span> close.
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <h2 id="focus-title" className="font-display text-3xl mb-2">
                    {focused.title}
                  </h2>
                  <p className="text-sm text-charcoal/60 mb-4">
                    {focused.medium} · {focused.dimensions}
                  </p>
                  <p className="text-charcoal leading-relaxed">{focused.story}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
