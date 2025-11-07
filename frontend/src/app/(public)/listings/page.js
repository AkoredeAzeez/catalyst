import PropertyCard from '@/components/cards/PropertyCard'


async function getListings() {
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/listings`, { cache: 'no-store' })
return res.json()
}


export default async function ListingsPage() {
const listings = await getListings()
return (
<main className="container mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
{listings.map((p) => (<PropertyCard key={p.id} p={p} />))}
</main>
)
}