'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Trash2, ArrowRight, Eye } from 'lucide-react';
import TourViewer from './TourViewer';

export default function TourBuilder() {
  const [rooms, setRooms] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [startRoom, setStartRoom] = useState(null);
  const [drawMode, setDrawMode] = useState(false);
  const [fromRoom, setFromRoom] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', or null
  const [tourPreview, setTourPreview] = useState(null); // For preview mode
  const [editMode, setEditMode] = useState(false); // For hotspot editing
  const [editingRoomId, setEditingRoomId] = useState(null); // Which room we're editing hotspots for
  const idCounter = useRef(1);

  // Generate unique ID
  const generateId = () => {
    const id = idCounter.current;
    idCounter.current += 1;
    return id;
  };

  // Add a new room
  const addRoom = () => {
    const newRoom = {
      id: generateId(),
      name: `Room ${rooms.length + 1}`,
      image: null,
      hotspots: [],
    };
    setRooms([...rooms, newRoom]);
  };

  // Update room
  const updateRoom = (id, updates) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  // Handle image upload
  const handleImageUpload = (roomId, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateRoom(roomId, { image: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  // Delete room
  const deleteRoom = (id) => {
    setRooms(rooms.filter(r => r.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
    if (startRoom === id) setStartRoom(null);
  };

  // Connect rooms
  const connectRooms = (roomId) => {
    if (!drawMode) return;
    
    if (!fromRoom) {
      setFromRoom(roomId);
    } else if (fromRoom !== roomId) {
      const exists = connections.some(
        c => (c.from === fromRoom && c.to === roomId) ||
             (c.from === roomId && c.to === fromRoom)
      );

      if (!exists) {
        setConnections([
          ...connections,
          {
            id: generateId(),
            from: fromRoom,
            to: roomId,
            label: '',
          },
        ]);
      }
      setFromRoom(null);
    }
  };

  // Delete connection
  const deleteConnection = (connId) => {
    setConnections(connections.filter(c => c.id !== connId));
  };

  // Generate tour HTML
  const generateTourHTML = useCallback((isEditMode = false) => {
    const roomMap = {};
    rooms.forEach(room => {
      roomMap[room.id] = room;
    });

    const sceneConfig = {};
    rooms.forEach(room => {
      const roomConnections = connections.filter(c => c.from === room.id || c.to === room.id);
      const hotspots = [];

      roomConnections.forEach((conn, idx) => {
        const targetId = conn.from === room.id ? conn.to : conn.from;
        const targetRoom = roomMap[targetId];
        
        // Use stored hotspot positions if they exist
        const storedHotspot = room.hotspots?.find(h => h.targetId === targetId);
        
        hotspots.push({
          id: `to${targetRoom.name.replace(/\s+/g, '')}${idx}`,
          label: `To ${targetRoom.name}`,
          yaw: storedHotspot?.yaw ?? (idx * 90) % 360,
          pitch: storedHotspot?.pitch ?? -2,
          target: targetRoom.name.toLowerCase().replace(/\s+/g, '_'),
          targetId: targetId, // Store the target room ID for reference
        });
      });

      sceneConfig[room.name.toLowerCase().replace(/\s+/g, '_')] = {
        name: room.name,
        image: room.image,
        hotspots: hotspots,
        roomId: room.id, // Add room ID for edit mode
      };
    });

    const startKey = startRoom ? rooms.find(r => r.id === startRoom)?.name.toLowerCase().replace(/\s+/g, '_') : Object.keys(sceneConfig)[0];

    // Build SCENES object as string to properly handle base64 images
    const scenesEntries = Object.entries(sceneConfig).map(([key, val]) => {
      const safeImage = (val.image || '').replace(/'/g, "\\'");
      const hotspotsJson = JSON.stringify(val.hotspots);
      return `'${key}': { name: '${val.name}', image: '${safeImage}', hotspots: ${hotspotsJson} }`;
    }).join(',\n      ');

    const editModeScript = isEditMode ? `
    const EDIT_MODE = true;
    const hotspotPositions = {};
    let selectedHotspot = null;
    let isDraggingHotspot = false;
    
    window.saveHotspotPositions = function() {
      window.parent.postMessage({ type: 'HOTSPOT_POSITIONS', data: hotspotPositions }, '*');
    };
    ` : 'const EDIT_MODE = false;';

    const htmlTemplate = `<!DOCTYPE html>
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
    ` : ''}
  </style>
</head>
<body>
  <div id="app"></div>
  ${isEditMode ? '<div class="edit-banner">🎯 EDIT MODE - Drag hotspots to reposition them</div>' : ''}
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
          tex.minFilter = THREE.LinearFilter;
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
          // Store initial position for edit mode
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
    function setSceneName(name) { sceneNameEl.textContent = name || '—'; }

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
          // In edit mode, select hotspot for dragging
          selectedHotspot = group;
          isDraggingHotspot = true;
          renderer.domElement.classList.add('hotspot-dragging');
          controls.enabled = false;
          
          // Highlight selected hotspot
          hotspotGroup.children.forEach(h => {
            h.children[0].material.opacity = h === group ? 1 : 0.5;
          });
        } else {
          // Normal mode: navigate to target scene
          const targetKey = group.userData.target;
          if (targetKey && SCENES[targetKey]) switchScene(targetKey);
        }
      }
    }
    
    function vec3ToYawPitch(vec) {
      const r = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
      const pitch = Math.asin(vec.y / r) * 180 / Math.PI;
      const yaw = Math.atan2(vec.x, -vec.z) * 180 / Math.PI;
      return { yaw, pitch };
    }
    
    function handleHotspotDrag(clientX, clientY) {
      if (!EDIT_MODE || !isDraggingHotspot || !selectedHotspot) return;
      
      pointer.x = (clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      
      // Cast ray to sphere surface
      const sphere = scene.children.find(c => c.geometry?.type === 'SphereGeometry');
      if (!sphere) return;
      
      const intersects = raycaster.intersectObject(sphere);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const { yaw, pitch } = vec3ToYawPitch(point);
        
        // Update hotspot position
        const newPos = yawPitchToVec3(yaw, pitch);
        selectedHotspot.position.copy(newPos);
        selectedHotspot.lookAt(0, 0, 0);
        
        // Store updated position
        selectedHotspot.userData.yaw = yaw;
        selectedHotspot.userData.pitch = pitch;
        
        const hotspotId = selectedHotspot.userData.hotspotId;
        if (!hotspotPositions[currentSceneKey]) hotspotPositions[currentSceneKey] = {};
        hotspotPositions[currentSceneKey][hotspotId] = { 
          yaw, 
          pitch, 
          targetId: selectedHotspot.userData.targetId 
        };
      }
    }
    
    function handleDragEnd() {
      if (EDIT_MODE && isDraggingHotspot) {
        isDraggingHotspot = false;
        renderer.domElement.classList.remove('hotspot-dragging');
        controls.enabled = true;
        
        // Reset opacity for all hotspots
        hotspotGroup.children.forEach(h => {
          h.children[0].material.opacity = 0.95;
        });
        
        selectedHotspot = null;
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    renderer.domElement.addEventListener('mousemove', e => {
      updateHoverCursor(e.clientX, e.clientY);
      if (EDIT_MODE) handleHotspotDrag(e.clientX, e.clientY);
    });
    renderer.domElement.addEventListener('click', e => handleSelect(e.clientX, e.clientY));
    renderer.domElement.addEventListener('mouseup', () => handleDragEnd());
    renderer.domElement.addEventListener('contextmenu', (e) => {
      if (EDIT_MODE) {
        e.preventDefault();
        handleDragEnd();
      }
    });
    renderer.domElement.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        updateHoverCursor(t.clientX, t.clientY);
      }
    }, { passive: true });
    renderer.domElement.addEventListener('touchmove', e => {
      if (EDIT_MODE && e.touches.length === 1) {
        const t = e.touches[0];
        handleHotspotDrag(t.clientX, t.clientY);
      }
    }, { passive: true });
    renderer.domElement.addEventListener('touchend', () => handleDragEnd());

    document.getElementById('resetView').addEventListener('click', () => {
      controls.reset();
      controls.target.set(0, 0, 0);
      camera.position.set(0, 0, 0.1);
      controls.update();
    });

    document.getElementById('toggleLabels').addEventListener('click', () => {
      labelsVisible = !labelsVisible;
      setLabelsVisible(labelsVisible);
    });
    
    if (EDIT_MODE) {
      document.getElementById('savePositions')?.addEventListener('click', () => {
        window.saveHotspotPositions();
      });
    }

    (async function init() {
      const blackTex = new THREE.DataTexture(new Uint8Array([0,0,0]), 1, 1);
      blackTex.needsUpdate = true;
      matA.map = blackTex; matA.needsUpdate = true; matA.opacity = 1;
      matB.opacity = 0;
      await switchScene(START_SCENE_KEY, { fadeMs: 400 });
      animate();
    })();
  </script>
</body>
</html>`;

    return htmlTemplate;
  }, [rooms, connections, startRoom]);

  // Save tour to database/API
  const saveTour = useCallback(async (propertyId = null) => {
    if (rooms.length === 0) {
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      const tourHtml = generateTourHTML();
      const tourData = {
        propertyId,
        tourHtml,
        rooms,
        connections,
        startRoom,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourData),
      });

      if (!response.ok) {
        throw new Error('Failed to save tour');
      }

      const result = await response.json();
      setSaveStatus('success');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
      
      return result;
    } catch (error) {
      console.error('Error saving tour:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }, [rooms, connections, startRoom, generateTourHTML]);

  // Auto-save whenever rooms or connections change
  useEffect(() => {
    if (rooms.length > 0) {
      const timeoutId = setTimeout(() => {
        saveTour();
      }, 2000); // Auto-save 2 seconds after last change

      return () => clearTimeout(timeoutId);
    }
  }, [rooms, connections, startRoom, saveTour]);

  // Preview tour
  const previewTour = () => {
    if (rooms.length === 0) {
      alert('Please add at least one room before previewing');
      return;
    }
    const html = generateTourHTML(false);
    setTourPreview(html);
  };

  // Edit hotspots mode
  const editHotspots = (roomId) => {
    if (rooms.length === 0) {
      alert('Please add at least one room');
      return;
    }
    setEditingRoomId(roomId);
    setEditMode(true);
    const html = generateTourHTML(true);
    setTourPreview(html);
  };

  // Handle hotspot position updates from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'HOTSPOT_POSITIONS') {
        const positions = event.data.data;
        
        // Update rooms with new hotspot positions
        setRooms(prevRooms => prevRooms.map(room => {
          const roomKey = room.name.toLowerCase().replace(/\s+/g, '_');
          const roomPositions = positions[roomKey];
          
          if (roomPositions) {
            // Convert hotspot positions to array format
            const updatedHotspots = Object.entries(roomPositions).map(([hotspotId, pos]) => ({
              targetId: pos.targetId,
              yaw: pos.yaw,
              pitch: pos.pitch,
            }));
            
            return { ...room, hotspots: updatedHotspots };
          }
          return room;
        }));
        
        // Close edit mode and show success
        setTourPreview(null);
        setEditMode(false);
        setEditingRoomId(null);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // If in preview mode, show TourViewer
  if (tourPreview) {
    return (
      <TourViewer 
        tourHtml={tourPreview}
        onClose={() => {
          setTourPreview(null);
          setEditMode(false);
          setEditingRoomId(null);
        }}
        closeButtonText={editMode ? "💾 Save & Close" : "← Back to Editor"}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Virtual Tour Builder</h1>
            {saveStatus && (
              <p className={`text-sm mt-2 ${
                saveStatus === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {saveStatus === 'success' ? '✓ Auto-saved successfully' : '✗ Save failed - please try again'}
              </p>
            )}
            {saving && (
              <p className="text-sm mt-2 text-blue-400">💾 Saving...</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={addRoom}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={18} /> Add Room
            </button>
            <button
              onClick={() => setDrawMode(!drawMode)}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                drawMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <ArrowRight size={18} /> {drawMode ? 'Drawing Mode' : 'Draw Mode'}
            </button>
            <button
              onClick={previewTour}
              disabled={rooms.length === 0}
              className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye size={18} /> Preview Tour
            </button>
            <button
              onClick={() => saveTour()}
              disabled={saving || rooms.length === 0}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💾 Save Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rooms List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map(room => (
                  <div
                    key={room.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                      selectedRoom?.id === room.id
                        ? 'border-blue-500 bg-gray-700'
                        : 'border-gray-600 bg-gray-750 hover:border-gray-500'
                    } ${drawMode && fromRoom === room.id ? 'ring-2 ring-green-500' : ''}`}
                    onClick={() => {
                      if (drawMode) {
                        connectRooms(room.id);
                      } else {
                        setSelectedRoom(room);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{room.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRoom(room.id);
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {room.image ? (
                      <img src={room.image} alt={room.name} className="w-full h-32 object-cover rounded mb-2" />
                    ) : (
                      <div className="w-full h-32 bg-gray-600 rounded mb-2 flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStartRoom(room.id);
                      }}
                      className={`w-full py-1 rounded text-sm mb-2 ${
                        startRoom === room.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      {startRoom === room.id ? '★ Start Room' : 'Set as Start'}
                    </button>
                    {room.image && connections.some(c => c.from === room.id || c.to === room.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editHotspots(room.id);
                        }}
                        className="w-full py-1 rounded text-sm bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        🎯 Edit Hotspots
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Connections */}
            {connections.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Connections</h2>
                <div className="space-y-2">
                  {connections.map(conn => {
                    const fromRoom = rooms.find(r => r.id === conn.from);
                    const toRoom = rooms.find(r => r.id === conn.to);
                    return (
                      <div key={conn.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <span>
                          {fromRoom?.name} ↔ {toRoom?.name}
                        </span>
                        <button
                          onClick={() => deleteConnection(conn.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Room Editor */}
          {selectedRoom && !drawMode && (
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Edit Room</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Room Name</label>
                  <input
                    type="text"
                    value={selectedRoom.name}
                    onChange={(e) => {
                      updateRoom(selectedRoom.id, { name: e.target.value });
                      setSelectedRoom({ ...selectedRoom, name: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Upload 360° Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(selectedRoom.id, e.target.files[0]);
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600"
                  />
                </div>
                {selectedRoom.image && (
                  <img src={selectedRoom.image} alt="preview" className="w-full h-40 object-cover rounded" />
                )}
                <div className="text-xs text-gray-400 p-3 bg-gray-700 rounded">
                  <p className="font-semibold mb-2">Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Rename your room</li>
                    <li>Upload 360° equirectangular image</li>
                    <li>Enable &quot;Draw Mode&quot; to connect rooms</li>
                    <li>Click this room, then another to connect</li>
                    <li>Set a start room before generating</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {drawMode && (
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Draw Mode Active</h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-300">
                  {fromRoom 
                    ? '✅ First room selected. Click another room to connect.'
                    : 'Click a room to start connecting.'}
                </p>
                <button
                  onClick={() => {
                    setDrawMode(false);
                    setFromRoom(null);
                  }}
                  className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                  Exit Draw Mode
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}