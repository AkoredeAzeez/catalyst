'use client'
import { Canvas } from '@react-three/fiber'
import { useTexture, OrbitControls } from '@react-three/drei'
import { useRef, Suspense, useEffect } from 'react'
import * as THREE from 'three'

function PanoramaScene({ imageUrl }) {
  const texture = useTexture(imageUrl)
  const sphereRef = useRef(null)

  useEffect(() => {
    if (texture) {
      texture.magFilter = THREE.LinearFilter
      texture.minFilter = THREE.LinearMipmapLinearFilter
    }
  }, [texture])

  return (
    <>
      <ambientLight intensity={1} />
      <mesh ref={sphereRef} scale={[-1, 1, 1]}>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial 
          map={texture} 
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI} 
        minPolarAngle={0}
        autoRotateSpeed={0}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
        <p className="text-gray-300 text-sm">Loading panorama...</p>
      </div>
    </div>
  )
}

export default function PanoViewer({ imageUrl }) {
  const canvasRef = useRef(null)

  if (!imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-2xl">
        <p className="text-gray-400">No image selected</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden w-full h-full bg-black relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas 
          ref={canvasRef}
          className="w-full h-full" 
          camera={{ position: [0, 0, 0.1], fov: 60 }}
          gl={{ 
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance'
          }}
          performance={{ min: 0.5 }}
        >
          <PanoramaScene imageUrl={imageUrl} />
        </Canvas>
      </Suspense>
    </div>
  )
}