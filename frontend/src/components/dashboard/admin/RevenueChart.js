'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts'

const data = [
  { month: 'Jan', collected: 32 },
  { month: 'Feb', collected: 34 },
  { month: 'Mar', collected: 36 },
  { month: 'Apr', collected: 38 },
  { month: 'May', collected: 40 },
  { month: 'Jun', collected: 44 },
]

export default function RevenueChart() {
  return (
    <Card>
      <CardHeader className="pb-2 text-sm text-muted-foreground">Rent Collected (₦M)</CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="collected" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
