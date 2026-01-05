"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, SoftShadows, useTexture } from "@react-three/drei";
import { SRGBColorSpace, Vector3 } from "three";
import type { Work } from "@/lib/works";

type Props = {
  works: Work[];
  onSelect: (work: Work) => void;
  onExit?: () => void;
};

function hasWebGL(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function isMobileLike() {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
  const touchPoints = typeof navigator !== "undefined" && (navigator.maxTouchPoints || 0) > 0;
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const uaMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  return Boolean(coarse || touchPoints || uaMobile);
}

function MuseumScene({
  works,
  onSelect,
  look,
  resetNonce,
  lowQuality,
  moveRef,
}: {
  works: Work[];
  onSelect: (w: Work) => void;
  look: MutableRefObject<{ yaw: number; pitch: number }>;
  resetNonce: number;
  lowQuality: boolean;
  moveRef: MutableRefObject<{ forward: boolean; back: boolean; left: boolean; right: boolean }>;
}) {
  const { camera } = useThree();

  // Museum corridor bounds (simple clamping for non-clipping)
  const bounds = useMemo(
    () => ({
      minX: -3.2,
      maxX: 3.2,
      minZ: -22,
      maxZ: 7,
      eyeY: 1.65,
    }),
    []
  );

  const keysRef = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false,
  });

  useEffect(() => {
    camera.position.set(0, bounds.eyeY, 6.2);
    camera.rotation.set(0, 0, 0);
  }, [camera, bounds.eyeY, resetNonce]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w") keysRef.current.w = true;
      if (k === "a") keysRef.current.a = true;
      if (k === "s") keysRef.current.s = true;
      if (k === "d") keysRef.current.d = true;
      if (e.key === "ArrowUp") keysRef.current.up = true;
      if (e.key === "ArrowDown") keysRef.current.down = true;
      if (e.key === "ArrowLeft") keysRef.current.left = true;
      if (e.key === "ArrowRight") keysRef.current.right = true;
      if (e.key === "Shift") keysRef.current.shift = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w") keysRef.current.w = false;
      if (k === "a") keysRef.current.a = false;
      if (k === "s") keysRef.current.s = false;
      if (k === "d") keysRef.current.d = false;
      if (e.key === "ArrowUp") keysRef.current.up = false;
      if (e.key === "ArrowDown") keysRef.current.down = false;
      if (e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "ArrowRight") keysRef.current.right = false;
      if (e.key === "Shift") keysRef.current.shift = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const { w, a, s, d, up, down, left, right, shift } = keysRef.current;
    const m = moveRef.current;

    const speed = shift ? 4.4 : 2.6;
    const dist = speed * delta;

    // forward vector based on yaw (keep movement grounded)
    const yaw = look.current.yaw;
    const forward = new Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
    const rightVec = new Vector3(Math.cos(yaw), 0, Math.sin(yaw));

    const next = camera.position.clone();

    if (w || up || m.forward) next.add(forward.clone().multiplyScalar(dist));
    if (s || down || m.back) next.add(forward.clone().multiplyScalar(-dist));
    if (d || right || m.right) next.add(rightVec.clone().multiplyScalar(dist));
    if (a || left || m.left) next.add(rightVec.clone().multiplyScalar(-dist));

    next.x = clamp(next.x, bounds.minX, bounds.maxX);
    next.z = clamp(next.z, bounds.minZ, bounds.maxZ);
    next.y = bounds.eyeY;

    camera.position.copy(next);

    // apply look
    const pitch = clamp(look.current.pitch, -0.6, 0.45);
    camera.rotation.set(pitch, yaw, 0);
  });

  const placements = useMemo(() => {
    const leftX = -3.92;
    const rightX = 3.92;
    const y = 1.75;

    const zStart = 5.0;
    const zEnd = -20.0;

    const count = works.length;
    const perSide = Math.ceil(count / 2);
    const step = perSide > 1 ? (zStart - zEnd) / (perSide - 1) : 0;

    return works.map((w, idx) => {
      const side = idx % 2 === 0 ? "left" : "right";
      const slot = Math.floor(idx / 2);
      const z = zStart - slot * step;
      return {
        work: w,
        position: [side === "left" ? leftX : rightX, y, z] as [number, number, number],
        rotation: [0, side === "left" ? -Math.PI / 2 : Math.PI / 2, 0] as [number, number, number],
      };
    });
  }, [works]);

  return (
    <group>
      {!lowQuality && <SoftShadows size={25} samples={10} focus={0.5} />}

      {/* Warm lights */}
      <ambientLight intensity={lowQuality ? 0.9 : 0.5} color="#F4F1EA" />
      {lowQuality ? (
        <hemisphereLight intensity={0.65} color="#fff3dd" groundColor="#2B241E" />
      ) : (
        <>
          <spotLight
            position={[0, 5.5, 4]}
            angle={0.45}
            penumbra={0.7}
            intensity={55}
            color="#fff3dd"
            castShadow
          />
          <spotLight
            position={[0, 5.5, -10]}
            angle={0.55}
            penumbra={0.75}
            intensity={45}
            color="#ffe8c8"
            castShadow
          />
          <Environment preset="city" />
        </>
      )}

      {/* Room shell */}
      <mesh position={[0, 2, -7]} receiveShadow={!lowQuality}>
        <boxGeometry args={[8.2, 4.2, 30]} />
        {lowQuality ? (
          <meshLambertMaterial color="#F4F1EA" />
        ) : (
          <meshStandardMaterial color="#F4F1EA" roughness={0.98} metalness={0} />
        )}
      </mesh>

      {/* Hollow inside: floor plane overlays the box for nice shading */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -7]} receiveShadow={!lowQuality}>
        <planeGeometry args={[8, 30]} />
        {lowQuality ? (
          <meshLambertMaterial color="#e8ddcf" />
        ) : (
          <meshStandardMaterial color="#e8ddcf" roughness={0.92} metalness={0.02} />
        )}
      </mesh>

      {/* Side wall tinting */}
      <mesh position={[-4, 2, -7]} receiveShadow={!lowQuality}>
        <boxGeometry args={[0.15, 4.2, 30]} />
        {lowQuality ? (
          <meshLambertMaterial color="#efe6db" />
        ) : (
          <meshStandardMaterial color="#efe6db" roughness={0.98} />
        )}
      </mesh>
      <mesh position={[4, 2, -7]} receiveShadow={!lowQuality}>
        <boxGeometry args={[0.15, 4.2, 30]} />
        {lowQuality ? (
          <meshLambertMaterial color="#efe6db" />
        ) : (
          <meshStandardMaterial color="#efe6db" roughness={0.98} />
        )}
      </mesh>

      {/* Ceiling beams (subtle) */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[0, 4.05, 6 - i * 3]} castShadow={!lowQuality}>
          <boxGeometry args={[8.1, 0.12, 0.22]} />
          {lowQuality ? (
            <meshLambertMaterial color="#d8c4ad" />
          ) : (
            <meshStandardMaterial color="#d8c4ad" roughness={0.9} />
          )}
        </mesh>
      ))}

      {/* Artworks */}
      {placements.map((p) => (
        <Suspense key={p.work.id} fallback={null}>
          <FramedArtwork
            work={p.work}
            position={p.position}
            rotation={p.rotation}
            onSelect={onSelect}
            lowQuality={lowQuality}
          />
        </Suspense>
      ))}

      {/* Instruction plaque in the entrance */}
      <Html position={[0, 1.45, 6.6]} transform occlude>
        <div className="pointer-events-none select-none rounded-lg border border-umbra/20 bg-bone/95 px-3 py-2 text-xs text-charcoal shadow-lg">
          <div className="font-semibold">Virtual Museum</div>
          <div className="mt-1 text-charcoal/70">WASD/arrows move • drag to look • click art to focus</div>
        </div>
      </Html>
    </group>
  );
}

