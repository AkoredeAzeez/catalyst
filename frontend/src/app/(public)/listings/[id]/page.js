import dynamic from 'next/dynamic'
const ThreeDViewer = dynamic(() => import('@/components/tours/ThreeDViewer'), { ssr: false })


export default function ListingDetailPage({ params }) {
const modelUrl = `/models/sample.glb`
return (
<div className="container mx-auto p-6 space-y-6">
<h1 className="text-2xl font-bold">Listing #{params.id}</h1>
<ThreeDViewer modelUrl={modelUrl} />
</div>
)
}