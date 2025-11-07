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
    <div className="h-screen bg-white text-text overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden mx-auto py-3">
        {/* Two column layout: main content and right sidebar */}
        <div
          className={`h-full flex gap-0 overflow-hidden ${rightSidebar ? "" : ""}`}
        >
          <main className="min-h-0 overflow-auto flex-shrink-0">
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