function FramedArtwork({
  work,
  position,
  rotation,
  onSelect,
  lowQuality,
}: {
  work: Work;
  position: [number, number, number];
  rotation: [number, number, number];
  onSelect: (work: Work) => void;
  lowQuality: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const safeSrc = useMemo(() => encodeURI(work.src).replace(/#/g, "%23"), [work.src]);
  const texture = useTexture(safeSrc);
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  // Consistent, gallery-like proportions
  const innerW = 0.9;
  const innerH = 1.15;
  const matte = 0.08;
  const frame = 0.08;

  const outerW = innerW + matte * 2 + frame * 2;
  const outerH = innerH + matte * 2 + frame * 2;

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(work);
      }}
    >
      {/* Frame */}
      <mesh castShadow={!lowQuality} position={[0, 0, 0.03]}>
        <boxGeometry args={[outerW, outerH, 0.08]} />
        {lowQuality ? (
          <meshLambertMaterial color={hovered ? "#BC6C25" : "#7a5a3a"} />
        ) : (
          <meshStandardMaterial color={hovered ? "#BC6C25" : "#7a5a3a"} roughness={0.7} metalness={0.05} />
        )}
      </mesh>

      {/* Matte */}
      <mesh castShadow={!lowQuality} position={[0, 0, 0.075]}>
        <planeGeometry args={[innerW + matte * 2, innerH + matte * 2]} />
        {lowQuality ? (
          <meshLambertMaterial color="#F4F1EA" />
        ) : (
          <meshStandardMaterial color="#F4F1EA" roughness={0.95} />
        )}
      </mesh>

      {/* Artwork */}
      <mesh castShadow={!lowQuality} position={[0, 0, 0.085]}>
        <planeGeometry args={[innerW, innerH]} />
        {lowQuality ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshStandardMaterial map={texture} roughness={0.95} metalness={0} />
        )}
      </mesh>

      {/* Title plate */}
      <Html position={[0, -(outerH / 2 + 0.18), 0.08]} transform occlude>
        <div className="pointer-events-none max-w-[180px] text-center">
          <div className="rounded-full border border-umbra/20 bg-bone/95 px-3 py-1 text-[11px] text-charcoal shadow">
            {work.title}
          </div>
        </div>
      </Html>

      {/* Hover hint */}
      {hovered && (
        <Html position={[0, outerH / 2 + 0.22, 0.08]} transform occlude>
          <div className="pointer-events-none rounded-full bg-ochre px-3 py-1 text-[11px] font-semibold text-white shadow">
            Click to focus
          </div>
        </Html>
      )}
    </group>
  );
}

