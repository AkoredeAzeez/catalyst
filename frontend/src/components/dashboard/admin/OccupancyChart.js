'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts'

const data = [
  { building: 'A', occupancy: 96 },
  { building: 'B', occupancy: 91 },
  { building: 'C', occupancy: 88 },
  { building: 'D', occupancy: 93 },
]

export default function OccupancyChart() {
  return (
    <Card>
      <CardHeader className="pb-2 text-sm text-muted-foreground">Occupancy by Building (%)</CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <XAxis dataKey="building" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="occupancy" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
