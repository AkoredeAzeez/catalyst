import RoleGuard from '@/components/RoleGuard'
import DashboardShell from '@/components/dashboard/DashboardShell'
import KpiGrid from '@/components/dashboard/admin/KpiGrid'
import RevenueChart from '@/components/dashboard/admin/RevenueChart'
import OccupancyChart from '@/components/dashboard/admin/OccupancyChart'
import TicketsTable from '@/components/dashboard/admin/TicketsTable'


export default function AdminDashboardPage() {
return (
		<RoleGuard allowed={['admin', 'investor']}>
			<DashboardShell>
<div className="space-y-6">
<KpiGrid />
<div className="grid gap-6 lg:grid-cols-2">
<RevenueChart />
<OccupancyChart />
</div>
<TicketsTable />
</div>
	</DashboardShell>
</RoleGuard>
)
}