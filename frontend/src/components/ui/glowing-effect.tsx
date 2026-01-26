"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { motion, useAnimation, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = false,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const controls = useAnimation();

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 200, damping: 20 });
    const springY = useSpring(y, { stiffness: 200, damping: 20 });

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current || disabled) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = { x: left + width / 2, y: top + height / 2 };
          const distanceFromCenter = Math.sqrt(
            Math.pow(mouseX - center.x, 2) + Math.pow(mouseY - center.y, 2)
          );

          const inactiveRadius = (Math.min(width, height) / 2) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            x.set(center.x - left);
            y.set(center.y - top);
            return;
          }

          const relativeX = mouseX - left;
          const relativeY = mouseY - top;

          x.set(relativeX);
          y.set(relativeY);
        });
      },
      [inactiveZone, x, y, disabled]
    );

    useEffect(() => {
      if (disabled) return;

      const handleMouseMove = (e: MouseEvent) => handleMove(e);
      const handleScroll = () => handleMove();

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", handleScroll);
      };
    }, [handleMove, disabled]);

    useEffect(() => {
      if (!glow || disabled) {
        controls.start({ opacity: 0 });
        return;
      }

      controls.start({
        opacity: [0.5, 1, 0.5],
        transition: {
          duration: movementDuration,
          repeat: Infinity,
          repeatType: "mirror",
        },
      });
    }, [glow, controls, movementDuration, disabled]);

    return (
      <motion.div
        ref={containerRef}
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[inherit] opacity-100 transition-opacity",
          glow && "opacity-100",
          disabled && "!hidden",
          className
        )}
        style={
          {
            "--blur": `${blur}px`,
            "--spread": spread,
            "--proximity": proximity,
            "--x": springX,
            "--y": springY,
            "--border-width": `${borderWidth}px`,
            "--glow-opacity": glow ? 1 : 0,
          } as React.CSSProperties
        }
      >
        <motion.div
          className={cn(
            "absolute inset-0 rounded-[inherit]",
            variant === "white" && "bg-glow-white",
            variant === "default" && "bg-glow-default"
          )}
          style={{
            maskImage: `radial-gradient(circle at calc(var(--x) * 1px) calc(var(--y) * 1px), black 0%, transparent calc(var(--spread) * 1px))`,
            WebkitMaskImage: `radial-gradient(circle at calc(var(--x) * 1px) calc(var(--y) * 1px), black 0%, transparent calc(var(--spread) * 1px))`,
          }}
          animate={controls}
        />
        <motion.div
          className="absolute inset-0 rounded-[inherit] border"
          style={{
            borderWidth: "var(--border-width)",
            borderColor: variant === "white" ? "rgba(255,255,255,0.2)" : "hsl(var(--primary) / 0.3)",
            maskImage: `radial-gradient(circle at calc(var(--x) * 1px) calc(var(--y) * 1px), black 0%, transparent calc(var(--spread) * 1.5px))`,
            WebkitMaskImage: `radial-gradient(circle at calc(var(--x) * 1px) calc(var(--y) * 1px), black 0%, transparent calc(var(--spread) * 1.5px))`,
          }}
        />
      </motion.div>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
export type { GlowingEffectProps };
