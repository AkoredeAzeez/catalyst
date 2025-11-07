'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, CreditCard, Users, BarChart, Camera } from 'lucide-react'

export default function AdminSidebar() {
  return (
    // md: icon-only collapsed width, lg: expanded with labels
    <aside className="hidden md:block md:w-16 lg:w-56">
      <div className="rounded-md bg-surface/50 p-2 lg:p-3 h-full">
        <nav className="flex flex-col items-start lg:items-stretch gap-1">
          <SidebarLink href="/dashboard/admin" icon={Home}>Overview</SidebarLink>
          <SidebarLink href="/tickets" icon={FileText}>Tickets</SidebarLink>
          <SidebarLink href="/payments" icon={CreditCard}>Payments</SidebarLink>
          <SidebarLink href="/dashboard/admin/properties" icon={BarChart}>Properties</SidebarLink>
          <SidebarLink href="/dashboard/admin/tenants" icon={Users}>Tenants</SidebarLink>
          <SidebarLink href="/dashboard/admin/tour-builder" icon={Camera}>Tour Builder</SidebarLink>
          <SidebarLink href="/dashboard/admin/reports" icon={FileText}>Reports</SidebarLink>
        </nav>
      </div>
    </aside>
  )
}

function SidebarLink({ href, children, icon: Icon }) {
  const pathname = usePathname()
  const isActive = pathname?.startsWith(href)

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`group flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm transition-colors ${
        isActive ? 'bg-primary/10 text-primary font-medium' : 'text-text hover:bg-muted/60'
      }`}
    >
  <Icon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-text" />
      {/* labels hidden on md (collapsed) and visible on lg */}
      <span className="hidden lg:inline">{children}</span>
    </Link>
  )
}
