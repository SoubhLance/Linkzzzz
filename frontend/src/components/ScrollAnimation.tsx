import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const outerRingsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Set initial states for animated elements
      gsap.set(headingRef.current, { opacity: 0, y: -20 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 40 });
      gsap.set(descRef.current, { opacity: 0, y: 30 });
      gsap.set(bgGlowRef.current, { opacity: 0, scale: 0.6 });
      gsap.set(outerRingsRef.current, { opacity: 0, scale: 0.7 });

      // Main scroll-driven timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '50% 50%',
          endTrigger: wrapperRef.current,
          end: 'bottom 50%',
          scrub: true,
          pin: true,
        },
      });

      // ── Phase 1: Fan scales up + glow appears (0% → 20%)
      tl.to(svgRef.current, {
        rotateZ: 120,
        scale: 1.15,
        ease: 'none',
        duration: 1,
      }, 0)
      .to(bgGlowRef.current, {
        opacity: 0.6,
        scale: 1,
        ease: 'power2.out',
        duration: 1,
      }, 0)
      .to(outerRingsRef.current, {
        opacity: 0.4,
        scale: 1,
        ease: 'power2.out',
        duration: 0.8,
      }, 0.2);

      // ── Phase 2: Heading fades in + fan continues rotating (20% → 45%)
      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 1,
      }, 0.8)
      .to(svgRef.current, {
        rotateZ: 360,
        ease: 'none',
        duration: 1.5,
      }, 1);

      // ── Phase 3: Subtitle slides up + description fades in (45% → 70%)
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 1,
      }, 2)
      .to(descRef.current, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 1,
      }, 2.4);

      // ── Phase 4: Fan continues to full rotation + slight fade out (70% → 100%)
      tl.to(svgRef.current, {
        rotateZ: 540,
        scale: 1.05,
        opacity: 0.6,
        ease: 'none',
        duration: 1.5,
      }, 3)
      .to(bgGlowRef.current, {
        opacity: 0.2,
        scale: 1.3,
        ease: 'power2.in',
        duration: 1.5,
      }, 3);

      // ── Parallax: background glow moves slower than content
      gsap.to(bgGlowRef.current, {
        y: -60,
        scrollTrigger: {
          trigger: containerRef.current,
          start: '50% 50%',
          endTrigger: wrapperRef.current,
          end: 'bottom 50%',
          scrub: true,
        },
      });

    }, wrapperRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      id="pin-windmill-wrap"
      className="relative min-h-[300vh] bg-gradient-to-b from-background via-background to-background"
    >
      <div
        ref={containerRef}
        id="pin-windmill"
        className="windmill-container h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background glow — parallax layer (moves slower) */}
        <div
          ref={bgGlowRef}
          className="absolute inset-0 pointer-events-none"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[300px] h-[300px] rounded-full bg-orange-600/6 blur-[100px]" />
        </div>

        <div className="text-center relative z-10">
          {/* Heading — revealed in Phase 2 */}
          <p
            ref={headingRef}
            className="text-sm uppercase tracking-widest text-muted-foreground mb-8"
          >
            Organize Your Digital Life
          </p>

          {/* Fan SVG */}
          <svg
            ref={svgRef}
            id="pin-windmill-svg"
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="mx-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Brain-inspired geometric design */}
            <defs>
              <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(24, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(15, 100%, 45%)" />
              </linearGradient>
              <linearGradient id="orangeGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(30, 100%, 55%)" />
                <stop offset="100%" stopColor="hsl(20, 100%, 48%)" />
              </linearGradient>
            </defs>

            {/* Central circle */}
            <circle cx="100" cy="100" r="15" fill="url(#orangeGradient)" />

            {/* Windmill blades */}
            <g fill="url(#orangeGradient)">
              {/* Top blade */}
              <path d="M100 85 L95 30 Q100 20 105 30 L100 85" opacity="0.9" />
              {/* Right blade */}
              <path d="M115 100 L170 95 Q180 100 170 105 L115 100" opacity="0.9" />
              {/* Bottom blade */}
              <path d="M100 115 L105 170 Q100 180 95 170 L100 115" opacity="0.9" />
              {/* Left blade */}
              <path d="M85 100 L30 105 Q20 100 30 95 L85 100" opacity="0.9" />
            </g>

            {/* Outer decorative elements — animated separately */}
            <g ref={outerRingsRef} stroke="url(#orangeGradient2)" strokeWidth="2" fill="none" opacity="0.3">
              <circle cx="100" cy="100" r="60" strokeDasharray="10 5" />
              <circle cx="100" cy="100" r="80" strokeDasharray="5 10" />
            </g>

            {/* Connection nodes */}
            <g fill="url(#orangeGradient)" opacity="0.7">
              <circle cx="100" cy="40" r="4" />
              <circle cx="160" cy="100" r="4" />
              <circle cx="100" cy="160" r="4" />
              <circle cx="40" cy="100" r="4" />
            </g>
          </svg>

          {/* Subtitle — revealed in Phase 3 */}
          <p
            ref={subtitleRef}
            className="mt-8 text-lg text-foreground font-medium"
          >
            Links • Notes • Images
          </p>

          {/* Description — revealed in Phase 3 */}
          <p
            ref={descRef}
            className="mt-2 text-muted-foreground max-w-md mx-auto"
          >
            Everything you save, beautifully organized and instantly searchable.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScrollAnimation;
