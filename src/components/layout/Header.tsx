import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { LineSelector } from "../ui/LineSelector";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-700 bg-slate-800 px-6">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>

      {/* Right: Line Selector & Clock */}
      <div className="flex items-center gap-6">
        {/* Line Selector */}
        <LineSelector />

        {/* Clock */}
        <div className="flex items-center gap-3 rounded-lg bg-slate-700/50 px-4 py-2">
          <Clock size={18} className="text-slate-400" />
          <div className="text-right">
            <div className="text-sm font-medium text-slate-100">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-slate-400">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
