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
    { name: 'Vacant', value: vacant, fill: '#a3e4c4' },
    { name: 'Developed', value: developed, fill: '#d1fae5' },
    { name: 'In Progress', value: inProgress, fill: '#6b7280' },
    { name: 'Undeveloped', value: undeveloped, fill: '#4b5563' },
  ]

  const legendItems = [
    { label: 'Occupied', color: '#10b981' },
    { label: 'Vacant', color: '#a3e4c4' },
    { label: 'Developed', color: '#d1fae5' },
    { label: 'In Progress', color: '#6b7280' },
    { label: 'Undeveloped', color: '#4b5563' },
  ]

  return (
    <Card className="rounded-2xl shadow-lg bg-white border-0">
      <CardHeader className="text-xs font-bold text-neutral-900 pb-1.5 pt-3 px-4">Properties Statistics</CardHeader>
      <CardContent className="pt-0 px-4 pb-3">
        {/* Donut Chart with center text */}
        <div className="flex justify-center mb-2 relative">
          <ResponsiveContainer width={100} height={100}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={48}
                paddingAngle={2}
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
              <div className="text-[8px] text-neutral-400 font-normal mb-0.5">Total Properties</div>
              <div className="text-xs font-bold text-neutral-900">{propertiesCount} Units</div>
            </div>
          </div>
        </div>

        {/* Legend - 3 items on first row, 2 items on second row centered */}
        <div className="space-y-1 text-[9px]">
          {/* First row - 3 items */}
          <div className="flex items-center justify-center gap-2">
            {legendItems.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <span className="text-neutral-500 font-normal">{item.label}</span>
              </div>
            ))}
          </div>
          {/* Second row - 2 items centered */}
          <div className="flex items-center justify-center gap-2">
            {legendItems.slice(3, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <span className="text-neutral-500 font-normal">{item.label}</span>
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
    { name: 'Jul', value: 200 },
    { name: 'Aug', value: 320 },
    { name: 'Sep', value: 280 },
    { name: 'Oct', value: 520 },
    { name: 'Nov', value: 800 },
    { name: 'Dec', value: 300 },
    { name: 'Jan', value: 600 },
  ]

  return (
    <Card className="rounded-2xl shadow-lg bg-white border-0">
      <CardHeader className="text-xs font-bold text-neutral-900 pb-1.5 pt-3 px-4">Sales Statistics</CardHeader>
      <CardContent className="pt-0 px-4 pb-3">
        {/* Top section with Total Sales and Rents */}
        <div className="flex items-start justify-between gap-2.5 mb-2">
          {/* Total Sales - Left side */}
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <div className="text-[9px] text-neutral-500 font-normal">Total Sales</div>
              <div className="flex items-center gap-0.5 text-emerald-600 text-[8px] font-semibold">
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <div className="text-lg font-bold text-neutral-900">${monthlyRevenue.toLocaleString()}</div>
          </div>

          {/* Rents box - Right side */}
          <div className="bg-neutral-50 rounded-lg px-2.5 py-1.5 min-w-[95px]">
            <div className="flex items-center gap-1 mb-1">
              <svg className="w-2.5 h-2.5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
              <span className="text-[8px] text-neutral-500 font-medium">Rents</span>
              <svg className="w-2 h-2 text-yellow-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="text-[11px] font-bold text-neutral-900 mb-1">13,546</div>
            <div className="w-full bg-neutral-200 rounded-full h-0.5">
              <div className="bg-emerald-500 h-0.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-neutral-200 mb-2"></div>

        {/* Monthly Revenue Chart */}
        <div>
          <div className="flex items-center justify-between text-[9px] mb-1.5">
            <span className="text-neutral-900 font-semibold">Monthly Revenue</span>
            <span className="text-emerald-500 font-bold">30%</span>
          </div>
          
          {/* Area Chart */}
          <ResponsiveContainer width="100%" height={85}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                domain={[0, 800]}
                ticks={[0, 200, 400, 600, 800]}
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
    { name: 'Mathew K.', phone: '+667 867 764', type: 'Rentals', status: 'Paid', avatar: 'M' },
  ]
  
  return (
    <Card className="rounded-2xl shadow-lg bg-white border-0">
      <CardHeader className="text-xs font-bold text-neutral-900 pb-1.5 pt-3 px-4">Customers List</CardHeader>
      <CardContent className="pt-0 px-4 pb-3">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-2.5 text-[9px] font-medium text-neutral-400 mb-2">
          <div>Customer</div>
          <div>Phone Number</div>
          <div>Type</div>
          <div className="text-right">Status</div>
        </div>
        
        {/* Customer rows */}
        <div className="space-y-2">
          {customers.map((customer, i) => (
            <div key={i} className="grid grid-cols-4 gap-2.5 items-center text-[11px] border-b border-neutral-100 last:border-0 pb-2 last:pb-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-semibold text-neutral-900 truncate">{customer.name}</span>
              </div>
              <div className="text-neutral-600 font-normal">{customer.phone}</div>
              <div className="text-neutral-600 font-normal">{customer.type}</div>
              <div className="text-right">
                <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-bold whitespace-nowrap ${
                  customer.status === 'Paid' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-yellow-50 text-yellow-600'
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
    <div className="grid gap-3 lg:grid-cols-[220px_1fr_1fr]">
      {/* Property Statistics - reduced from 264px to 220px */}
      <div>
        <PropertiesStat />
      </div>
      <SalesStat />
      <CustomersList />
    </div>
  )
}