import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          scrub: 1,
          pin: true,
          trigger: containerRef.current,
          start: '50% 50%',
          endTrigger: wrapperRef.current,
          end: 'bottom 50%',
        },
      });

      tl.to(svgRef.current, {
        rotateZ: 900,
        ease: 'none',
      });
    }, wrapperRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      id="pin-windmill-wrap"
      className="relative min-h-[200vh] bg-gradient-to-b from-background via-background to-background"
    >
      <div
        ref={containerRef}
        id="pin-windmill"
        className="windmill-container h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-8">
            Organize Your Digital Life
          </p>
          <svg
            ref={svgRef}
            id="pin-windmill-svg"
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="mx-auto"
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

            {/* Outer decorative elements */}
            <g stroke="url(#orangeGradient2)" strokeWidth="2" fill="none" opacity="0.3">
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
          <p className="mt-8 text-lg text-foreground font-medium">
            Links • Notes • Images
          </p>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Everything you save, beautifully organized and instantly searchable.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScrollAnimation;
