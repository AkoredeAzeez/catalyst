'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function ProfileViewsStat() {
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 }
  ]

  return (
    <Card className="rounded-2xl shadow-lg bg-white border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
        <span className="text-xs font-bold text-neutral-900">Profile views statistics</span>
        <select className="text-[9px] text-neutral-500 border border-neutral-200 rounded px-2 py-1">
          <option>May</option>
        </select>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-3">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProfileViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 8, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 8, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '6px',
                fontSize: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Area 
              type="natural" 
              dataKey="value" 
              stroke="#10b981" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorProfileViews)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function ViefortStat() {
  const chartData = [
    { name: 'Jan', value: 600 },
    { name: 'Feb', value: 400 },
    { name: 'Mar', value: 700 },
    { name: 'Apr', value: 500 },
    { name: 'May', value: 800 },
    { name: 'Jun', value: 650 }
  ]

  return (
    <Card className="rounded-2xl shadow-lg bg-white border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
        <span className="text-xs font-bold text-neutral-900">Viefort</span>
        <select className="text-[9px] text-neutral-500 border border-neutral-200 rounded px-2 py-1">
          <option>May</option>
        </select>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-3">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViefort" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 8, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 8, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '6px',
                fontSize: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Area 
              type="natural" 
              dataKey="value" 
              stroke="#10b981" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorViefort)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default function AgentStats() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <ProfileViewsStat />
      <ViefortStat />
    </div>
  )
}
