'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF } from '@react-three/drei'


function Model({ url }) {
const { scene } = useGLTF(url)
return <primitive object={scene} />
}


export default function ThreeDViewer({ modelUrl }) {
return (
<div className="h-[60vh] w-full rounded-2xl overflow-hidden border">
<Canvas camera={{ position: [2, 2, 2], fov: 45 }}>
<ambientLight intensity={0.6} />
<Stage adjustCamera intensity={0.5}>
<Model url={modelUrl} />
</Stage>
<OrbitControls enablePan enableZoom enableRotate />
</Canvas>
</div>
)
}