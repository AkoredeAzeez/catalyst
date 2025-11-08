'use client'

import { Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import TourViewer from './TourViewer'
import { useTourBuilder } from './useTourBuilder'

export default function TourBuilderNew() {
  const {
    rooms,
    connections,
    startRoom,
    drawMode,
    fromRoom,
    saving,
    saveStatus,
    propertyData,
    tourPreview,
    editMode,
    setDrawMode,
    setFromRoom,
    setPropertyData,
    setTourPreview,
    setEditMode,
    setEditingRoomId,
    addRoom,
    updateRoom,
    handleImageUpload,
    deleteRoom,
    handleStartRoom,
    connectRooms,
    deleteConnection,
    handleEditHotspot,
    handlePreviewTour,
    handleSave,
    handleDelete,
  } = useTourBuilder()

  // If in preview mode, show TourViewer
  if (tourPreview) {

  const addRoom = () => {
    const newRoom = {
      id: generateId(),
      name: `Room ${rooms.length + 1}`,
      image: null,
      hotspots: [],
    }
    setRooms([...rooms, newRoom])
  }

  const updateRoom = (id, updates) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  const handleImageUpload = (roomId, file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Standard dimensions for all 360° images
        const TARGET_WIDTH = 2048
        const TARGET_HEIGHT = 1024
        
        // Create canvas with target dimensions
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = TARGET_WIDTH
        canvas.height = TARGET_HEIGHT
        
        // Draw image with high quality settings
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT)
        
        // Convert to data URL with high quality
        const highQualityDataUrl = canvas.toDataURL('image/jpeg', 0.95)
        updateRoom(roomId, { image: highQualityDataUrl })
        
        // Also set as property image if it's the first room
        if (!propertyData.image) {
          setPropertyData(prev => ({ ...prev, image: highQualityDataUrl }))
        }
        
        console.log(`Image converted: ${img.width}x${img.height} → ${TARGET_WIDTH}x${TARGET_HEIGHT}`)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  const deleteRoom = (id) => {
    setRooms(rooms.filter(r => r.id !== id))
    setConnections(connections.filter(c => c.from !== id && c.to !== id))
    if (startRoom === id) setStartRoom(null)
    if (selectedRoom?.id === id) setSelectedRoom(null)
  }

  const handleStartRoom = (roomId) => {
    setStartRoom(roomId)
  }

  // Connect rooms in draw mode
  const connectRooms = (roomId) => {
    if (!drawMode) return
    
    if (!fromRoom) {
      setFromRoom(roomId)
    } else if (fromRoom !== roomId) {
      const exists = connections.some(
        c => (c.from === fromRoom && c.to === roomId) ||
             (c.from === roomId && c.to === fromRoom)
      )

      if (!exists) {
        setConnections([
          ...connections,
          {
            id: generateId(),
            from: fromRoom,
            to: roomId,
            label: '',
          },
        ])
      }
      setFromRoom(null)
      setDrawMode(false) // Exit draw mode after connection
    }
  }

  const deleteConnection = (connId) => {
    setConnections(connections.filter(c => c.id !== connId))
  }

  // Generate tour HTML
  const generateTourHTML = useCallback((isEditMode = false, editingRoomIdParam = null) => {
    const roomMap = {}
    rooms.forEach(room => {
      roomMap[room.id] = room
    })

    const sceneConfig = {}
    rooms.forEach(room => {
      const roomConnections = connections.filter(c => c.from === room.id || c.to === room.id)
      const hotspots = []

      roomConnections.forEach((conn, idx) => {
        const targetId = conn.from === room.id ? conn.to : conn.from
        const targetRoom = roomMap[targetId]
        
        const storedHotspot = room.hotspots?.find(h => h.targetId === targetId)
        
        hotspots.push({
          id: `to${targetRoom.name.replace(/\s+/g, '')}${idx}`,
          label: `To ${targetRoom.name}`,
          yaw: storedHotspot?.yaw ?? (idx * 90) % 360,
          pitch: storedHotspot?.pitch ?? -2,
          target: targetRoom.name.toLowerCase().replace(/\s+/g, '_'),
          targetId: targetId,
        })
      })

      sceneConfig[room.name.toLowerCase().replace(/\s+/g, '_')] = {
        name: room.name,
        image: room.image,
        hotspots: hotspots,
        roomId: room.id,
      }
    })

    let startKey
    if (isEditMode && editingRoomIdParam) {
      const editingRoom = rooms.find(r => r.id === editingRoomIdParam)
      startKey = editingRoom ? editingRoom.name.toLowerCase().replace(/\s+/g, '_') : Object.keys(sceneConfig)[0]
    } else {
      startKey = startRoom ? rooms.find(r => r.id === startRoom)?.name.toLowerCase().replace(/\s+/g, '_') : Object.keys(sceneConfig)[0]
    }

    // Build SCENES object
    const scenesEntries = Object.entries(sceneConfig).map(([key, val]) => {
      const safeImage = (val.image || '').replace(/'/g, "\\'")
      const hotspotsJson = JSON.stringify(val.hotspots)
      return `'${key}': { name: '${val.name}', image: '${safeImage}', hotspots: ${hotspotsJson}, roomId: ${val.roomId} }`
    }).join(',\n      ')

    const editModeScript = isEditMode ? `
    const EDIT_MODE = true;
    const hotspotPositions = {};
    let selectedHotspot = null;
    let isDraggingHotspot = false;
    const EDITING_ROOM_ID = ${editingRoomIdParam || 'null'};
    
    window.saveHotspotPositions = function() {
      window.parent.postMessage({ type: 'HOTSPOT_POSITIONS', data: hotspotPositions }, '*');
    };
    ` : 'const EDIT_MODE = false; const EDITING_ROOM_ID = null;'

    // Return the full HTML with all the Three.js tour code
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>360° Virtual Tour${isEditMode ? ' - Edit Mode' : ''}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; font-family: Arial, sans-serif; }
    #app { width: 100vw; height: 100vh; position: relative; }
    canvas { display: block; }
    .hotspot { position: absolute; background: rgba(255,255,255,0.8); color: #333; padding: 8px 12px; border-radius: 20px; font-size: 14px; cursor: pointer; transform: translate(-50%, -50%); transition: all 0.2s; white-space: nowrap; user-select: none; }
    .hotspot:hover { background: #fff; transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
    .hotspot.editing { background: rgba(255,215,0,0.9); cursor: move; }
    .hotspot.editing:hover { background: rgba(255,215,0,1); }
    .controls { position: absolute; top: 20px; left: 20px; display: flex; gap: 10px; z-index: 100; }
    .btn { background: rgba(255,255,255,0.9); border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
    .btn:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
    .edit-instructions { position: absolute; top: 70px; left: 20px; background: rgba(255,215,0,0.95); color: #333; padding: 15px 20px; border-radius: 8px; font-size: 14px; max-width: 300px; z-index: 100; line-height: 1.6; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .edit-instructions strong { display: block; margin-bottom: 8px; font-size: 16px; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
    }
  }
  </script>
  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    ${editModeScript}

    const SCENES = {
      ${scenesEntries}
    };

    const START_SCENE_KEY = '${startKey}';

    let currentSceneKey = START_SCENE_KEY;
    let camera, scene, renderer, controls;
    let hotspotDivs = [];

    function init() {
      const container = document.getElementById('app');

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 0.1);

      scene = new THREE.Scene();

      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.rotateSpeed = -0.3;
      controls.minDistance = 0.1;
      controls.maxDistance = 100;

      if (EDIT_MODE) {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'controls';
        controlsDiv.innerHTML = \`
          <button class="btn" onclick="window.saveHotspotPositions()">💾 Save Positions</button>
          <button class="btn" onclick="window.parent.postMessage({ type: 'CLOSE_EDITOR' }, '*')">✕ Cancel</button>
        \`;
        container.appendChild(controlsDiv);

        const instructionsDiv = document.createElement('div');
        instructionsDiv.className = 'edit-instructions';
        instructionsDiv.innerHTML = \`
          <strong>🎯 Hotspot Editor</strong>
          <div>• Drag hotspots to reposition them</div>
          <div>• Click "Save Positions" when done</div>
          <div>• Hotspots auto-save their positions</div>
        \`;
        container.appendChild(instructionsDiv);
      }

      window.addEventListener('resize', onWindowResize);
      loadScene(currentSceneKey);
      animate();
    }

    function loadScene(sceneKey) {
      currentSceneKey = sceneKey;
      const sceneData = SCENES[sceneKey];
      if (!sceneData) {
        console.error('Scene not found:', sceneKey);
        return;
      }

      hotspotDivs.forEach(div => div.remove());
      hotspotDivs = [];

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        sceneData.image,
        (texture) => {
          if (scene.children.length > 0) {
            const existingMesh = scene.children.find(child => child.isMesh);
            if (existingMesh) scene.remove(existingMesh);
          }

          const material = new THREE.MeshBasicMaterial({ map: texture });
          const geometry = new THREE.SphereGeometry(500, 60, 40);
          geometry.scale(-1, 1, 1);
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);

          createHotspots(sceneData.hotspots, sceneData.roomId);
        },
        undefined,
        (err) => console.error('Error loading texture:', err)
      );
    }

    function createHotspots(hotspots, roomId) {
      const container = document.getElementById('app');

      hotspots.forEach(hotspot => {
        const div = document.createElement('div');
        div.className = 'hotspot' + (EDIT_MODE ? ' editing' : '');
        div.textContent = hotspot.label;
        div.dataset.hotspotId = hotspot.id;
        div.dataset.targetId = hotspot.targetId;

        if (!EDIT_MODE) {
          div.onclick = () => loadScene(hotspot.target);
        } else {
          makeHotspotDraggable(div, hotspot, roomId);
        }

        container.appendChild(div);
        hotspotDivs.push(div);
        updateHotspotPosition(div, hotspot.yaw, hotspot.pitch);
      });
    }

    function makeHotspotDraggable(div, hotspot, roomId) {
      let isDragging = false;
      let startX, startY;

      div.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        div.style.cursor = 'grabbing';
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const sensitivity = 0.2;
        const newYaw = hotspot.yaw + deltaX * sensitivity;
        const newPitch = Math.max(-90, Math.min(90, hotspot.pitch + deltaY * sensitivity));

        hotspot.yaw = newYaw;
        hotspot.pitch = newPitch;

        updateHotspotPosition(div, newYaw, newPitch);

        const roomKey = Object.keys(SCENES).find(key => SCENES[key].roomId === roomId);
        if (!hotspotPositions[roomKey]) hotspotPositions[roomKey] = {};
        
        hotspotPositions[roomKey][hotspot.id] = {
          yaw: newYaw,
          pitch: newPitch,
          targetId: hotspot.targetId
        };

        startX = e.clientX;
        startY = e.clientY;
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          div.style.cursor = 'move';
        }
      });
    }

    function updateHotspotPosition(div, yaw, pitch) {
      const phi = THREE.MathUtils.degToRad(90 - pitch);
      const theta = THREE.MathUtils.degToRad(yaw);

      const pos = new THREE.Vector3();
      pos.setFromSphericalCoords(500, phi, theta);

      const projected = pos.clone().project(camera);
      const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(projected.y * 0.5) + 0.5) * window.innerHeight;

      div.style.left = x + 'px';
      div.style.top = y + 'px';

      const distanceFromCamera = camera.position.distanceTo(pos);
      div.style.display = (distanceFromCamera < 500 && projected.z < 1) ? 'block' : 'none';
    }

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

      hotspotDivs.forEach(div => {
        const hotspotId = div.dataset.hotspotId;
        const sceneData = SCENES[currentSceneKey];
        const hotspot = sceneData?.hotspots.find(h => h.id === hotspotId);
        if (hotspot) {
          updateHotspotPosition(div, hotspot.yaw, hotspot.pitch);
        }
      });
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    init();
  </script>
</body>
</html>`
  }, [rooms, connections, startRoom])

  // Edit hotspots mode
  const handleEditHotspot = (roomId) => {
    if (rooms.length === 0) {
      alert('Please add at least one room')
      return
    }
    if (!connections.some(c => c.from === roomId || c.to === roomId)) {
      alert('This room has no connections. Please connect it to other rooms first.')
      return
    }
    setEditingRoomId(roomId)
    setEditMode(true)
    const html = generateTourHTML(true, roomId)
    setTourPreview(html)
  }

  // Handle hotspot position updates from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'HOTSPOT_POSITIONS') {
        const positions = event.data.data
        
        setRooms(prevRooms => prevRooms.map(room => {
          const roomKey = room.name.toLowerCase().replace(/\s+/g, '_')
          const roomPositions = positions[roomKey]
          
          if (roomPositions) {
            const updatedHotspots = Object.entries(roomPositions).map(([hotspotId, pos]) => ({
              targetId: pos.targetId,
              yaw: pos.yaw,
              pitch: pos.pitch,
            }))
            
            return { ...room, hotspots: updatedHotspots }
          }
          return room
        }))
        
        setTourPreview(null)
        setEditMode(false)
        setEditingRoomId(null)
        setSaveStatus('success')
        setTimeout(() => setSaveStatus(null), 3000)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handlePreviewTour = () => {
    if (rooms.length === 0) {
      alert('Please add at least one room before previewing')
      return
    }
    const html = generateTourHTML(false)
    setTourPreview(html)
  }

  const handleSave = async () => {
    if (rooms.length === 0) {
      alert('Please add at least one room before saving')
      return
    }

    setSaving(true)
    setSaveStatus(null)

    try {
      const tourHtml = generateTourHTML()
      const tourData = {
        propertyData,
        tourHtml,
        rooms,
        connections,
        startRoom,
        createdAt: new Date().toISOString(),
      }

      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourData),
      })

      if (!response.ok) {
        throw new Error('Failed to save tour')
      }

      const result = await response.json()
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
      
      return result
    } catch (error) {
      console.error('Error saving tour:', error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this tour?')) {
      setRooms([])
      setConnections([])
      setStartRoom(null)
      setPropertyData({
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
      setSaveStatus(null)
    }
  }

  // Auto-save
  useEffect(() => {
    if (rooms.length > 0) {
      const timeoutId = setTimeout(() => {
        handleSave()
      }, 3000)

      return () => clearTimeout(timeoutId)
    }
  }, [rooms, connections, propertyData, startRoom])

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
        closeButtonText={editMode ? "💾 Save & Close" : "← Back to Editor"}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Create Property Evaluation
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Left Section - Rooms Grid */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Room Cards */}
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => drawMode && connectRooms(room.id)}
                  className={`bg-white rounded-[10px] p-3 border-2 transition-all ${
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
                >
                  {/* Room Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-neutral-900">
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
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
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
                              handleImageUpload(room.id, e.target.files[0])
                            }
                          }}
                        />
                        <Plus className="text-gray-400" size={24} />
                      </label>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!drawMode && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartRoom(room.id)}
                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          startRoom === room.id
                            ? 'bg-neutral-900 text-white'
                            : 'bg-white text-neutral-900 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Start Room
                      </button>
                      {connections.some(c => c.from === room.id || c.to === room.id) && (
                        <button
                          onClick={() => handleEditHotspot(room.id)}
                          disabled={!room.image}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-neutral-900 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
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
                  className="bg-gray-100 rounded-[10px] p-3 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-200 transition-colors min-h-[200px] flex items-center justify-center"
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

            {/* Property Type & Description Section */}
            <div className="bg-white rounded-[10px] p-6 border border-neutral-200">
              {/* Property Type */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                  Property Type
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Rentals', 'Hostel', 'Shortlet', 'Lease'].map((type) => (
                    <label
                      key={type}
                      className="relative flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="propertyType"
                        value={type}
                        checked={propertyData.propertyType === type}
                        onChange={(e) =>
                          setPropertyData({ ...propertyData, propertyType: e.target.value })
                        }
                        className="peer sr-only"
                      />
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center mr-2">
                        {propertyData.propertyType === type && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-sm text-neutral-700">{type}</span>
                      <p className="text-xs text-gray-500 mt-0.5 ml-6">
                        They make payment every year
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description Fields */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                  Description
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={propertyData.title}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, title: e.target.value })
                      }
                      placeholder="Villa in Yaba, Lagos."
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
                      placeholder="No 2, Allison street, Onike.."
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
                      placeholder="3 Months"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">No. of Rooms</label>
                    <input
                      type="text"
                      value={propertyData.beds}
                      onChange={(e) =>
                        setPropertyData({ ...propertyData, beds: e.target.value })
                      }
                      placeholder="6"
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
          <div className="lg:sticky lg:top-6 h-fit">
            {/* Property Preview Card */}
            <div className="bg-white rounded-[15px] p-4 border border-neutral-200 mb-4">
              {/* Property Image */}
              <div className="relative w-full h-48 bg-gray-100 rounded-[10px] mb-4 overflow-hidden">
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
              </div>

              {/* Property Details */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-semibold text-neutral-900">
                    {propertyData.price || '$3,425'}
                  </span>
                  <span className="text-xs text-gray-500">/ month</span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                  {propertyData.title || 'Villa in Yaba, Lagos.'}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {propertyData.address || 'No 2, Allison street, Onike.'}
                </p>

                {/* Property Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">
                      {propertyData.beds || '6'} bd
                    </span>
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">
                      {propertyData.bathrooms || '6'} units
                    </span>
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">
                      {propertyData.size || '6'} ft
                    </span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handlePreviewTour}
                  disabled={rooms.length === 0}
                  className="w-full py-2.5 rounded-[10px] bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Preview Tour
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSave}
                    className="py-2.5 rounded-[10px] bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleDelete}
                    className="py-2.5 rounded-[10px] bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Draw Mode Section */}
            <div className="bg-white rounded-[10px] p-4 border border-neutral-200 mt-4">
              {drawMode ? (
                <>
                  <h3 className="text-sm font-semibold text-amber-900 mb-2">
                    Draw Mode Active
                  </h3>
                  <p className="text-xs text-amber-700 mb-3">
                    {fromRoom 
                      ? `Selected: ${rooms.find(r => r.id === fromRoom)?.name}. Click another room to connect.`
                      : 'Click a room to start connecting'}
                  </p>
                  <button
                    onClick={() => {
                      setDrawMode(false)
                      setFromRoom(null)
                    }}
                    className="w-full py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
                  >
                    Exit Draw Mode
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setDrawMode(true)}
                    disabled={rooms.length < 2}
                    className="w-full py-2 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                  >
                    Connect Rooms
                  </button>
                </>
              )}

              {/* Connections List */}
              {connections.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3 mt-4">
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
                          <span className="flex-1">{fromRoom?.name}</span>
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 12H17M17 12L13 8M17 12L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="flex-1">{toRoom?.name}</span>
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
                </>
              )}
            </div>

            {/* Old Connections Section - Remove */}
            {false && connections.length > 0 && (
              <div className="bg-white rounded-[10px] p-4 border border-neutral-200 mt-4">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                  Connections ({connections.length})
                </h3>
                <div className="space-y-2">
                  {connections.map((conn) => {
                    const fromRoom = rooms.find((r) => r.id === conn.from)
                    const toRoom = rooms.find((r) => r.id === conn.to)
                    return (
                      <div
                        key={conn.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-xs text-gray-700">
                          {fromRoom?.name} ↔ {toRoom?.name}
                        </span>
                        <button
                          onClick={() =>
                            setConnections(connections.filter((c) => c.id !== conn.id))
                          }
                          className="text-red-500 hover:text-red-600"
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

function Eye({ size = 24, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
