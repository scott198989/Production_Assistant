import { ReactNode, useState, useEffect } from "react";
import { DisclaimerFooter } from "../ui/DisclaimerFooter";

interface MainPanelProps {
  children: ReactNode;
}

export function MainPanel({ children }: MainPanelProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <main
      className={`flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 ${
        isMobile ? "pt-[calc(3.5rem+1rem)] pb-[calc(4rem+1rem)]" : ""
      }`}
    >
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-2">
        {children}
      </div>
      <DisclaimerFooter />
    </main>
  );
}

export default MainPanel;
