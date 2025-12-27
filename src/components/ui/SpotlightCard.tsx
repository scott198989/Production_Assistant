import { ReactNode, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color?: "blue" | "green" | "purple" | "orange" | "cyan" | "pink" | "red" | "yellow";
  delay?: number;
}

const colorClasses = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "rgba(59, 130, 246, 0.3)",
    gradient: "from-blue-500/20 to-blue-600/20",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
    glow: "rgba(34, 197, 94, 0.3)",
    gradient: "from-green-500/20 to-green-600/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    glow: "rgba(168, 85, 247, 0.3)",
    gradient: "from-purple-500/20 to-purple-600/20",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    glow: "rgba(249, 115, 22, 0.3)",
    gradient: "from-orange-500/20 to-orange-600/20",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    glow: "rgba(6, 182, 212, 0.3)",
    gradient: "from-cyan-500/20 to-cyan-600/20",
  },
  pink: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-400",
    glow: "rgba(236, 72, 153, 0.3)",
    gradient: "from-pink-500/20 to-pink-600/20",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    glow: "rgba(239, 68, 68, 0.3)",
    gradient: "from-red-500/20 to-red-600/20",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
    glow: "rgba(234, 179, 8, 0.3)",
    gradient: "from-yellow-500/20 to-yellow-600/20",
  },
};

export function SpotlightCard({
  title,
  description,
  icon,
  href,
  color = "blue",
  delay = 0,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link to={href}>
        <div
          ref={divRef}
          onMouseMove={handleMouseMove}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "group relative overflow-hidden rounded-xl p-5",
            "border backdrop-blur-sm",
            "transition-all duration-300",
            "hover:scale-[1.02] hover:shadow-xl",
            colors.bg,
            colors.border
          )}
        >
          {/* Spotlight effect */}
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
            style={{
              opacity,
              background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${colors.glow}, transparent 40%)`,
            }}
          />

          {/* Gradient overlay on hover */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
              `bg-gradient-to-br ${colors.gradient}`
            )}
          />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              className={cn("mb-3", colors.text)}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {icon}
            </motion.div>
            <h4 className="font-semibold text-slate-100 transition-colors group-hover:text-white">
              {title}
            </h4>
            <p className="mt-1 text-sm text-slate-400 transition-colors group-hover:text-slate-300">
              {description}
            </p>
          </div>

          {/* Border beam effect */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div
              className={cn(
                "absolute h-[2px] w-1/3 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                "bg-gradient-to-r from-transparent via-white/50 to-transparent",
                "animate-border-beam"
              )}
              style={{ top: 0 }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default SpotlightCard;
