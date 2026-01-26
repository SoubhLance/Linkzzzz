import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link2, FileText, Image, Star, FolderOpen, ArrowRight, Sparkles, Zap, TrendingUp, Users, Shield, Clock, CheckCircle, ChevronRight, Globe, Rocket, Target } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: Link2,
    title: "Smart Links",
    description: "Intelligent link organization",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: FileText,
    title: "Notes",
    description: "Capture and organize ideas",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Image,
    title: "Images",
    description: "Store and tag visual content",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    icon: Star,
    title: "Starred",
    description: "Priority content system",
    color: "text-star",
    bgColor: "bg-star/10",
  },
  {
    icon: FolderOpen,
    title: "Categories",
    description: "Flexible organization",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
];

const stats = [
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Links Saved", value: "10M+", icon: TrendingUp },
  { label: "Uptime", value: "99.9%", icon: Shield },
  { label: "Save Time", value: "10hrs/week", icon: Clock },
];

const testimonials = [
  {
    quote: "Linkzzz transformed how I organize my digital life. The intuitive features are amazing!",
    author: "Sarah Chen",
    role: "Product Manager @ TechCorp",
  },
  {
    quote: "From chaotic bookmarks to a structured second brain. Game changer!",
    author: "Marcus Johnson",
    role: "Developer @ StartupXYZ",
  },
  {
    quote: "The organization features save me hours every week. Essential tool.",
    author: "Elena Rodriguez",
    role: "Researcher @ University",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothedPosition, setSmoothedPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const animationRef = useRef<number>();
  const lastMouseMoveTime = useRef<number>(Date.now());
  const isMobile = useRef(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  // Smooth interpolation for mouse position
  const lerp = (start: number, end: number, factor: number) => {
    return start * (1 - factor) + end * factor;
  };

  useEffect(() => {
    // Check if mobile
    isMobile.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile.current) {
      return; // Disable on mobile
    }

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      lastMouseMoveTime.current = now;

      // Set timer to detect when mouse stops
      setTimeout(() => {
        if (Date.now() - lastMouseMoveTime.current > 100) {
          setIsMoving(false);
        }
      }, 100);
    };

    // Animation loop for smooth interpolation
    const animate = () => {
      setSmoothedPosition(prev => ({
        x: lerp(prev.x, mousePosition.x, 0.08),
        y: lerp(prev.y, mousePosition.y, 0.08),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Subtle Orange Glow Effect */}
      {!isMobile.current && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
          style={{
            opacity: isMoving ? 0.04 : 0.02,
            background: `radial-gradient(600px at ${smoothedPosition.x}px ${smoothedPosition.y}px, 
              rgba(var(--primary-rgb), 0.1) 0%, 
              transparent 80%)`,
            transition: 'opacity 0.7s ease-out',
          }}
        />
      )}

      {/* Existing background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{
            animationDelay: '1s',
          }}
        />
        <div 
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse"
          style={{
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Header */}
      <header className="w-full py-6 px-6 sm:px-12 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Link to="/features">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300">
                Features
              </Button>
            </Link>
            {!loading && (
              <Link to="/auth">
                <Button 
                  variant="default" 
                  className="relative overflow-hidden group bg-primary hover:bg-primary-glow text-primary-foreground px-6"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Sign In
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24 relative z-40">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-bounce-slow">
            <Rocket className="w-4 h-4" />
            Join 50,000+ productive individuals
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight tracking-tighter">
            Your Personal{" "}
            <span className="text-primary relative">
              Second Brain
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 transform -rotate-1" />
            </span>{" "}
            for the Digital Age
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Linkzzz is the ultimate platform that helps professionals collect, 
            organize, and retrieve knowledge with{" "}
            <span className="text-primary font-semibold">intuitive organization</span>. 
            Transform chaos into clarity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/auth" className="group">
              <Button 
                size="lg" 
                className="gap-3 px-8 py-7 text-base font-semibold bg-primary hover:bg-primary-glow text-primary-foreground relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              Enterprise-grade security
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-500" />
              Global infrastructure
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 sm:mt-28 w-full max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed to make your workflow smarter and more efficient
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 animate-float group"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationDuration: `${3 + index * 0.5}s`,
                }}
              >
                <div className={`p-4 rounded-2xl ${feature.bgColor} mb-5 transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
              <div 
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30 hover:bg-card/50 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-32 w-full max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our users are saying about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-foreground/80 mb-4 italic">"{testimonial.quote}"</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-32 w-full max-w-4xl mx-auto text-center p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
          
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Organize Your Digital Life?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their workflow with Linkzzz
          </p>
          <Link to="/auth">
            <Button 
              size="lg" 
              className="gap-3 px-10 py-8 text-lg font-bold bg-primary hover:bg-primary-glow text-primary-foreground relative overflow-hidden group"
            >
              <Zap className="w-5 h-5" />
              Get Started Free Today
              <Target className="w-5 h-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 24/7 support
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50 relative z-40 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size="md" />
              <p className="text-muted-foreground mt-4">
                Your second brain for the digital age.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/integrations" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link to="/security" className="text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Linkzzz. Your personal second brain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;