'use client'
import { useAuthStore } from '@/store/auth.store'
import AdminNavbar from '@/components/navbars/AdminNavbar'
import InvestorNavbar from '@/components/navbars/InvestorNavbar'

import AdminSidebar from '@/components/sidebars/AdminSidebar'
import InvestorSidebar from '@/components/sidebars/InvestorSidebar'

export default function DashboardShell({ children, rightSidebar }) {
  const role = useAuthStore((s) => s.role)

  const Navbar = role === 'admin' ? AdminNavbar : role === 'investor' ? InvestorNavbar : InvestorNavbar
  const Sidebar = role === 'admin' ? AdminSidebar : role === 'investor' ? InvestorSidebar : InvestorSidebar

  return (
    <div className="h-screen bg-white text-text overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden px-4 py-3">
        {/* Two column layout: main content and right sidebar */}
        <div className={`h-full grid grid-cols-1 gap-4 overflow-hidden ${rightSidebar ? 'lg:grid-cols-[1fr_280px]' : 'lg:grid-cols-1'}`}>
          <main className="min-h-0 overflow-hidden">
            {children}
          </main>

          {rightSidebar && (
            <aside className="hidden lg:block overflow-y-auto">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
