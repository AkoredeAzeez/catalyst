'use client'
import RoleGuard from '@/components/RoleGuard'
import DashboardShell from '@/components/dashboard/DashboardShell'
import AgentSidebar from '@/components/sidebars/AgentSidebar'
import PropertyBank from '@/components/dashboard/agent/PropertyBank'

export default function AgentPage() {
  return (
    <RoleGuard allowed={['agent', 'admin']}>
      <DashboardShell>
        <PropertyBank />
      </DashboardShell>
    </RoleGuard>
  )
}
