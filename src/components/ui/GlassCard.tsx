import { ReactNode, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: string;
  spotlight?: boolean;
}

export function GlassCard({
  children,
  className = "",
  hoverEffect = true,
  glowColor = "rgba(37, 99, 235, 0.15)",
  spotlight = true,
}: GlassCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlightBackground = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      ${glowColor},
      transparent 80%
    )
  `;

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "border border-slate-700/50",
        "bg-slate-800/50 backdrop-blur-xl",
        "shadow-xl shadow-black/10",
        hoverEffect && "transition-all duration-300",
        hoverEffect && "hover:border-slate-600/50 hover:shadow-2xl hover:shadow-primary/5",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={hoverEffect ? { scale: 1.01, y: -2 } : undefined}
    >
      {/* Spotlight effect */}
      {spotlight && isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlightBackground }}
        />
      )}

      {/* Gradient border on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
      </div>

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </motion.div>
  );
}

interface GlassCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function GlassCardHeader({ title, subtitle, icon, action }: GlassCardHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

export function GlassCardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function GlassCardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("border-t border-slate-700/50 bg-slate-900/30 px-6 py-4", className)}>
      {children}
    </div>
  );
}

export default GlassCard;
