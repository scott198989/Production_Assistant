import { ReactNode, useState, useEffect } from "react";

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
      className={`flex-1 overflow-y-auto bg-slate-900 p-4 md:p-6 ${
        isMobile ? "pt-[calc(3.5rem+1rem)] pb-[calc(4rem+1rem)]" : ""
      }`}
    >
      {children}
    </main>
  );
}

export default MainPanel;
