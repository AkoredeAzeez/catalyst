'use client'
import { ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="font-semibold">Catalyst Admin</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/tenant" className="text-sm underline-offset-2 hover:underline">Switch to Tenant</Link>
          </div>
        </div>
      </header>
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="space-y-1">
            <SidebarLink href="/dashboard/admin">Overview</SidebarLink>
            <SidebarLink href="/tickets">Tickets</SidebarLink>
            <SidebarLink href="/payments">Payments</SidebarLink>
            <SidebarLink href="/dashboard/admin/properties">Properties</SidebarLink>
            <SidebarLink href="/dashboard/admin/tenants">Tenants</SidebarLink>
            <SidebarLink href="/dashboard/admin/reports">Reports</SidebarLink>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}

function SidebarLink({ href, children }) {
  return (
    <Link href={href} className="block rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
      {children}
    </Link>
  )
}
