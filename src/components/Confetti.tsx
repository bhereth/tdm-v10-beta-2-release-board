"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface ConfettiProps {
  /** "small" for a single card reveal, "large" for full-board completion. */
  size?: "small" | "large";
  /** Bump this to re-trigger a burst (e.g. taskId or a counter). */
  triggerKey: string | number;
}

const COLORS = ["#4c76ab", "#d17f22", "#3a5c8a", "#eab566", "#26354e"];

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
  drift: number;
}

function makePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.25,
    duration: 1.1 + Math.random() * 0.7,
    rotate: Math.random() * 360,
    color: COLORS[i % COLORS.length]!,
    drift: (Math.random() - 0.5) * 60,
  }));
}

/**
 * A small, tasteful confetti burst built from plain animated divs (no
 * canvas, no external library, no sound). Renders nothing when the visitor
 * prefers reduced motion.
 */
export function Confetti({ size = "small", triggerKey }: ConfettiProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const pieces = useMemo(
    () => makePieces(size === "large" ? 60 : 24),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triggerKey, size]
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [triggerKey, prefersReducedMotion]);

  if (prefersReducedMotion || !visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-[-10px] block h-2.5 w-1.5 rounded-sm"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animation: `confetti-fall ${piece.duration}s ease-in ${piece.delay}s forwards`,
            // custom property consumed by the keyframe for horizontal drift
            ["--drift" as string]: `${piece.drift}px`,
            ["--rotate" as string]: `${piece.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