function MuseumCanvas({
  works,
  onSelect,
  resetNonce,
  lowQuality,
  showTouchControls,
}: {
  works: Work[];
  onSelect: (w: Work) => void;
  resetNonce: number;
  lowQuality: boolean;
  showTouchControls: boolean;
}) {
  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  const lookRef = useRef({ yaw: 0, pitch: 0 });
  const moveRef = useRef({ forward: false, back: false, left: false, right: false });

  useEffect(() => {
    lookRef.current = { yaw: 0, pitch: 0 };
  }, [resetNonce]);

  function pushLook(dx: number, dy: number) {
    lookRef.current.yaw += dx * 0.004;
    lookRef.current.pitch = clamp(lookRef.current.pitch + dy * 0.004, -0.6, 0.45);
  }

  return (
    <div
      className="relative w-full h-[70vh] rounded-xl overflow-hidden border border-umbra/20 bg-bone shadow-2xl"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        draggingRef.current = true;
        lastRef.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current) return;
        const dx = e.clientX - lastRef.current.x;
        const dy = e.clientY - lastRef.current.y;
        lastRef.current = { x: e.clientX, y: e.clientY };
        pushLook(dx, dy);
      }}
      onPointerUp={() => {
        draggingRef.current = false;
      }}
      onPointerLeave={() => {
        draggingRef.current = false;
      }}
    >
      <Canvas
        shadows={!lowQuality}
        dpr={lowQuality ? 1 : [1, 1.75]}
        camera={{ fov: 55, near: 0.1, far: 120, position: [0, 1.65, 6.2] }}
        gl={{ antialias: !lowQuality, powerPreference: "high-performance", precision: lowQuality ? "mediump" : "highp" }}
      >
        <Suspense fallback={null}>
          <MuseumScene
            works={works}
            onSelect={onSelect}
            look={lookRef}
            resetNonce={resetNonce}
            lowQuality={lowQuality}
            moveRef={moveRef}
          />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-3 left-3 rounded-lg border border-umbra/20 bg-bone/90 px-3 py-2 text-xs text-charcoal shadow-lg">
        <div className="font-semibold">Controls</div>
        <div className="text-charcoal/70">WASD/arrows move • drag to look • click artwork to open focus view</div>
      </div>

      {showTouchControls && (
        <div className="absolute bottom-3 right-3 grid grid-cols-3 grid-rows-3 gap-1 select-none">
          <div />
          <TouchButton
            label="↑"
            onDown={() => (moveRef.current.forward = true)}
            onUp={() => (moveRef.current.forward = false)}
          />
          <div />
          <TouchButton
            label="←"
            onDown={() => (moveRef.current.left = true)}
            onUp={() => (moveRef.current.left = false)}
          />
          <div className="w-12 h-12" />
          <TouchButton
            label="→"
            onDown={() => (moveRef.current.right = true)}
            onUp={() => (moveRef.current.right = false)}
          />
          <div />
          <TouchButton
            label="↓"
            onDown={() => (moveRef.current.back = true)}
            onUp={() => (moveRef.current.back = false)}
          />
          <div />
        </div>
      )}
    </div>
  );
}

