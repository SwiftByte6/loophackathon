import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background p-4 sm:p-5 gap-4 sm:gap-6 overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto no-scrollbar rounded-3xl pb-10">
        <div className="w-full max-w-7xl mx-auto pt-2">{children}</div>
      </main>
    </div>
  );
}
