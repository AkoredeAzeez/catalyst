'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function InvestorHeader() {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">C</div>
          <div>
            <h1 className="text-lg font-semibold">Catalyst</h1>
            <div className="text-xs text-muted-foreground mt-0.5">Project Lacasa Virtual Tour</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm">Home</span>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Project</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button className="bg-green-50 text-green-700 border-transparent hover:bg-green-100" size="md">Buy</Button>
        <Button variant="ghost" size="md">Sell</Button>
      </div>
    </header>
  )
}
