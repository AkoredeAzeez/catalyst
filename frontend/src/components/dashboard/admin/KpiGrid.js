import { Card, CardContent, CardHeader } from '@/components/ui/card'

const KPIS = [
  { label: 'Occupancy', value: '92%', sub: '+2% MoM' },
  { label: 'Monthly Rent Collected', value: '₦48.2M', sub: 'of ₦52.0M due' },
  { label: 'Overdue Invoices', value: '₦6.1M', sub: '34 tenants' },
  { label: 'Open Tickets', value: '27', sub: '5 urgent' },
]

export default function KpiGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {KPIS.map((k) => (
        <Card key={k.label} className="hover:shadow-sm transition">
          <CardHeader className="pb-2 text-sm text-muted-foreground">{k.label}</CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
