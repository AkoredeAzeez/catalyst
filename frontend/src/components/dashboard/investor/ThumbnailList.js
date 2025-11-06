'use client'
import { useInvestorStore } from '@/store/investor.store'
import { useRef, useEffect, useState } from 'react'

const ROOM_LABELS = ['Exterior View', 'Kitchen', 'Bathroom', 'Bedroom', 'Livingroom']
const MIN_THUMBNAIL_SIZE = 60 // Minimum pixel size before scrolling
const MAX_THUMBNAIL_SIZE = 80 // Maximum pixel size

export default function ThumbnailList() {
  const images = useInvestorStore((s) => s.images)
  const selectedIndex = useInvestorStore((s) => s.selectedIndex)
  const selectImage = useInvestorStore((s) => s.selectImage)
  const containerRef = useRef(null)
  const [thumbnailSize, setThumbnailSize] = useState(MAX_THUMBNAIL_SIZE)

  useEffect(() => {
    if (!containerRef.current) return

    const calculateSize = () => {
      const containerWidth = containerRef.current?.offsetWidth || 280
      const gap = 12 // gap-3 = 12px
      const totalGapWidth = (images.length - 1) * gap
      const availableWidth = containerWidth - totalGapWidth
      const calculatedSize = availableWidth / images.length

      // Clamp size between MIN and MAX
      const newSize = Math.max(MIN_THUMBNAIL_SIZE, Math.min(MAX_THUMBNAIL_SIZE, calculatedSize))
      setThumbnailSize(newSize)
    }

    calculateSize()

    // Recalculate on window resize
    window.addEventListener('resize', calculateSize)
    return () => window.removeEventListener('resize', calculateSize)
  }, [images.length])

  return (
    <div className="w-full">
      {/* Horizontally scrollable container when needed */}
      <div 
        ref={containerRef}
        className="w-full overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-3 pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`group relative flex-shrink-0 transition-all ${
                selectedIndex === index 
                  ? 'ring-2 ring-offset-1 ring-emerald-500' 
                  : 'hover:ring-2 hover:ring-offset-1 hover:ring-emerald-300'
              }`}
              style={{
                width: `${thumbnailSize}px`,
                height: `${thumbnailSize}px`
              }}
            >
              {/* Thumbnail container */}
              <div className="w-full h-full bg-neutral-200 rounded-md overflow-hidden relative flex-shrink-0">
                <img
                  src={image}
                  alt={ROOM_LABELS[index] || `Room ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3C/svg%3E'
                  }}
                />
                {/* Selected state overlay */}
                {selectedIndex === index && (
                  <div className="absolute inset-0 bg-emerald-500/5"></div>
                )}
              </div>
              
              {/* Room name below thumbnail - only show if size allows */}
              {thumbnailSize > 65 && (
                <div className="pt-1 w-full absolute top-full left-0">
                  <span className="text-[9px] font-normal text-neutral-600 text-center block leading-tight truncate px-0.5">
                    {ROOM_LABELS[index] || `Room ${index + 1}`}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}