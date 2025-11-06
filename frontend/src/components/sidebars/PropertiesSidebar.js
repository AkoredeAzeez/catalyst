'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const PROPERTY_TYPES = ['All', 'Rentals', 'Hostels', 'Shortlet', 'Sale']

const MOCK_PROPERTIES = [
  {
    id: 1,
    image: '/property1.jpg',
    price: 3425,
    status: 'Occupied',
    title: 'Villa in Yaba, Lagos.',
    address: 'No 2, Allison street, Onike.',
    beds: 6,
    units: 6,
    sqft: 6,
    type: 'Rentals'
  },
  {
    id: 2,
    image: '/property2.jpg',
    price: 3425,
    status: 'Vacant',
    title: 'Villa in Yaba, Lagos.',
    address: 'No 2, Allison street, Onike.',
    beds: 6,
    units: 6,
    sqft: 6,
    type: 'Rentals'
  },
]

export function PropertiesSidebar() {
  const [activeFilter, setActiveFilter] = useState('Rentals')

  const filteredProperties = activeFilter === 'All' 
    ? MOCK_PROPERTIES 
    : MOCK_PROPERTIES.filter(p => p.type === activeFilter)

  return (
    <aside className="hidden lg:block w-full">
      <div className="space-y-4">
        {/* Buy/Sell buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none shadow-none text-sm px-4 py-2 h-9 font-medium rounded-lg">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Buy
          </Button>
          <Button variant="outline" className="text-neutral-600 border-neutral-200 hover:bg-neutral-50 text-sm px-4 py-2 h-9 font-medium rounded-lg bg-white">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sell
          </Button>
        </div>

        {/* My Properties section */}
        <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900">My Properties</h2>
            <select 
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="text-xs border border-neutral-200 rounded-lg px-3 py-1.5 bg-white text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent font-medium"
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Property cards */}
          <div className="space-y-3">
            {filteredProperties.map(property => (
              <div key={property.id} className="bg-white rounded-xl border border-neutral-100 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
                {/* Property Image */}
                <div className="relative h-32 w-full bg-neutral-100">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="12"%3EProperty%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>

                {/* Property Details */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-base font-bold text-neutral-900">
                      ${property.price.toLocaleString()} <span className="text-xs font-normal text-neutral-500">/ month</span>
                    </div>
                    <Badge className={`text-[10px] px-2 py-1 font-semibold rounded-md ${property.status === 'Occupied' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                      {property.status}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-sm text-neutral-900 mb-1">{property.title}</h3>
                  <p className="text-xs text-neutral-500 mb-3">{property.address}</p>

                  {/* Property Stats */}
                  <div className="flex items-center gap-3 text-xs text-neutral-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                      </svg>
                      <span>{property.beds} bd</span>
                    </div>
                    <div className="text-neutral-300">|</div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                      </svg>
                      <span>{property.units} units</span>
                    </div>
                    <div className="text-neutral-300">|</div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                      </svg>
                      <span>{property.sqft} ft</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
export default PropertiesSidebar