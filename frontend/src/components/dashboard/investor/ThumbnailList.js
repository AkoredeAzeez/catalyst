'use client'
import { useInvestorStore } from '@/store/investor.store'
import { useMemo } from 'react'

const ROOM_LABELS = ['Exterior View', 'Kitchen', 'Bathroom', 'Bedroom', 'Livingroom']
const CONTAINER_WIDTH = 210
const CONTAINER_HEIGHT = 160
const ROW_GAP = 22
const THUMBNAIL_GAP = 12
const MAX_PER_ROW = 3

export default function ThumbnailList() {
  const images = useInvestorStore((s) => s.images)
  const selectedIndex = useInvestorStore((s) => s.selectedIndex)
  const selectImage = useInvestorStore((s) => s.selectImage)

  // Calculate thumbnail dimensions based on number of images
  const { thumbnailSize, rows } = useMemo(() => {
    const totalImages = images.length
    const imagesPerRow = Math.min(totalImages, MAX_PER_ROW)
    const numRows = Math.ceil(totalImages / MAX_PER_ROW)
    
    // Calculate height: account for row gap and label space
    const labelSpace = 36 // Space for labels below thumbnails
    const totalVerticalGap = numRows > 1 ? ROW_GAP : 0
    const availableHeight = CONTAINER_HEIGHT - totalVerticalGap - labelSpace
    const height = availableHeight / numRows
    
    // Make thumbnails square using the height as both width and height
    const size = height
    
    // Split images into rows
    const imageRows = []
    for (let i = 0; i < totalImages; i += MAX_PER_ROW) {
      imageRows.push(images.slice(i, i + MAX_PER_ROW))
    }
    
    return { 
      thumbnailSize: size,
      rows: imageRows
    }
  }, [images.length])

  return (
    <div className="w-full" style={{ maxWidth: `${CONTAINER_WIDTH}px`, height: `${CONTAINER_HEIGHT}px` }}>
      <div className="flex flex-col" style={{ gap: `${ROW_GAP}px` }}>
        {rows.map((rowImages, rowIndex) => (
          <div key={rowIndex} className="flex flex-col" style={{ gap: '6px' }}>
            {/* Thumbnails row */}
            <div className="flex" style={{ gap: `${THUMBNAIL_GAP}px` }}>
              {rowImages.map((image, colIndex) => {
                const imageIndex = rowIndex * MAX_PER_ROW + colIndex
                return (
                  <button
                    key={imageIndex}
                    onClick={() => selectImage(imageIndex)}
                    className={`relative flex-shrink-0 transition-all rounded-xl overflow-hidden ${
                      selectedIndex === imageIndex 
                        ? 'ring-2 ring-offset-1 ring-emerald-500' 
                        : 'hover:ring-2 hover:ring-offset-1 hover:ring-emerald-300'
                    }`}
                    style={{
                      width: `${thumbnailSize}px`,
                      height: `${thumbnailSize}px`
                    }}
                  >
                    {/* Thumbnail container */}
                    <div className="w-full h-full bg-neutral-200 relative">
                      <img
                        src={image}
                        alt={ROOM_LABELS[imageIndex] || `Room ${imageIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3C/svg%3E'
                        }}
                      />
                      {/* Selected state overlay */}
                      {selectedIndex === imageIndex && (
                        <div className="absolute inset-0 bg-emerald-500/5"></div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            
            {/* Labels row */}
            <div className="flex" style={{ gap: `${THUMBNAIL_GAP}px` }}>
              {rowImages.map((image, colIndex) => {
                const imageIndex = rowIndex * MAX_PER_ROW + colIndex
                return (
                  <div 
                    key={imageIndex} 
                    className="text-center"
                    style={{ width: `${thumbnailSize}px` }}
                  >
                    <span className="text-[9px] font-medium text-neutral-700 block leading-tight truncate">
                      {ROOM_LABELS[imageIndex] || `Room ${imageIndex + 1}`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}