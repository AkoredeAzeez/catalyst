'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useInvestorStore } from '@/store/investor.store'
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

function PropertiesStat() {
  const propertiesCount = 57
  const occupied = 30
  const vacant = 15
  const developed = 8
  const inProgress = 3
  const undeveloped = 1

  const chartData = [
    { name: 'Occupied', value: occupied, fill: '#10b981' },
    { name: 'Vacant', value: vacant, fill: '#d1d5db' },
    { name: 'Developed', value: developed, fill: '#e5e7eb' },
    { name: 'In Progress', value: inProgress, fill: '#374151' },
    { name: 'Undeveloped', value: undeveloped, fill: '#1f2937' },
  ]

  const legendItems = [
    { label: 'Occupied', color: '#10b981' },
    { label: 'Vacant', color: '#d1d5db' },
    { label: 'Developed', color: '#e5e7eb' },
    { label: 'In Progress', color: '#374151' },
    { label: 'Undeveloped', color: '#1f2937' },
  ]

  return (
    <Card className="rounded-lg border border-neutral-200 shadow-none bg-white">
      <CardHeader className="text-xs font-semibold text-neutral-900 pb-2 pt-3 px-4">Properties Statistics</CardHeader>
      <CardContent className="pt-0 px-4 pb-3">
        {/* Donut Chart with center text */}
        <div className="flex justify-center mb-3 relative">
          <ResponsiveContainer width={100} height={100}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text overlay - positioned absolutely in center of chart */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm font-bold text-neutral-900">{propertiesCount} Units</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1 text-[9px]">
          {/* First row - 3 items */}
          <div className="flex items-center justify-center gap-3">
            {legendItems.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <span className="text-neutral-600 font-normal">{item.label}</span>
              </div>
            ))}
          </div>
          {/* Second row - 2 items centered */}
          <div className="flex items-center justify-center gap-3">
            {legendItems.slice(3, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <span className="text-neutral-600 font-normal">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SalesStat() {
  const monthlyRevenue = useInvestorStore((s) => s.totalEarnings)
  
  const chartData = [
    { name: 'Jul', value: 40 },
    { name: 'Aug', value: 65 },
    { name: 'Sep', value: 45 },
    { name: 'Oct', value: 70 },
    { name: 'Nov', value: 55 },
    { name: 'Dec', value: 75 },
    { name: 'Jan', value: 60 },
  ]

  return (
    <Card className="rounded-lg border border-neutral-200 shadow-none bg-white">
      <CardHeader className="text-xs font-semibold text-neutral-900 pb-2 pt-3 px-4">Sales Statistics</CardHeader>
      <CardContent className="pt-0 px-4 pb-3">
        {/* Total Sales */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[9px] text-neutral-500 font-normal">Total Sales</div>
            <div className="flex items-center gap-1 text-emerald-600 text-[9px] font-semibold">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
              </svg>
              <span>13546</span>
            </div>
          </div>
          <div className="text-base font-semibold text-neutral-900 mb-1">${monthlyRevenue.toLocaleString()}</div>
        </div>

        {/* Monthly Revenue Chart */}
        <div>
          <div className="flex items-center justify-between text-[9px] mb-2">
            <span className="text-neutral-500 font-normal">Monthly Revenue</span>
            <span className="text-emerald-600 font-semibold">30%</span>
          </div>
          
          {/* Area Chart */}
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke="transparent" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide={true} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f3f4f6', 
                  border: 'none', 
                  borderRadius: '6px',
                  fontSize: '10px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function CustomersList() {
  const customers = [
    { name: 'Mathew K.', phone: '+667 867 764', type: 'Rentals', status: 'Paid', avatar: 'M' },
    { name: 'Mathew K.', phone: '+667 867 764', type: 'Hostel', status: 'Owing', avatar: 'M' },
    { name: 'Mathew K.', phone: '+667 867 764', type: 'Leasing', status: 'Owing', avatar: 'M' },
  ]
  
  return (
    <Card className="rounded-lg border border-neutral-200 shadow-none bg-white">
      <CardHeader className="text-xs font-semibold text-neutral-900 pb-2 pt-3 px-4">Customers List</CardHeader>
      <CardContent className="pt-0 px-4 pb-3">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-2 text-[9px] font-semibold text-neutral-500 mb-2 pb-2 border-b border-neutral-150">
          <div>Customer</div>
          <div>Phone Number</div>
          <div>Type</div>
          <div className="text-right">Status</div>
        </div>

        {/* Customer rows */}
        <div className="space-y-2">
          {customers.map((customer, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center text-[10px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-400 flex items-center justify-center text-[9px] font-medium text-white flex-shrink-0">
                  {customer.avatar}
                </div>
                <span className="font-semibold text-neutral-900 truncate">{customer.name}</span>
              </div>
              <div className="text-neutral-600 font-normal">{customer.phone}</div>
              <div className="text-neutral-600 font-normal">{customer.type}</div>
              <div className="text-right">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold whitespace-nowrap ${
                  customer.status === 'Paid' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  {customer.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function StatsGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-[264px_1fr_1fr]">
      {/* Property Statistics - constrained to 264px to match sidebar interior content width */}
      <div>
        <PropertiesStat />
      </div>
      <SalesStat />
      <CustomersList />
    </div>
  )
}