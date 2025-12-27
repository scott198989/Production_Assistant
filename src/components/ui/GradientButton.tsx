import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "glow";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function GradientButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  className,
  disabled,
  onClick,
  type = "button",
}: GradientButtonProps) {
  const baseClasses = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium",
    "transition-all duration-300 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  );

  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  const variantClasses = {
    primary: cn(
      "bg-gradient-to-r from-primary to-blue-500",
      "text-white shadow-lg shadow-primary/25",
      "hover:shadow-xl hover:shadow-primary/30",
      "hover:from-primary-hover hover:to-blue-400",
      "focus:ring-primary"
    ),
    secondary: cn(
      "bg-slate-800 border border-slate-700",
      "text-slate-200",
      "hover:bg-slate-700 hover:border-slate-600",
      "focus:ring-slate-500"
    ),
    ghost: cn(
      "bg-transparent",
      "text-slate-400 hover:text-slate-200",
      "hover:bg-slate-800",
      "focus:ring-slate-500"
    ),
    glow: cn(
      "bg-gradient-to-r from-primary via-purple-500 to-pink-500",
      "text-white",
      "shadow-lg shadow-primary/30",
      "hover:shadow-xl hover:shadow-purple-500/40",
      "animate-gradient-x bg-[length:200%_auto]",
      "focus:ring-purple-500"
    ),
  };

  return (
    <motion.button
      type={type}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Shimmer effect for glow variant */}
      {variant === "glow" && (
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer" />
        </div>
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <motion.div
            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          icon
        )}
        {children}
      </span>
    </motion.button>
  );
}

// Floating action button variant
interface FABProps {
  icon: ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export function FloatingActionButton({ icon, label, className, onClick }: FABProps) {
  return (
    <motion.button
      type="button"
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "flex h-14 w-14 items-center justify-center rounded-full",
        "bg-gradient-to-r from-primary to-blue-500",
        "text-white shadow-lg shadow-primary/30",
        "hover:shadow-xl hover:shadow-primary/40",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900",
        "transition-all duration-300",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
      {label && <span className="sr-only">{label}</span>}
    </motion.button>
  );
}

export default GradientButton;
