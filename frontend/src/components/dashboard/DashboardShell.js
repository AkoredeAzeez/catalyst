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
    <div className="min-h-screen bg-white text-text">
      <Navbar />
      <div className="w-full px-6 py-4">
        {/* Two column layout: main content and right sidebar */}
        <div className={`grid grid-cols-1 gap-6 ${rightSidebar ? 'lg:grid-cols-[1fr_380px]' : 'lg:grid-cols-1'}`}>
          <main className="min-h-0">
            {children}
          </main>

          {rightSidebar && (
            <aside className="hidden lg:block">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
