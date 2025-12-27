import { ReactNode } from "react";

interface MainPanelProps {
  children: ReactNode;
}

export function MainPanel({ children }: MainPanelProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-slate-900 p-6">{children}</main>
  );
}

export default MainPanel;
