'use client'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useRouter } from 'next/navigation'

export default function AgentSidebar() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [agentData, setAgentData] = useState(null)
  const [error, setError] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState('May')

  const fetchAgentStats = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/agent/stats?month=${selectedMonth}`)
      const result = await response.json()
      
      if (result.success) {
        setAgentData(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load agent data')
      console.error('Error fetching agent stats:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedMonth])

  useEffect(() => {
    fetchAgentStats()
  }, [fetchAgentStats])

  if (loading) {
    return (
      <Card className="rounded-[15px] bg-white border border-neutral-300 w-[271px] h-fit">
        <CardContent className="p-4 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto mb-2"></div>
            <p className="text-xs text-neutral-500">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="rounded-[15px] bg-white border border-neutral-300 w-[271px] h-fit">
        <CardContent className="p-4 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-xs text-red-500">{error}</p>
            <button 
              onClick={fetchAgentStats}
              className="mt-2 text-xs text-neutral-900 underline"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { profile, stats, profileViewsChart } = agentData

  const statItems = [
    { label: 'Profile Views', value: stats.profileViews.toLocaleString() },
    { label: 'Vacant', value: stats.vacant.toLocaleString() },
  ]

  const handleViewProfile = () => {
    // Navigate to agent profile page
    router.push('/dashboard/agent/profile')
  }

  const handleCreateNew = () => {
    // Navigate to create new property page or open a modal
    router.push('/dashboard/agent/properties/new')
  }

  return (
    <Card className="rounded-[15px] bg-white border border-neutral-300 w-[271px] h-full">
      <CardContent className="p-3.5 flex flex-col gap-[13px] items-center h-full overflow-y-auto scrollbar-hide"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        {/* Profile Section */}
        <Card className="rounded-[15px] border border-neutral-200 bg-white w-[243px] h-[202px]">
          <CardContent className="p-[17px] flex flex-col items-center justify-center gap-[17px] h-full">
            <div className="relative w-14 h-14">
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                className="rounded-[15px] object-cover"
              />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-xs font-bold text-neutral-900 mb-0.5">{profile.name}</h3>
              <p className="text-[9px] text-neutral-500 mb-0.5">{profile.role}</p>
              <p className="text-[9px] text-neutral-400">{profile.location}</p>
            </div>
            
            <button 
              onClick={handleViewProfile}
              className="w-full bg-neutral-900 text-white rounded-lg py-1 text-[11px] font-semibold hover:bg-neutral-800 transition-colors"
            >
              View Profile
            </button>
          </CardContent>
        </Card>

        {/* Profile views statistics chart section */}
        <Card className="rounded-[15px] border border-neutral-200 bg-white w-[243px] h-[134px]">
          <CardContent className="py-[6px] px-[15px] flex flex-col gap-[13px] h-full justify-center">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-900">Profile views statistics</span>
              <select 
                className="text-[9px] text-neutral-500 border-0 bg-transparent cursor-pointer focus:outline-none"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>
            
            {/* Interactive area chart */}
            <div className="h-20 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={profileViewsChart} 
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="profileGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: '11px',
                      padding: '6px 10px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [value.toLocaleString(), 'Views']}
                    labelStyle={{ fontWeight: '600', marginBottom: '4px', color: '#111827' }}
                  />
                  <Area 
                    type="natural" 
                    dataKey="views" 
                    stroke="#10b981" 
                    strokeWidth={2.25}
                    fillOpacity={1} 
                    fill="url(#profileGradient)"
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid - Profile Views and Vacant */}
        <div className="flex gap-[24px] w-[243px] h-[74px]">
          {statItems.map((stat, index) => (
            <Card key={index} className="rounded-[10px] border border-neutral-200 bg-white w-[111px] h-[74px]">
              <CardContent className="p-[12px] flex flex-col gap-[12px] justify-center items-center h-full">
                <p className="text-[9px] text-neutral-500 font-medium">{stat.label}</p>
                <p className="text-sm font-bold text-neutral-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total Properties Card */}
        <Card className="rounded-[10px] border border-neutral-200 bg-white w-[243px] h-[74px]">
          <CardContent className="p-[12px] flex flex-col gap-[12px] justify-center items-center h-full">
            <p className="text-[9px] text-neutral-500 font-medium text-center">total Properties</p>
            <p className="text-sm font-bold text-neutral-900 text-center">{stats.totalProperties.toLocaleString()}</p>
          </CardContent>
        </Card>

        {/* Occupied and Vacant Grid */}
        <div className="flex gap-[24px] w-[243px] h-[74px]">
          <Card className="rounded-[10px] border border-neutral-200 bg-white w-[111px] h-[74px]">
            <CardContent className="p-[12px] flex flex-col gap-[12px] justify-center items-center h-full">
              <p className="text-[9px] text-neutral-500 font-medium">Occupied</p>
              <p className="text-sm font-bold text-neutral-900">{stats.occupied.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="rounded-[10px] border border-neutral-200 bg-white w-[111px] h-[74px]">
            <CardContent className="p-[12px] flex flex-col gap-[12px] justify-center items-center h-full">
              <p className="text-[9px] text-neutral-500 font-medium">Vacant</p>
              <p className="text-sm font-bold text-neutral-900">{stats.vacant.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Create New Button */}
        <button 
          onClick={handleCreateNew}
          className="w-full bg-neutral-900 text-white rounded-lg py-1.5 text-[11px] font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New
        </button>
      </CardContent>
    </Card>
  )
}
