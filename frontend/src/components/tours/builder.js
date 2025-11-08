'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, Save, Bed, Square, Bath, Link } from 'lucide-react'
import Image from 'next/image'
import TourViewer from './TourViewer'
import { useTourBuilder } from './useTourBuilder'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default function Builder() {
  const {
    rooms,
    connections,
    startRoom,
    drawMode,
    fromRoom,
    saveStatus,
    tourPreview,
    editMode,
    addRoom,
    handleImageUpload,
    deleteRoom,
    connectRooms,
    deleteConnection,
    handleEditHotspot,
    handlePreviewTour,
    handleSave,
    setDrawMode,
    setFromRoom,
    setStartRoom,
    setTourPreview,
    setEditMode,
    setEditingRoomId,
  } = useTourBuilder()

  const [propertyData, setPropertyData] = useState({
    title: '',
    address: '',
    price: '',
    duration: '',
    beds: '',
    size: '',
    bathrooms: '',
    propertyType: 'Rentals',
    status: 'Vacant',
    image: null
  })

  const [propertyTypes, setPropertyTypes] = useState(['Rentals', 'Hostel', 'Shortlet', 'Lease'])
  const [isAddingNewType, setIsAddingNewType] = useState(false)
  const [newPropertyType, setNewPropertyType] = useState('')

  // Update property image when first room is added
  const handleRoomImageUpload = (roomId, file) => {
    handleImageUpload(roomId, file)
    
    // Set as property image if none exists
    if (!propertyData.image && rooms.find(r => r.id === roomId)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPropertyData(prev => ({ ...prev, image: e.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePropertyImageUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPropertyData(prev => ({ ...prev, image: e.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this tour?')) {
      window.location.reload() // Simple reset for now
    }
  }

  const handleAddPropertyType = () => {
    if (newPropertyType.trim() && !propertyTypes.includes(newPropertyType.trim())) {
      const updatedTypes = [...propertyTypes, newPropertyType.trim()]
      setPropertyTypes(updatedTypes)
      setPropertyData({ ...propertyData, propertyType: newPropertyType.trim() })
      setNewPropertyType('')
      setIsAddingNewType(false)
    }
  }

  // If in preview mode, show TourViewer
  if (tourPreview) {
    return (
      <TourViewer 
        tourHtml={tourPreview}
        onClose={() => {
          setTourPreview(null)
          setEditMode(false)
          setEditingRoomId(null)
        }}
        closeButtonText={editMode ? "Save & Close" : "Back to Editor"}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 
            className="text-neutral-900"
            style={{
              width: '207px',
              height: '32px',
              gap: '10px',
              fontFamily: 'Montserrat',
              fontWeight: 600,
              fontSize: '14.93px',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}
          >
            Create Property Evaluation
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Left Section - Rooms Grid */}
          <div>
            {/* Rooms Container with Border */}
            <div 
              className="border border-neutral-300 rounded-[15px] mb-6 bg-white overflow-hidden"
              style={{ 
                width: '1055px',
                height: '647px',
                padding: '16px',
                gap: '12px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div 
                className="grid grid-cols-3 overflow-y-auto scrollbar-hide" 
                style={{ 
                  gap: '12px',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none'
                }}
              >
              {/* Room Cards */}
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => drawMode && connectRooms(room.id)}
                  className={`bg-white rounded-[10px] p-3 border transition-all ${
                    drawMode 
                      ? 'cursor-pointer hover:border-emerald-500 hover:shadow-lg' 
                      : ''
                  } ${
                    startRoom === room.id 
                      ? 'border-emerald-500 shadow-lg' 
                      : fromRoom === room.id
                      ? 'border-amber-500 shadow-lg'
                      : 'border-neutral-200'
                  }`}
                  style={{
                    width: '333px',
                    height: '303px'
                  }}
                >
                  {/* Room Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[12.13px] font-semibold text-neutral-900" style={{ fontFamily: 'Montserrat', fontWeight: 600, lineHeight: '100%', letterSpacing: '0%' }}>
                      {room.name}
                    </h3>
                    {!drawMode && (
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Room Image */}
                  <div className="relative bg-gray-100 rounded-lg mb-3 overflow-hidden" style={{ width: '303px', height: '200px' }}>
                    {room.image ? (
                      <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                    {/* Upload overlay */}
                    {!room.image && (
                      <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/5">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleRoomImageUpload(room.id, e.target.files[0])
                            }
                          }}
                        />
                        <Plus className="text-gray-400" size={24} />
                      </label>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!drawMode && (
                    <div className="flex" style={{ gap: '10px' }}>
                      <button
                        onClick={() => setStartRoom(room.id)}
                        className={`rounded-[10px] border-[1.5px] text-[12.13px] font-semibold transition-colors ${
                          startRoom === room.id
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-900 border-gray-300 hover:bg-black hover:text-white hover:border-black'
                        }`}
                        style={{
                          fontFamily: 'Montserrat',
                          fontWeight: 600,
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          width: connections.some(c => c.from === room.id || c.to === room.id) ? '147px' : '303px',
                          height: '35px'
                        }}
                      >
                        Start Room
                      </button>
                      {connections.some(c => c.from === room.id || c.to === room.id) && (
                        <button
                          onClick={() => handleEditHotspot(room.id)}
                          disabled={!room.image}
                          className="rounded-[10px] border-[1.5px] text-[12.13px] font-semibold bg-white text-neutral-900 border-gray-300 hover:bg-black hover:text-white hover:border-black transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-400 disabled:hover:border-gray-300 flex items-center justify-center gap-2"
                          style={{
                            fontFamily: 'Montserrat',
                            fontWeight: 600,
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            width: '147px',
                            height: '35px'
                          }}
                        >
                          <Edit size={12} />
                          Edit Hotspot
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Add Room Card */}
              {!drawMode && (
                <button
                  onClick={addRoom}
                  className="bg-gray-100 rounded-[10px] p-3 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-200 transition-colors flex items-center justify-center"
                  style={{
                    width: '333px',
                    height: '303px'
                  }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white flex items-center justify-center">
                      <Plus className="text-gray-600" size={24} />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Add Room</p>
                  </div>
                </button>
              )}
              </div>
            </div>

            {/* Property Type & Description Section */}
            <div className="bg-white rounded-[15px] border border-neutral-200" style={{ width: '1055px', minHeight: '144px', gap: '29px', borderWidth: '1px', padding: '12px', display: 'flex', flexDirection: 'column' }}>
              {/* Property Type */}
              <div>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', marginBottom: '12px' }} className="text-neutral-900">
                  Property Type
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {propertyTypes.map((type) => (
                    <label
                      key={type}
                      className="relative flex flex-col cursor-pointer rounded-[10px] border transition-colors"
                      style={{
                        width: '245px',
                        height: '73px',
                        gap: '10px',
                        borderWidth: '1px',
                        paddingTop: '19px',
                        paddingRight: '1px',
                        paddingBottom: '19px',
                        paddingLeft: '12px',
                        borderColor: propertyData.propertyType === type ? '#10b981' : '#d1d5db',
                        backgroundColor: propertyData.propertyType === type ? '#f0fdf4' : '#ffffff'
                      }}
                    >
                      <input
                        type="radio"
                        name="propertyType"
                        value={type}
                        checked={propertyData.propertyType === type}
                        onChange={(e) =>
                          setPropertyData({ ...propertyData, propertyType: e.target.value })
                        }
                        className="sr-only"
                      />
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: propertyData.propertyType === type ? '#10b981' : '#d1d5db' }}>
                          {propertyData.propertyType === type && (
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          )}
                        </div>
                        <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%' }} className="text-neutral-900">
                          {type}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%', paddingLeft: '33px' }} className="text-gray-500">
                        They make payment every year
                      </span>
                    </label>
                  ))}
                  
                  {/* Add New Property Type */}
                  {isAddingNewType ? (
                    <div
                      className="flex flex-col justify-center rounded-[10px] border border-dashed border-gray-300"
                      style={{
                        width: '245px',
                        height: '73px',
                        gap: '8px',
                        padding: '12px'
                      }}
                    >
                      <input
                        type="text"
                        value={newPropertyType}
                        onChange={(e) => setNewPropertyType(e.target.value)}
                        placeholder="Enter property type"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPropertyType()
                          }
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddPropertyType}
                          className="flex-1 px-2 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingNewType(false)
                            setNewPropertyType('')
                          }}
                          className="flex-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingNewType(true)}
                      className="flex flex-col items-center justify-center cursor-pointer rounded-[10px] border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                      style={{
                        width: '245px',
                        height: '73px'
                      }}
                    >
                      <Plus className="text-gray-400 mb-1" size={20} />
                      <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%' }} className="text-gray-500">
                        Add New Type
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-[15px] border border-neutral-200 p-6 mt-6">
              {/* Description */}
              <div>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '14px', lineHeight: '100%', letterSpacing: '0%', marginBottom: '12px' }} className="text-neutral-900">
                  Description
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={propertyData.title}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, title: e.target.value })
                      }
                      placeholder="Villa in Yaba, Lagos"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Address</label>
                    <input
                      type="text"
                      value={propertyData.address}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, address: e.target.value })
                      }
                      placeholder="No 2, Allison street, Onike"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Price</label>
                    <input
                      type="text"
                      value={propertyData.price}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, price: e.target.value })
                      }
                      placeholder="$3,425"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Duration</label>
                    <input
                      type="text"
                      value={propertyData.duration}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, duration: e.target.value })
                      }
                      placeholder="month"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">No. of beds</label>
                    <input
                      type="text"
                      value={propertyData.beds}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, beds: e.target.value })
                      }
                      placeholder="6 bd"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Size</label>
                    <input
                      type="text"
                      value={propertyData.size}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, size: e.target.value })
                      }
                      placeholder="6 ft"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      No. of bathrooms
                    </label>
                    <input
                      type="text"
                      value={propertyData.bathrooms}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, bathrooms: e.target.value })
                      }
                      placeholder="6 units"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Status</label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="Vacant"
                          checked={propertyData.status === 'Vacant'}
                          onChange={(e) =>
                            setPropertyData({ ...propertyData, status: e.target.value })
                          }
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center mr-2">
                          {propertyData.status === 'Vacant' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-sm text-neutral-700">Vacant</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="Occupied"
                          checked={propertyData.status === 'Occupied'}
                          onChange={(e) =>
                            setPropertyData({ ...propertyData, status: e.target.value })
                          }
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center mr-2">
                          {propertyData.status === 'Occupied' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-sm text-neutral-700">Occupied</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Property Preview & Actions */}
          <div 
            className="h-fit"
            style={{
              width: '242px',
              minHeight: '778px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* Property Preview Card */}
            <div className="bg-white rounded-[15px] border border-neutral-200 mb-4 flex flex-col items-center" style={{ padding: '12px' }}>
              {/* Property Image */}
              <div className="relative bg-gray-100 overflow-hidden mb-3 group cursor-pointer" style={{ width: '225.16px', height: '136.73px', borderRadius: '7.46px' }}>
                {propertyData.image ? (
                  <Image
                    src={propertyData.image}
                    alt="Property"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Property Preview
                  </div>
                )}
                {/* Upload overlay */}
                <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/0 hover:bg-black/40 transition-all group">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handlePropertyImageUpload(e.target.files[0])
                      }
                    }}
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="text-white" size={32} />
                  </div>
                </label>
              </div>

              {/* Property Details */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-baseline" style={{ gap: '2px' }}>
                    <span style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '13.56px', lineHeight: '100%', letterSpacing: '0%' }} className="text-neutral-900">
                      {propertyData.price || '$3,425'}
                    </span>
                    <span style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '13.56px', lineHeight: '100%', letterSpacing: '0%' }} className="text-gray-500">
                      / {propertyData.duration || 'month'}
                    </span>
                  </div>
                  <span 
                    className="text-yellow-600 flex items-center justify-center"
                    style={{ 
                      width: '42.38px', 
                      height: '16.39px', 
                      borderRadius: '8.48px', 
                      gap: '5.65px',
                      background: '#FFCF243D',
                      fontFamily: 'Montserrat',
                      fontWeight: 600,
                      fontSize: '9px'
                    }}
                  >
                    {propertyData.status || 'Vacant'}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '11.3px', lineHeight: '100%', letterSpacing: '0%', marginBottom: '4px' }} className="text-neutral-900">
                  {propertyData.title || 'Villa in Yaba, Lagos.'}
                </h3>
                <p style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '9.04px', lineHeight: '100%', letterSpacing: '0%', marginBottom: '12px' }} className="text-gray-500">
                  {propertyData.address || 'No 2, Allison street, Onike.'}
                </p>

                {/* Property Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600" style={{ width: '215.83px', height: '11.87px' }}>
                  <span className="flex items-center" style={{ gap: '3px' }}>
                    <Bed className="w-3 h-3 text-emerald-500" />
                    <span style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '9.04px', lineHeight: '100%', letterSpacing: '0%' }}>
                      {propertyData.beds || '6'} bd
                    </span>
                  </span>
                  <span className="flex items-center" style={{ gap: '3px' }}>
                    <Bath className="w-3 h-3 text-emerald-500" />
                    <span style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '9.04px', lineHeight: '100%', letterSpacing: '0%' }}>
                      {propertyData.bathrooms || '6'} units
                    </span>
                  </span>
                  <span className="flex items-center" style={{ gap: '3px' }}>
                    <Square className="w-3 h-3 text-emerald-500" />
                    <span style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '9.04px', lineHeight: '100%', letterSpacing: '0%' }}>
                      {propertyData.size || '6'} ft
                    </span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '12px' }}>
                <button
                  onClick={handlePreviewTour}
                  disabled={rooms.length === 0}
                  className="rounded-[10px] bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                  style={{
                    width: '221px',
                    height: '26px',
                    gap: '5.96px',
                    fontFamily: 'Montserrat',
                    fontWeight: 600,
                    fontSize: '9.04px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    marginBottom: '8px'
                  }}
                >
                  <Eye size={14} />
                  Preview Tour
                </button>
                <div className="flex justify-center" style={{ gap: '5px' }}>
                  <button
                    onClick={() => handleSave(propertyData)}
                    disabled={rooms.length === 0}
                    className="rounded-[7.46px] bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{
                      width: '108px',
                      height: '26px',
                      gap: '4px',
                      fontFamily: 'Montserrat',
                      fontWeight: 600,
                      fontSize: '11px'
                    }}
                  >
                    <Save className="w-3 h-3" />
                    {saveStatus === 'success' ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-[7.46px] bg-white text-[#6B7280] text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                    style={{
                      width: '108px',
                      height: '26px',
                      gap: '4px',
                      border: '1.12px solid #E5E7EB',
                      fontFamily: 'Montserrat',
                      fontWeight: 600,
                      fontSize: '11px'
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Draw Mode Section */}
            <div className={`bg-white rounded-[15px] border border-neutral-200 flex flex-col items-center ${drawMode ? '' : 'p-4'}`} style={drawMode ? { width: '242px', height: '130px', gap: '17px', borderWidth: '1px', padding: '17px', justifyContent: 'center' } : {}}>
              {drawMode ? (
                <>
                  <h3 className="text-sm font-semibold text-neutral-900 text-center">
                    Draw Mode active
                  </h3>
                  <p className="text-xs text-gray-500 text-center">
                    {fromRoom 
                      ? `Selected: ${rooms.find(r => r.id === fromRoom)?.name}. Click another room to connect.`
                      : 'Click a room to start connecting'}
                  </p>
                  <button
                    onClick={() => {
                      setDrawMode(false)
                      setFromRoom(null)
                    }}
                    className="rounded-[10px] bg-white text-neutral-900 border border-neutral-900 text-sm font-semibold hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center"
                    style={{
                      width: '165px',
                      height: '35px',
                      gap: '10px',
                      borderWidth: '1px'
                    }}
                  >
                    Exit Draw Mode
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setDrawMode(true)}
                    disabled={rooms.length < 2}
                    className="rounded-[10px] bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    style={{
                      width: '165px',
                      height: '35px',
                      gap: '10px',
                      border: '1px solid transparent'
                    }}
                  >
                    Connect Rooms
                  </button>
                </>
              )}
            </div>

            {/* Connections List */}
            {connections.length > 0 && (
              <div className="bg-white rounded-[10px] p-4 border border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 text-center">
                  Connections
                </h3>
                <div className="space-y-2">
                  {connections.map((conn) => {
                    const fromRoom = rooms.find((r) => r.id === conn.from)
                    const toRoom = rooms.find((r) => r.id === conn.to)
                    return (
                      <div
                        key={conn.id}
                        className="flex items-center justify-between gap-3 text-xs text-gray-700"
                      >
                        <span className="flex-1 text-center">{fromRoom?.name}</span>
                        <Link className="w-4 h-4 shrink-0 text-emerald-500" />
                        <span className="flex-1 text-center">{toRoom?.name}</span>
                        <button
                          onClick={() => deleteConnection(conn.id)}
                          className="text-red-500 hover:text-red-600 shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
