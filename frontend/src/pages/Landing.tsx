import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Brain, FileText, Image, Zap, Search, Shield, Cloud } from 'lucide-react';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import ScrollAnimation from '@/components/ScrollAnimation';
import AuthModal from '@/components/AuthModal';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Link,
    title: 'Save Links',
    description: 'Capture any URL with a click. Never lose an important article or resource again.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileText,
    title: 'Quick Notes',
    description: 'Jot down thoughts and snippets instantly. Your ideas, always within reach.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Image,
    title: 'Image Library',
    description: 'Store and organize images. Visual inspiration at your fingertips.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Search,
    title: 'Instant Search',
    description: 'Find anything in seconds. Powerful search across all your saved content.',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Zap,
    title: 'Smart Categories',
    description: 'Auto-organize with intelligent tagging. Less effort, more structure.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Cloud,
    title: 'Always Synced',
    description: 'Access from anywhere. Your data follows you across all devices.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your data stays yours. End-to-end privacy, no compromises.',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'Your Second Brain',
    description: 'Build your personal knowledge base. Connect ideas like never before.',
    color: 'from-orange-500 to-amber-500',
  },
];

const Landing: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Hero parallax effect
    if (heroRef.current) {
      gsap.to(heroRef.current.querySelector('.hero-content'), {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 100,
        opacity: 0.3,
      });

      // Hero title word animation
      const heroTitle = heroRef.current.querySelector('.hero-title');
      if (heroTitle) {
        const words = heroTitle.querySelectorAll('.word');
        gsap.from(words, {
          scrollTrigger: {
            trigger: heroTitle,
            start: 'top 80%',
          },
          y: 100,
          opacity: 0,
          rotateX: -90,
          stagger: 0.1,
          duration: 1,
          ease: 'back.out(1.7)',
        });
      }
    }

    // Stats section animations
    if (statsRef.current) {
      // Stats counter animation
      const stats = statsRef.current.querySelectorAll('.stat-number');
      stats.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target') || '0');
        gsap.from(stat, {
          scrollTrigger: {
            trigger: stat,
            start: 'top 80%',
          },
          textContent: 0,
          duration: 2,
          ease: 'power1.out',
          snap: { textContent: 1 },
          scale: 0.5,
          opacity: 0,
          onUpdate: function() {
            const currentValue = Math.ceil(parseFloat(this.targets()[0].textContent as string));
            stat.textContent = currentValue.toString();
          }
        });
      });

      // Stats card pop in
      const statCards = statsRef.current.querySelectorAll('.stat-card');
      gsap.from(statCards, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 70%',
        },
        scale: 0.5,
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    }

    // Features section title animation
    if (featuresRef.current) {
      const featuresTitle = featuresRef.current.querySelector('.features-title');
      if (featuresTitle) {
        gsap.from(featuresTitle, {
          scrollTrigger: {
            trigger: featuresTitle,
            start: 'top 80%',
          },
          scale: 0.8,
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'elastic.out(1, 0.75)',
        });
      }

      const featuresSubtitle = featuresRef.current.querySelector('.features-subtitle');
      if (featuresSubtitle) {
        gsap.from(featuresSubtitle, {
          scrollTrigger: {
            trigger: featuresSubtitle,
            start: 'top 80%',
          },
          x: -100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      }
    }

    // Feature cards stagger animation with rotation
    if (featureCardsRef.current.length > 0) {
      gsap.from(featureCardsRef.current, {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 50%',
        },
        y: 100,
        opacity: 0,
        rotation: -5,
        stagger: 0.12,
        duration: 0.8,
        ease: 'back.out(1.4)',
      });

      // Feature card icons pop
      featureCardsRef.current.forEach((card, index) => {
        const icon = card.querySelector('.feature-icon');
        if (icon) {
          gsap.from(icon, {
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
            },
            scale: 0,
            rotation: 180,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'back.out(2)',
          });
        }

        // Hover animations for feature cards
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      });
    }

    // CTA section animations
    if (ctaRef.current) {
      // CTA container
      gsap.from(ctaRef.current, {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 70%',
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.4)',
      });

      // CTA title words
      const ctaTitle = ctaRef.current.querySelector('.cta-title');
      if (ctaTitle) {
        const words = ctaTitle.querySelectorAll('.word');
        gsap.from(words, {
          scrollTrigger: {
            trigger: ctaTitle,
            start: 'top 80%',
          },
          y: 50,
          opacity: 0,
          rotateY: 90,
          stagger: 0.08,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });
      }

      // CTA button
      const ctaButton = ctaRef.current.querySelector('.cta-button');
      if (ctaButton) {
        gsap.from(ctaButton, {
          scrollTrigger: {
            trigger: ctaButton,
            start: 'top 85%',
          },
          scale: 0,
          rotation: 360,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
        });
      }
    }

    // Floating animation for hero badge
    gsap.to('.hero-badge', {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoading]);

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-glow-sm">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-xl text-foreground">Linkzzzz</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => openAuth('signin')}
              className="text-foreground hover:text-primary"
            >
              Sign In
            </Button>
            <Button
              onClick={() => openAuth('signup')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        <BackgroundRippleEffect />
        
        <div className="hero-content relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">100% Free Forever</span>
            </motion.div>

            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight">
              <span className="word inline-block">Your</span>{' '}
              <span className="word inline-block">Personal</span>{' '}
              <span className="word text-gradient-primary inline-block">Second</span>{' '}
              <span className="word text-gradient-primary inline-block">Brain</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Save links, notes, and images — organized, searchable, and always yours.
              No more messy bookmarks. No more forgotten notes. Just one brain for your digital life.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => openAuth('signup')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-8 py-6 text-lg font-semibold rounded-xl transform hover:scale-105 transition-transform"
              >
                Get Started — It's Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openAuth('signin')}
                className="border-border text-foreground hover:bg-accent px-8 py-6 text-lg rounded-xl transform hover:scale-105 transition-transform"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-b from-background to-background/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="stat-card text-center p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
              <div className="stat-number text-5xl md:text-6xl font-bold text-gradient-primary mb-2" data-target="10000">0</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">Active Users</div>
            </div>
            <div className="stat-card text-center p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
              <div className="stat-number text-5xl md:text-6xl font-bold text-gradient-primary mb-2" data-target="50000">0</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">Links Saved</div>
            </div>
            <div className="stat-card text-center p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
              <div className="stat-number text-5xl md:text-6xl font-bold text-gradient-primary mb-2" data-target="99">0</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">% Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Animation Section */}
      <ScrollAnimation />

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-gradient-to-b from-background to-surface-sunken relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="text-sm font-medium text-primary">Powerful Features</span>
            </motion.div>
            <h2 className="features-title text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Everything You Need
            </h2>
            <p className="features-subtitle text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A smart personal organizer that helps you save, categorize, and instantly find
              everything you care about on the internet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  ref={(el) => {
                    if (el) featureCardsRef.current[index] = el;
                  }}
                  className="group relative"
                >
                  <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 card-glow relative overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    <div className={`feature-icon w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 relative z-10">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed relative z-10">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div
            ref={ctaRef}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-sm font-medium text-primary">Join Today</span>
            </div>
            <h2 className="cta-title text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              <span className="word inline-block">Ready</span>{' '}
              <span className="word inline-block">to</span>{' '}
              <span className="word inline-block">Organize</span>{' '}
              <span className="word inline-block">Your</span>{' '}
              <span className="word inline-block">Digital</span>{' '}
              <span className="word inline-block">Life?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of people who've already simplified their digital workflow.
              Start for free, no credit card required.
            </p>
            <Button
              size="lg"
              onClick={() => openAuth('signup')}
              className="cta-button bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-12 py-7 text-xl font-semibold rounded-xl transform hover:scale-105 transition-transform"
            >
              Start Organizing Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-surface-sunken">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                <span className="text-primary-foreground font-bold">L</span>
              </div>
              <span className="font-bold text-lg text-foreground">Linkzzzz</span>
            </div>
            <p className="text-muted-foreground text-sm">
              ©Linkzzzz 2026 · Built with care for your digital life
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default Landing;