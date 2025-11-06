'use client'
import Image from 'next/image'
import RoleGuard from '@/components/RoleGuard'
import DashboardShell from '@/components/dashboard/DashboardShell'
import PropertiesSidebar from '@/components/sidebars/PropertiesSidebar'
import InvestorSidebar from '@/components/sidebars/InvestorSidebar'
import StatsGrid from '@/components/dashboard/investor/StatsGrid'
import { useInvestorStore } from '@/store/investor.store'

const ROOM_LABELS = ['Exterior View', 'Kitchen', 'Bathroom', 'Bedroom', 'Livingroom']

export default function InvestorPage() {
  const image = useInvestorStore((s) => s.getSelectedImage())
  const selectedIndex = useInvestorStore((s) => s.selectedIndex)
  const currentRoomName = ROOM_LABELS[selectedIndex] || `Room ${selectedIndex + 1}`

  return (
    <RoleGuard allowed={['investor', 'admin']}>
      <DashboardShell rightSidebar={<PropertiesSidebar />}>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0">
          {/* Left sidebar */}
          <div className="min-w-0 pr-4">
            <InvestorSidebar />
          </div>

          {/* Property Image Display - Full bleed, no border */}
          <div className="relative overflow-hidden bg-neutral-100 h-full">
            <Image 
              src={image} 
              alt={`${currentRoomName} view`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 70vw"
            />
            {/* Overlay with current room name - hidden for Exterior View */}
            {selectedIndex !== 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 z-10">
                <h2 className="text-white font-semibold text-lg">{currentRoomName}</h2>
              </div>
            )}
          </div>
        </div>

        {/* Stats grid below */}
        <div className="w-full mt-4 lg:pl-0">
          <StatsGrid />
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}