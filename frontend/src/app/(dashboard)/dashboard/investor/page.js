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
        <div className="h-full flex flex-col gap-3">
          {/* Top section: Sidebar + Image */}
          <div className="flex gap-3 flex-shrink-0">
            {/* Left sidebar */}
            <div className="min-w-0">
              <InvestorSidebar />
            </div>

            {/* Property Image Display Container */}
            <div className="relative flex flex-col flex-shrink-0">
              {/* 3D view label */}
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center gap-2 text-neutral-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  <span className="text-sm font-medium">3D view</span>
                </div>
              </div>

              {/* Room name label above image */}
              {selectedIndex !== 0 && (
                <div className="mb-1.5 text-center">
                  <h2 className="text-neutral-900 text-sm">{currentRoomName}</h2>
                </div>
              )}
              
              {/* Property Image Display with dimensions increased by 17% */}
              <div 
                className="relative overflow-hidden bg-neutral-100 rounded-2xl"
                style={{
                  width: '645px',
                  height: '455px',
                  transform: 'matrix(-1, 0, 0, 1, 0, 0)'
                }}
              >
                <Image 
                  src={image} 
                  alt={`${currentRoomName} view`}
                  fill
                  className="object-cover"
                  priority
                  sizes="645px"
                  style={{ transform: 'scaleX(-1)' }}
                />
              </div>
            </div>
          </div>

          {/* Stats grid below */}
          <div className="w-full flex-1 min-h-0">
            <StatsGrid />
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}