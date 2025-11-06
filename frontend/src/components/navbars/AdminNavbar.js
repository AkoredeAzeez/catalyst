'use client'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold">C</div>
            <span className="font-semibold text-lg text-text">Catalyst Admin</span>
          </Link>
        </div>

        <div className="flex-1 px-4 hidden sm:block">
          <div className="max-w-md">
            <input aria-label="Search" placeholder="Search properties, tenants, tickets..." className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm">Buy</Button>
            <Button variant="ghost" size="sm">Sell</Button>
          </nav>

          <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="h-5 w-5" /></Button>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-200" />
            <div className="hidden sm:block text-sm">A. Oyin</div>
          </div>
        </div>
      </div>
    </header>
  )
}
