import { Clock, Search, Command } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  const openCommandPalette = () => {
    // Dispatch keyboard event to open command palette
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="relative z-20 flex h-16 items-center justify-between border-b border-slate-700/50 bg-slate-800/80 px-6 backdrop-blur-xl">
      {/* Left: Page Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </motion.div>

      {/* Right: Search, Line Selector & Clock */}
      <div className="flex items-center gap-4">
        {/* Search Button */}
        <motion.button
          onClick={openCommandPalette}
          className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 text-sm text-slate-400 transition-all hover:border-slate-600/50 hover:bg-slate-700/50 hover:text-slate-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search size={14} />
          <span className="hidden md:inline">Search...</span>
          <kbd className="ml-1 hidden items-center gap-0.5 rounded border border-slate-600 bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 md:inline-flex">
            <Command size={10} />K
          </kbd>
        </motion.button>

        {/* Line Selector */}
        <LineSelector />

        {/* Clock */}
        <motion.div
          className="flex items-center gap-3 rounded-lg border border-slate-700/30 bg-slate-800/50 px-4 py-2 backdrop-blur-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Clock size={18} className="text-primary/70" />
          <div className="text-right">
            <div className="text-sm font-medium tabular-nums text-slate-100">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-slate-400">
              {formatDate(currentTime)}
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

export default Header;
