"use client"
import Image from 'next/image'

export default function PropertyList({ properties = [] }) {
  return (
    <div className="space-y-4">
      {properties.map((p) => (
        <div key={p.id} className="rounded-xl bg-white border overflow-hidden shadow-sm">
          <div className="p-3 flex gap-3 items-center">
            <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden">
              <Image src={p.coverUrl} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium">{p.title}</h4>
                  <div className="text-xs text-muted-foreground">{p.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">${p.price.toLocaleString()} <span className="text-xs text-muted-foreground">/ month</span></div>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Occupied</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{p.beds} bed • {p.baths} bath</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
