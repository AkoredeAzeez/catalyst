"use client";
import { useAuthStore } from "@/store/auth.store";
import AdminNavbar from "@/components/navbars/AdminNavbar";
import InvestorNavbar from "@/components/navbars/InvestorNavbar";

import AdminSidebar from "@/components/sidebars/AdminSidebar";
import InvestorSidebar from "@/components/sidebars/InvestorSidebar";

export default function DashboardShell({ children, rightSidebar }) {
  const role = useAuthStore((s) => s.role);

  const Navbar =
    role === "admin"
      ? AdminNavbar
      : role === "investor"
        ? InvestorNavbar
        : InvestorNavbar;
  const Sidebar =
    role === "admin"
      ? AdminSidebar
      : role === "investor"
        ? InvestorSidebar
        : InvestorSidebar;

  return (
    <div className="h-screen bg-white text-text flex flex-col">
      <Navbar />
      <div className="flex-1 p-3 overflow-hidden">
        {/* Two column layout: main content and right sidebar */}
        <div className="h-full flex gap-0">
          <main className="shrink-0 h-full min-h-0 max-h-full w-full min-w-0 max-w-full">
            {children}
          </main>
          {rightSidebar && (
            <aside className="hidden lg:block overflow-y-auto w-[370px] flex-shrink-0 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
