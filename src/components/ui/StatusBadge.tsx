import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { SpecStatus } from "../../types";

interface StatusBadgeProps {
  status: SpecStatus;
  size?: "default" | "large";
  showLabel?: boolean;
  className?: string;
}

const statusConfig = {
  in_spec: {
    label: "IN SPEC",
    icon: CheckCircle,
    bgClass: "bg-success/10",
    textClass: "text-success",
    borderClass: "border-success/30",
  },
  warning: {
    label: "WARNING",
    icon: AlertTriangle,
    bgClass: "bg-warning/10",
    textClass: "text-warning",
    borderClass: "border-warning/30",
  },
  out_of_spec: {
    label: "OUT OF SPEC",
    icon: XCircle,
    bgClass: "bg-danger/10",
    textClass: "text-danger",
    borderClass: "border-danger/30",
  },
};

export function StatusBadge({
  status,
  size = "default",
  showLabel = true,
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses =
    size === "large"
      ? "px-4 py-2.5 text-base gap-2.5"
      : "px-3 py-1.5 text-sm gap-2";

  const iconSize = size === "large" ? 20 : 16;

  return (
    <div
      className={`inline-flex items-center rounded-lg border font-medium ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClasses} ${className}`}
    >
      <Icon size={iconSize} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

export default StatusBadge;
