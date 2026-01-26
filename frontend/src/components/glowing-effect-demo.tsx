import { GlowingEffect } from "@/components/ui/glowing-effect";

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlowingCard = ({ children, className, glow = false }: GlowingCardProps) => {
  return (
    <div className={`relative ${className}`}>
      <GlowingEffect
        spread={40}
        glow={glow}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      {children}
    </div>
  );
};

export const GlowingEffectDemo = () => {
  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-6 text-foreground">Glowing Effect Demo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlowingCard className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-medium text-foreground mb-2">Default Glow</h3>
          <p className="text-sm text-muted-foreground">
            Hover over this card to see the glowing effect follow your cursor.
          </p>
        </GlowingCard>

        <GlowingCard glow className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-medium text-foreground mb-2">Active Glow</h3>
          <p className="text-sm text-muted-foreground">
            This card has an active pulsing glow effect enabled.
          </p>
        </GlowingCard>

        <GlowingCard className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-medium text-foreground mb-2">Hover Effect</h3>
          <p className="text-sm text-muted-foreground">
            The glow follows your mouse movement naturally.
          </p>
        </GlowingCard>
      </div>
    </div>
  );
};

export default GlowingEffectDemo;