function TouchButton({
  label,
  onDown,
  onUp,
}: {
  label: string;
  onDown: () => void;
  onUp: () => void;
}) {
  return (
    <button
      type="button"
      className="w-12 h-12 rounded-lg border border-umbra/20 bg-bone/90 text-charcoal shadow active:bg-umbra/10"
      onPointerDown={(e) => {
        e.preventDefault();
        onDown();
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        onUp();
      }}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
      aria-label={label}
    >
      {label}
    </button>
  );
}

export default function MuseumGallery3D({ works, onSelect, onExit }: Props) {
  const [supported, setSupported] = useState(true);
  const [resetNonce, setResetNonce] = useState(0);
  const [lowQuality, setLowQuality] = useState(() => isMobileLike());
  const [showTouchControls, setShowTouchControls] = useState(() => isMobileLike());

  const gpuSafe = lowQuality || showTouchControls;

  useEffect(() => {
    setSupported(hasWebGL());
    const mobile = isMobileLike();
    setShowTouchControls(mobile);
    setLowQuality(mobile);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onExit]);

  if (!supported) {
    return (
      <div className="rounded-xl border border-umbra/20 bg-bone p-6 text-charcoal shadow-lg">
        <h3 className="font-display text-2xl mb-2">3D Gallery not supported</h3>
        <p className="text-sm text-charcoal/70 mb-4">
          Your browser/device doesn’t support WebGL. You can still explore the full gallery in 2D.
        </p>
        {onExit && (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-ochre px-5 py-2 text-white hover:bg-ochre/90 transition-colors"
            onClick={onExit}
          >
            Return to 2D Grid
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-xs text-charcoal/70">
          Tip: Hold <span className="font-semibold text-charcoal">Shift</span> to move faster.
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-umbra/20 bg-bone px-4 py-2 text-sm text-charcoal hover:bg-umbra/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => setLowQuality((q) => !q)}
            disabled={showTouchControls}
          >
            {gpuSafe ? "Quality: Mobile Safe" : "Quality: High"}
          </button>
          <button
            type="button"
            className="rounded-full border border-umbra/20 bg-bone px-4 py-2 text-sm text-charcoal hover:bg-umbra/10 transition-colors"
            onClick={() => {
              setResetNonce((n) => n + 1);
            }}
          >
            Reset View
          </button>
          {onExit && (
            <button
              type="button"
              className="rounded-full bg-ochre px-4 py-2 text-sm text-white hover:bg-ochre/90 transition-colors"
              onClick={onExit}
            >
              Exit 3D
            </button>
          )}
        </div>
      </div>

      <MuseumCanvas
        works={works}
        onSelect={onSelect}
        resetNonce={resetNonce}
        lowQuality={gpuSafe}
        showTouchControls={showTouchControls}
      />
    </div>
  );
}
