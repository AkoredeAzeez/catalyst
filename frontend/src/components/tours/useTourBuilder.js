'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export function useTourBuilder() {
  const [rooms, setRooms] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [startRoom, setStartRoom] = useState(null)
  const [drawMode, setDrawMode] = useState(false)
  const [fromRoom, setFromRoom] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [tourPreview, setTourPreview] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState(null)
  const idCounter = useRef(1)

  const generateId = () => {
    const id = idCounter.current
    idCounter.current += 1
    return id
  }

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
        const TARGET_WIDTH = 2048
        const TARGET_HEIGHT = 1024
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = TARGET_WIDTH
        canvas.height = TARGET_HEIGHT
        
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT)
        
        const highQualityDataUrl = canvas.toDataURL('image/jpeg', 0.95)
        updateRoom(roomId, { image: highQualityDataUrl })
        
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
      // Keep draw mode active for multiple connections
    }
  }

  const deleteConnection = (connId) => {
    setConnections(connections.filter(c => c.id !== connId))
  }

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

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>360° Virtual Tour${isEditMode ? ' - Edit Mode' : ''}</title>
  <style>
    html, body { height: 100%; margin: 0; overflow: hidden; background: #0b0b0c; }
    #app { position: fixed; inset: 0; }
    canvas { display: block; }
    .hud { position: fixed; left: 12px; bottom: 12px; color: #e6e6e6; font-family: system-ui; }
    .hud .pill { display: inline-block; padding: 8px 12px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(6px); }
    .hud .scene { font-weight: 600; }
    .hud .help { margin-top: 6px; font-size: 12px; opacity: .8; }
    .topright { position: fixed; right: 12px; top: 12px; display: flex; gap: 8px; }
    .btn { padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.14); color: #e6e6e6; background: rgba(255,255,255,.06); cursor: pointer; }
    .btn:hover { background: rgba(255,255,255,.10); }
    .hotspot-hover { cursor: pointer !important; }
    .hotspot-dragging { cursor: move !important; }
    ${isEditMode ? `
    .edit-banner { position: fixed; top: 12px; left: 50%; transform: translateX(-50%); background: rgba(255,165,0,0.9); color: #000; padding: 12px 24px; border-radius: 8px; font-family: system-ui; font-weight: 600; z-index: 1000; }
    .hotspot-selected { filter: drop-shadow(0 0 10px #0ff) !important; }
    .room-indicator { position: fixed; top: 70px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: #fff; padding: 8px 16px; border-radius: 6px; font-family: system-ui; font-size: 14px; z-index: 1000; }
    ` : ''}
  </style>
</head>
<body>
  <div id="app"></div>
  ${isEditMode ? '<div class="edit-banner">🎯 EDIT MODE - Drag hotspots to reposition • Navigate to other rooms to edit their hotspots</div><div class="room-indicator" id="roomIndicator"></div>' : ''}
  <div class="topright">
    <button class="btn" id="resetView">Reset View</button>
    <button class="btn" id="toggleLabels">Toggle Labels</button>
    ${isEditMode ? '<button class="btn" id="savePositions">💾 Save Positions</button>' : ''}
  </div>
  <div class="hud">
    <div class="pill"><span>Room:</span> <span class="scene" id="sceneName">—</span></div>
    <div class="help">${isEditMode ? 'Drag hotspots to move • Right-click to cancel' : 'Drag to look • Click hotspot to move • Pinch/scroll to zoom'}</div>
  </div>

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

    const app = document.querySelector('#app');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    app.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.22;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.5;
    controls.minDistance = 0.1;
    controls.maxDistance = 1.5;
    controls.minPolarAngle = THREE.MathUtils.degToRad(2);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(178);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const SPHERE_RADIUS = 50;
    const sphereGeo = new THREE.SphereGeometry(SPHERE_RADIUS, 64, 64);
    const matA = new THREE.MeshBasicMaterial({ side: THREE.BackSide, transparent: true, opacity: 1 });
    const matB = new THREE.MeshBasicMaterial({ side: THREE.BackSide, transparent: true, opacity: 0 });
    const sphereA = new THREE.Mesh(sphereGeo, matA);
    const sphereB = new THREE.Mesh(sphereGeo, matB);
    scene.add(sphereA, sphereB);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const hotspotGroup = new THREE.Group();
    scene.add(hotspotGroup);

    let labelsVisible = true;
    const textureLoader = new THREE.TextureLoader();
    const textureCache = new Map();

    function loadTexture(url) {
      return new Promise((resolve, reject) => {
        if (textureCache.has(url)) return resolve(textureCache.get(url));
        textureLoader.load(url, tex => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          tex.generateMipmaps = true;
          textureCache.set(url, tex);
          resolve(tex);
        }, undefined, err => reject(err));
      });
    }

    function yawPitchToVec3(yawDeg, pitchDeg, radius = SPHERE_RADIUS - 0.2) {
      const yaw = THREE.MathUtils.degToRad(yawDeg);
      const pitch = THREE.MathUtils.degToRad(pitchDeg);
      const x = Math.sin(yaw) * Math.cos(pitch) * radius;
      const y = Math.sin(pitch) * radius;
      const z = -Math.cos(yaw) * Math.cos(pitch) * radius;
      return new THREE.Vector3(x, y, z);
    }

    function makeCircleTexture() {
      const s = 128;
      const c = document.createElement('canvas');
      c.width = c.height = s;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, s, s);
      ctx.beginPath();
      ctx.arc(s/2, s/2, s*0.34, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(80,160,255,0.9)';
      ctx.stroke();
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    function makeLabelTexture(text) {
      const padX = 24, padY = 12;
      const font = '500 32px system-ui';
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      ctx.font = font;
      const metrics = ctx.measureText(text);
      const w = Math.ceil(metrics.width) + padX * 2;
      const h = 48 + padY * 2;
      c.width = w; c.height = h;
      ctx.font = font;
      ctx.fillStyle = 'rgba(20,20,24,0.7)';
      ctx.beginPath();
      const r = 18;
      ctx.moveTo(0+r, 0);
      ctx.arcTo(w, 0, w, h, r);
      ctx.arcTo(w, h, 0, h, r);
      ctx.arcTo(0, h, 0, 0, r);
      ctx.arcTo(0, 0, w, 0, r);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#eaeaea';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, padX, h/2);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = false;
      return tex;
    }

    function makeHotspot(labelText = '') {
      const group = new THREE.Group();
      const dotMat = new THREE.SpriteMaterial({ map: makeCircleTexture(), depthTest: true, depthWrite: false, opacity: 0.95 });
      const dot = new THREE.Sprite(dotMat);
      dot.scale.set(1.2, 1.2, 1.2);
      group.add(dot);
      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 1.2),
        new THREE.MeshBasicMaterial({ map: makeLabelTexture(labelText), transparent: true })
      );
      label.position.set(0, -2.2, 0);
      label.renderOrder = 999;
      group.add(label);
      group.userData = { isHotspot: true, labelMesh: label };
      return group;
    }

    function buildHotspots(sceneKey) {
      hotspotGroup.clear();
      currentSceneKey = sceneKey;
      const def = SCENES[sceneKey];
      if (!def?.hotspots) return;
      for (const h of def.hotspots) {
        const hs = makeHotspot(h.label);
        const pos = yawPitchToVec3(h.yaw, h.pitch);
        hs.position.copy(pos);
        hs.lookAt(0, 0, 0);
        hs.userData.target = h.target;
        hs.userData.labelText = h.label;
        hs.userData.yaw = h.yaw;
        hs.userData.pitch = h.pitch;
        hs.userData.hotspotId = h.id;
        hs.userData.targetId = h.targetId;
        hotspotGroup.add(hs);
        
        if (EDIT_MODE) {
          if (!hotspotPositions[sceneKey]) hotspotPositions[sceneKey] = {};
          hotspotPositions[sceneKey][h.id] = { yaw: h.yaw, pitch: h.pitch, targetId: h.targetId };
        }
      }
      setLabelsVisible(labelsVisible);
    }

    function setLabelsVisible(on) {
      hotspotGroup.traverse(obj => {
        if (obj.isMesh && obj.userData && obj.parent?.userData?.isHotspot) {
          obj.visible = on;
        }
      });
    }

    const sceneNameEl = document.getElementById('sceneName');
    function setSceneName(name) { 
      sceneNameEl.textContent = name || '—'; 
      
      if (EDIT_MODE) {
        const roomIndicator = document.getElementById('roomIndicator');
        if (roomIndicator) {
          const sceneData = SCENES[currentSceneKey];
          const isEditingThisRoom = sceneData?.roomId === EDITING_ROOM_ID;
          roomIndicator.textContent = isEditingThisRoom ? 
            'Editing: ' + name : 
            'Viewing: ' + name + ' (click hotspots to navigate)';
          roomIndicator.style.background = isEditingThisRoom ? 
            'rgba(255,165,0,0.9)' : 
            'rgba(0,0,0,0.7)';
          roomIndicator.style.color = isEditingThisRoom ? '#000' : '#fff';
        }
      }
    }

    let activeOnA = true;
    let isFading = false;
    async function switchScene(sceneKey, options = { fadeMs: 600 }) {
      const def = SCENES[sceneKey];
      if (!def) return;
      try {
        const tex = await loadTexture(def.image);
        setSceneName(def.name);
        buildHotspots(sceneKey);
        if (activeOnA) {
          matB.map = tex; matB.needsUpdate = true;
        } else {
          matA.map = tex; matA.needsUpdate = true;
        }
        isFading = true;
        const t0 = performance.now();
        const dur = options.fadeMs ?? 600;
        function step(now) {
          const k = Math.min(1, (now - t0) / dur);
          if (activeOnA) { matA.opacity = 1 - k; matB.opacity = k; }
          else { matA.opacity = k; matB.opacity = 1 - k; }
          if (k < 1) requestAnimationFrame(step);
          else {
            activeOnA = !activeOnA;
            if (activeOnA) { matB.opacity = 0; }
            else { matA.opacity = 0; }
            isFading = false;
          }
        }
        requestAnimationFrame(step);
      } catch (e) {
        console.error('Failed to load texture', e);
      }
    }

    function updateHoverCursor(clientX, clientY) {
      pointer.x = (clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hotspotGroup.children, true);
      if (hits.some(h => h.object?.parent?.userData?.isHotspot)) {
        renderer.domElement.classList.add('hotspot-hover');
      } else {
        renderer.domElement.classList.remove('hotspot-hover');
      }
    }

    function handleSelect(clientX, clientY) {
      if (isFading) return;
      pointer.x = (clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hotspotGroup.children, true);
      const hit = hits.find(h => h.object?.parent?.userData?.isHotspot);
      if (hit) {
        const group = hit.object.parent;
        
        if (EDIT_MODE) {
          selectedHotspot = group;
          isDraggingHotspot = true;
          renderer.domElement.classList.add('hotspot-dragging');
          controls.enabled = false;
          
          hotspotGroup.children.forEach(h => {
            h.children[0].material.opacity = h === group ? 1 : 0.5;
          });
        } else {
          switchScene(group.userData.target);
        }
      }
    }

    // Edit mode drag logic
    if (EDIT_MODE) {
      function onMouseMove(e) {
        if (!isDraggingHotspot || !selectedHotspot) return;
        
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        
        const intersects = raycaster.intersectObject(sphereA);
        if (intersects.length > 0) {
          const point = intersects[0].point.clone().normalize().multiplyScalar(SPHERE_RADIUS - 0.2);
          selectedHotspot.position.copy(point);
          selectedHotspot.lookAt(0, 0, 0);
          
          // Calculate yaw and pitch
          const yaw = Math.atan2(point.x, -point.z) * (180 / Math.PI);
          const pitch = Math.asin(point.y / point.length()) * (180 / Math.PI);
          
          selectedHotspot.userData.yaw = yaw;
          selectedHotspot.userData.pitch = pitch;
          
          // Update stored positions
          const sceneKey = currentSceneKey;
          const hotspotId = selectedHotspot.userData.hotspotId;
          if (!hotspotPositions[sceneKey]) hotspotPositions[sceneKey] = {};
          hotspotPositions[sceneKey][hotspotId] = {
            yaw: yaw,
            pitch: pitch,
            targetId: selectedHotspot.userData.targetId
          };
        }
      }

      function onMouseUp() {
        if (isDraggingHotspot) {
          isDraggingHotspot = false;
          renderer.domElement.classList.remove('hotspot-dragging');
          controls.enabled = true;
          
          hotspotGroup.children.forEach(h => {
            h.children[0].material.opacity = 0.95;
          });
          
          selectedHotspot = null;
        }
      }

      renderer.domElement.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('mouseup', onMouseUp);
      
      document.getElementById('savePositions').addEventListener('click', () => {
        window.saveHotspotPositions();
      });
    }

    renderer.domElement.addEventListener('mousemove', (e) => updateHoverCursor(e.clientX, e.clientY));
    renderer.domElement.addEventListener('click', (e) => handleSelect(e.clientX, e.clientY));

    document.getElementById('resetView').addEventListener('click', () => {
      controls.reset();
    });

    document.getElementById('toggleLabels').addEventListener('click', () => {
      labelsVisible = !labelsVisible;
      setLabelsVisible(labelsVisible);
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    switchScene(START_SCENE_KEY, { fadeMs: 0 });

    function render() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    render();
  </script>
</body>
</html>`
  }, [rooms, connections, startRoom])

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

  const handlePreviewTour = () => {
    if (rooms.length === 0) {
      alert('Please add at least one room before previewing')
      return
    }
    const html = generateTourHTML(false)
    setTourPreview(html)
  }

  const handleSave = async (propertyData) => {
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

  return {
    // State
    rooms,
    connections,
    selectedRoom,
    startRoom,
    drawMode,
    fromRoom,
    saving,
    saveStatus,
    tourPreview,
    editMode,
    editingRoomId,
    
    // Methods
    addRoom,
    updateRoom,
    handleImageUpload,
    deleteRoom,
    connectRooms,
    deleteConnection,
    generateTourHTML,
    handleEditHotspot,
    handlePreviewTour,
    handleSave,
    setDrawMode,
    setFromRoom,
    setStartRoom,
    setTourPreview,
    setEditMode,
    setEditingRoomId,
    setRooms,
    setConnections,
    setSaveStatus,
  }
}
