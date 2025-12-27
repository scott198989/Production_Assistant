import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Animated gradient orbs in background
export function GradientOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Primary orb */}
      <motion.div
        className={cn(
          "absolute -left-40 -top-40 h-80 w-80 rounded-full",
          "bg-gradient-radial from-primary/20 via-primary/5 to-transparent",
          "blur-3xl"
        )}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary orb */}
      <motion.div
        className={cn(
          "absolute -bottom-40 -right-40 h-96 w-96 rounded-full",
          "bg-gradient-radial from-purple-500/15 via-purple-500/5 to-transparent",
          "blur-3xl"
        )}
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Accent orb */}
      <motion.div
        className={cn(
          "absolute left-1/2 top-1/3 h-64 w-64 rounded-full",
          "bg-gradient-radial from-cyan-500/10 via-cyan-500/5 to-transparent",
          "blur-3xl"
        )}
        animate={{
          x: [0, 40, 0],
          y: [0, -40, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}

// Animated grid pattern
export function GridPattern() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        className={cn(
          "absolute inset-0",
          "bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]",
          "bg-[size:4rem_4rem]",
          "[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        )}
      />
    </div>
  );
}

// Noise texture overlay
export function NoiseTexture() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Dot pattern
export function DotPattern({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0",
        "bg-[radial-gradient(#334155_1px,transparent_1px)]",
        "bg-[size:24px_24px]",
        "opacity-50",
        className
      )}
    />
  );
}

// Meteor effect
interface MeteorProps {
  number?: number;
}

export function Meteors({ number = 20 }: MeteorProps) {
  const meteors = [...Array(number)].map((_, idx) => ({
    id: idx,
    delay: Math.random() * 5,
    duration: Math.random() * 2 + 2,
    left: Math.random() * 100,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {meteors.map((meteor) => (
        <motion.span
          key={meteor.id}
          className={cn(
            "absolute h-0.5 w-0.5 rotate-[215deg] rounded-full bg-slate-400",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px]",
            "before:-translate-y-1/2 before:bg-gradient-to-r",
            "before:from-primary/50 before:to-transparent"
          )}
          style={{
            top: -40,
            left: `${meteor.left}%`,
          }}
          animate={{
            top: "100%",
            left: `${meteor.left + 10}%`,
          }}
          transition={{
            duration: meteor.duration,
            repeat: Infinity,
            delay: meteor.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Combine all background effects
export function BackgroundEffects({ variant = "default" }: { variant?: "default" | "minimal" | "intense" }) {
  if (variant === "minimal") {
    return <GridPattern />;
  }

  if (variant === "intense") {
    return (
      <>
        <GradientOrbs />
        <GridPattern />
        <Meteors number={10} />
      </>
    );
  }

  return (
    <>
      <GradientOrbs />
      <GridPattern />
    </>
  );
}

export default BackgroundEffects;
