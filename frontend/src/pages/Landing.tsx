import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link, Brain, FileText, Image, Zap, Search, Shield, Cloud,
  Star, ArrowRight, Play, Menu, X, Sparkles, Globe, Layers,
  CheckCircle2, MousePointerClick, FolderSearch, ChevronRight,
} from 'lucide-react';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import ScrollAnimation from '@/components/ScrollAnimation';
import AuthModal from '@/components/AuthModal';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────── Data ─────────────────────── */

const features = [
  {
    icon: Link,
    title: 'Save Links',
    description: 'Capture any URL with a click. Never lose an important article or resource again.',
    bullets: ['One-click save', 'Auto metadata', 'Rich previews'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileText,
    title: 'Quick Notes',
    description: 'Jot down thoughts and snippets instantly. Your ideas, always within reach.',
    bullets: ['Markdown support', 'Instant capture', 'Full-text search'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Image,
    title: 'Image Library',
    description: 'Store and organize images. Visual inspiration at your fingertips.',
    bullets: ['Drag & drop', 'Gallery view', 'Auto tagging'],
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Search,
    title: 'Instant Search',
    description: 'Find anything in seconds. Powerful search across all your saved content.',
    bullets: ['Fuzzy matching', 'Filter by type', 'Keyboard first'],
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Zap,
    title: 'Smart Categories',
    description: 'Auto-organize with intelligent tagging. Less effort, more structure.',
    bullets: ['AI tagging', 'Custom folders', 'Nested categories'],
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Cloud,
    title: 'Always Synced',
    description: 'Access from anywhere. Your data follows you across all devices.',
    bullets: ['Real-time sync', 'Offline mode', 'Cross-platform'],
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your data stays yours. End-to-end privacy, no compromises.',
    bullets: ['Encrypted', 'No tracking', 'GDPR ready'],
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'Your Second Brain',
    description: 'Build your personal knowledge base. Connect ideas like never before.',
    bullets: ['Bi-directional links', 'Knowledge graph', 'Smart recall'],
    color: 'from-orange-500 to-amber-500',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    avatar: 'SC',
    quote: 'Linkzzzz replaced 5 different apps for me. Everything I need in one beautiful place.',
    rating: 5,
  },
  {
    name: 'Alex Rivera',
    role: 'Software Engineer',
    avatar: 'AR',
    quote: 'The instant search is incredible. I find things faster than I save them.',
    rating: 5,
  },
  {
    name: 'Maya Patel',
    role: 'Content Creator',
    avatar: 'MP',
    quote: 'Finally, a tool that thinks the way I do. Smart categories are game-changing.',
    rating: 5,
  },
];

const howItWorksSteps = [
  {
    icon: MousePointerClick,
    title: 'Save Anything',
    description: 'Clip links, write notes, or drop images — it all goes into your brain in one click.',
    step: '01',
  },
  {
    icon: Layers,
    title: 'Auto Organize',
    description: 'Smart categories and tags sort everything automatically. Zero manual effort.',
    step: '02',
  },
  {
    icon: FolderSearch,
    title: 'Find Instantly',
    description: 'Powerful search finds anything across all your content in milliseconds.',
    step: '03',
  },
];

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

/* ─────────────────────── Component ─────────────────────── */

const Landing: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  /* ── Loading ── */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  /* ── Scroll Detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── GSAP Animations ── */
  useEffect(() => {
    if (isLoading) return;

    // Hero parallax
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

      const heroTitle = heroRef.current.querySelector('.hero-title');
      if (heroTitle) {
        const words = heroTitle.querySelectorAll('.word');
        gsap.from(words, {
          scrollTrigger: { trigger: heroTitle, start: 'top 80%' },
          y: 80,
          opacity: 0,
          rotateX: -90,
          stagger: 0.08,
          duration: 0.9,
          ease: 'back.out(1.7)',
        });
      }
    }

    // Stats counter
    if (statsRef.current) {
      const stats = statsRef.current.querySelectorAll('.stat-number');
      stats.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target') || '0');
        gsap.from(stat, {
          scrollTrigger: { trigger: stat, start: 'top 80%' },
          textContent: 0,
          duration: 2,
          ease: 'power1.out',
          snap: { textContent: 1 },
          scale: 0.5,
          opacity: 0,
          onUpdate: function () {
            const v = Math.ceil(parseFloat(this.targets()[0].textContent as string));
            stat.textContent = v.toString();
          },
        });
      });

      gsap.from(statsRef.current.querySelectorAll('.stat-card'), {
        scrollTrigger: { trigger: statsRef.current, start: 'top 70%' },
        scale: 0.5,
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    }

    // How It Works
    if (howItWorksRef.current) {
      gsap.from(howItWorksRef.current.querySelectorAll('.step-card'), {
        scrollTrigger: { trigger: howItWorksRef.current, start: 'top 65%' },
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.4)',
      });
    }

    // Features
    if (featuresRef.current) {
      const title = featuresRef.current.querySelector('.features-title');
      if (title) {
        gsap.from(title, {
          scrollTrigger: { trigger: title, start: 'top 80%' },
          scale: 0.8,
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'elastic.out(1, 0.75)',
        });
      }
    }

    if (featureCardsRef.current.length > 0) {
      gsap.from(featureCardsRef.current, {
        scrollTrigger: { trigger: featuresRef.current, start: 'top 50%' },
        y: 80,
        opacity: 0,
        rotation: -3,
        stagger: 0.1,
        duration: 0.7,
        ease: 'back.out(1.4)',
      });
    }

    // Product Preview
    if (previewRef.current) {
      gsap.from(previewRef.current.querySelector('.preview-window'), {
        scrollTrigger: { trigger: previewRef.current, start: 'top 70%' },
        y: 100,
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        ease: 'power3.out',
      });
    }

    // CTA
    if (ctaRef.current) {
      gsap.from(ctaRef.current, {
        scrollTrigger: { trigger: ctaRef.current, start: 'top 70%' },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.4)',
      });
      const ctaTitle = ctaRef.current.querySelector('.cta-title');
      if (ctaTitle) {
        gsap.from(ctaTitle.querySelectorAll('.word'), {
          scrollTrigger: { trigger: ctaTitle, start: 'top 80%' },
          y: 50,
          opacity: 0,
          rotateY: 90,
          stagger: 0.08,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });
      }
    }

    // Hero badge float
    gsap.to('.hero-badge', {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isLoading]);

  /* ── Helpers ── */
  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
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

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-glow-sm">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">Linkzzzz</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="link-underline text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => openAuth('signin')}
              className="text-foreground hover:text-primary text-sm"
            >
              Sign In
            </Button>
            <Button
              onClick={() => openAuth('signup')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm text-sm px-5"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="text-left text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t border-border/30">
                  <Button variant="outline" onClick={() => { openAuth('signin'); setMobileMenuOpen(false); }} className="w-full">
                    Sign In
                  </Button>
                  <Button onClick={() => { openAuth('signup'); setMobileMenuOpen(false); }} className="w-full bg-primary text-primary-foreground">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        <BackgroundRippleEffect />

        {/* Gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] animate-float" />
          <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-orange-600/8 blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
        </div>

        <div className="hero-content relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">100% Free Forever</span>
            </motion.div>

            {/* Headline */}
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
              <span className="word inline-block">Your</span>{' '}
              <span className="word inline-block">Personal</span>
              <br className="hidden sm:block" />
              <span className="word text-gradient-primary inline-block">Second</span>{' '}
              <span className="word text-gradient-primary inline-block">Brain</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Save links, notes, and images — organized, searchable, and always yours.
              No more messy bookmarks. Just one brain for your digital life.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                onClick={() => openAuth('signup')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-8 py-6 text-lg font-semibold rounded-xl group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started — It's Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/50 text-foreground hover:bg-accent/50 px-8 py-6 text-lg rounded-xl group"
              >
                <Play className="w-5 h-5 mr-2 text-primary" />
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              {/* Avatar stack */}
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'].map((color, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: color, zIndex: 5 - i }}
                    >
                      {['S', 'A', 'M', 'J', 'K'][i]}
                    </div>
                  ))}
                </div>
                <span className="ml-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">10,000+</span> people trust Linkzzzz
                </span>
              </div>

              <div className="hidden sm:block w-px h-8 bg-border/50" />

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-medium">4.9/5</span>
              </div>
            </motion.div>
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

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section ref={statsRef} className="py-20 bg-gradient-to-b from-background to-background/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { target: '10000', label: 'Active Users', suffix: '+' },
              { target: '50000', label: 'Links Saved', suffix: '+' },
              { target: '99', label: '% Uptime', suffix: '.9' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card text-center p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:border-primary/20 transition-all duration-300">
                <div className="flex items-baseline justify-center gap-1">
                  <div className="stat-number text-5xl md:text-6xl font-bold text-gradient-primary" data-target={stat.target}>0</div>
                  <span className="text-2xl font-bold text-gradient-primary">{stat.suffix}</span>
                </div>
                <div className="text-muted-foreground text-sm uppercase tracking-wider mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SOCIAL PROOF ═══════════════════ */}
      <section id="testimonials" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Loved by Creators</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              What People Are Saying
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands who've simplified their digital workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative"
              >
                <div className="h-full p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-orange-600/5 transition-all duration-500" />

                  <div className="relative z-10">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-5">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-foreground/90 leading-relaxed mb-6 text-[15px]">
                      "{t.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-sm font-bold text-white">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SCROLL ANIMATION ═══════════════════ */}
      <ScrollAnimation />

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section id="how-it-works" ref={howItWorksRef} className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Simple Workflow</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Three steps to organize your entire digital life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {howItWorksSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="step-card text-center relative">
                  {/* Step number */}
                  <div className="relative mx-auto mb-6">
                    <div className="w-[120px] h-[120px] mx-auto rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 flex items-center justify-center group hover:border-primary/30 transition-all duration-300 hover:shadow-glow-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-orange-600/5 transition-all duration-300" />
                      <Icon className="w-10 h-10 text-primary relative z-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px] max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section id="features" ref={featuresRef} className="py-24 bg-gradient-to-b from-background to-surface-sunken relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powerful Features</span>
            </motion.div>
            <h2 className="features-title text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A smart personal organizer that helps you save, categorize, and instantly find
              everything you care about.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
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
                  <div className="h-full p-7 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                    {/* Hover gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
                    {/* Hover glow border effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ boxShadow: '0 0 30px hsl(24, 100%, 50% / 0.1) inset' }} />

                    <div className={`feature-icon w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 relative z-10">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 relative z-10">
                      {feature.description}
                    </p>
                    {/* Bullet points */}
                    <ul className="space-y-1.5 relative z-10">
                      {feature.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRODUCT PREVIEW ═══════════════════ */}
      <section ref={previewRef} className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Product Preview</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              See It In Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A clean, minimal dashboard designed for maximum productivity.
            </p>
          </motion.div>

          {/* Dashboard mockup */}
          <div className="preview-window max-w-5xl mx-auto rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden shadow-elevated">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/50 bg-card/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-lg bg-secondary/50 text-xs text-muted-foreground flex items-center gap-2">
                  <Search className="w-3 h-3" /> Search your brain...
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Your Library</h3>
                  <p className="text-sm text-muted-foreground">23 items saved</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">All</div>
                  <div className="px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground text-xs font-medium">Links</div>
                  <div className="px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground text-xs font-medium">Notes</div>
                  <div className="px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground text-xs font-medium">Images</div>
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Link card */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/20 transition-colors">
                  <div className="w-full h-28 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-3">
                    <Link className="w-8 h-8 text-blue-500/50" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Design Systems Guide</p>
                  <p className="text-xs text-muted-foreground">medium.com</p>
                </div>
                {/* Note card */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/20 transition-colors">
                  <div className="w-full h-28 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-3 mb-3">
                    <div className="space-y-1.5">
                      <div className="h-2 w-3/4 rounded bg-green-500/15" />
                      <div className="h-2 w-full rounded bg-green-500/10" />
                      <div className="h-2 w-5/6 rounded bg-green-500/10" />
                      <div className="h-2 w-2/3 rounded bg-green-500/10" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Project Ideas</p>
                  <p className="text-xs text-muted-foreground">Updated 2h ago</p>
                </div>
                {/* Image card */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/20 transition-colors">
                  <div className="w-full h-28 rounded-lg bg-gradient-to-br from-pink-500/10 to-rose-500/10 flex items-center justify-center mb-3">
                    <Image className="w-8 h-8 text-pink-500/50" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">UI Inspiration</p>
                  <p className="text-xs text-muted-foreground">12 images</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div ref={ctaRef} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Join Today</span>
            </div>
            <h2 className="cta-title text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              <span className="word inline-block">Ready</span>{' '}
              <span className="word inline-block">to</span>{' '}
              <span className="word inline-block">Organize</span>{' '}
              <span className="word inline-block">Your</span>
              <br className="hidden sm:block" />
              <span className="word text-gradient-primary inline-block">Digital</span>{' '}
              <span className="word text-gradient-primary inline-block">Life?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of people who've already simplified their workflow.
              Start for free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => openAuth('signup')}
                className="cta-button bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-10 py-7 text-xl font-semibold rounded-xl group"
              >
                Start Organizing Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openAuth('signin')}
                className="border-border/50 text-foreground hover:bg-accent/50 px-8 py-7 text-lg rounded-xl"
              >
                Sign In
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="py-16 border-t border-border/50 bg-surface-sunken">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl text-foreground tracking-tight">Linkzzzz</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your personal second brain. Save, organize, and find everything instantly.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-3">
                {['Features', 'How It Works', 'Pricing', 'Changelog'].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © Linkzzzz 2026 · Built with care for your digital life
            </p>
            <div className="flex items-center gap-4">
              {/* Social icons */}
              <button className="w-9 h-9 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>
              <button className="w-9 h-9 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════ AUTH MODAL ═══════════════════ */}
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