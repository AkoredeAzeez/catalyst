'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import AgentSidebar from '@/components/sidebars/AgentSidebar'

function PropertyCard({ property }) {
  return (
    <Card className="rounded-2xl bg-white border border-neutral-200 overflow-hidden hover:shadow-sm transition-shadow w-[302px]">
      <CardContent className="p-0">
        {/* Property Image */}
        <div className="relative w-full h-[144px]">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Property Details */}
        <div className="p-2.5">
          {/* Price and Status */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-neutral-900">${property.price}</span>
              <span className="text-[10px] text-neutral-500">/ month</span>
            </div>
            <Badge 
              className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                property.status === 'Vacant' 
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-100' 
                  : property.status === 'Occupied'
                  ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-100'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {property.status}
            </Badge>
          </div>

          {/* Title and Address */}
          <h3 className="text-xs font-bold text-neutral-900 mb-0.5">{property.title}</h3>
          <p className="text-[10px] text-neutral-500 mb-2.5">{property.address}</p>

          {/* Property Features */}
          <div className="flex items-center gap-2.5 text-[10px] text-neutral-600 mb-2.5 pb-2.5 border-b border-neutral-200">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">{property.beds} bd</span>
            </div>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <span className="font-medium">{property.units} units</span>
            </div>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="font-medium">{property.size} ft</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1.5">
            <button className="flex-1 bg-white text-neutral-900 border border-neutral-300 rounded-lg py-1.5 text-[10px] font-semibold hover:bg-neutral-50 transition-colors">
              View Properties
            </button>
            <button className="px-2.5 py-1.5 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
              <svg className="w-3.5 h-3.5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PropertyBank() {
  const [searchQuery, setSearchQuery] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agent/properties')
      const result = await response.json()
      
      if (result.success) {
        setProperties(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load properties')
      console.error('Error fetching properties:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // Filter properties based on search query
  const filteredProperties = properties.filter((property) => {
    if (!searchQuery) return true
    
    const searchLower = searchQuery.toLowerCase()
    return (
      property.title.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower) ||
      property.status.toLowerCase().includes(searchLower) ||
      property.price.includes(searchQuery)
    )
  })

  // Display only first 6 properties
  const displayedProperties = filteredProperties.slice(0, 6)

  return (
    <div className="flex gap-4 justify-center max-w-full items-stretch">
      {/* Left side: Header + Property Grid */}
      <div className="flex-shrink min-w-0">
        {/* Header with Search */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-900">My Property Bank</h2>
          
          {/* Search Bar */}
          <div className="relative w-[702px]">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, address, status, or price..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-9 pr-4 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Property Grid with Border */}
        <div className="border border-neutral-200 rounded-2xl p-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-sm text-neutral-500">Loading properties...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-sm text-red-500 mb-2">{error}</p>
                <button 
                  onClick={fetchProperties}
                  className="text-sm text-emerald-600 underline hover:text-emerald-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : displayedProperties.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm text-neutral-500">No properties found</p>
                {searchQuery && (
                  <p className="text-xs text-neutral-400 mt-2">Try adjusting your search</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="shrink-0 mt-[50px] self-stretch">
        <AgentSidebar />
      </div>
    </div>
  )
}
