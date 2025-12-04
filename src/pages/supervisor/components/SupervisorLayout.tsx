import { ReactNode } from "react";
import { SupervisorSidebar } from "./SupervisorSidebar";

interface SupervisorLayoutProps {
  children: ReactNode;
}

export function SupervisorLayout({ children }: SupervisorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SupervisorSidebar />
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
}
