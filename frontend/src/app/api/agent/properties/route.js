import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Mock data - replace with actual database query
    const properties = [
      {
        id: 1,
        image: '/prop1.jpg',
        status: 'Occupied',
        price: '3,425',
        title: 'Villa in Yaba, Lagos.',
        address: 'No 2, Allison street, Onike.',
        beds: 6,
        units: 6,
        size: '6'
      },
      {
        id: 2,
        image: '/prop2.jpg',
        status: 'Occupied',
        price: '2,850',
        title: 'Apartment in Lekki Phase 1',
        address: 'No 15, Freedom Way, Lekki.',
        beds: 4,
        units: 4,
        size: '5'
      },
      {
        id: 3,
        image: '/prop3.jpg',
        status: 'Vacant',
        price: '4,200',
        title: 'Duplex in Victoria Island',
        address: 'No 5, Ahmadu Bello Way, VI.',
        beds: 8,
        units: 8,
        size: '8'
      },
      {
        id: 4,
        image: '/prop1.jpg',
        status: 'Vacant',
        price: '3,100',
        title: 'Penthouse in Ikoyi',
        address: 'No 12, Bourdillon Road, Ikoyi.',
        beds: 5,
        units: 5,
        size: '7'
      },
      {
        id: 5,
        image: '/prop2.jpg',
        status: 'Occupied',
        price: '2,650',
        title: 'Townhouse in Gbagada',
        address: 'No 8, Ifako Street, Gbagada.',
        beds: 4,
        units: 4,
        size: '5'
      },
      {
        id: 6,
        image: '/prop3.jpg',
        status: 'Occupied',
        price: '3,950',
        title: 'Mansion in Banana Island',
        address: 'No 3, Ocean Parade, Banana Island.',
        beds: 10,
        units: 10,
        size: '12'
      },
      {
        id: 7,
        image: '/prop1.jpg',
        status: 'Vacant',
        price: '2,200',
        title: 'Flat in Surulere',
        address: 'No 45, Adeniran Ogunsanya, Surulere.',
        beds: 3,
        units: 3,
        size: '4'
      },
      {
        id: 8,
        image: '/prop2.jpg',
        status: 'Occupied',
        price: '3,750',
        title: 'Estate House in Ajah',
        address: 'No 22, Lekki-Epe Expressway, Ajah.',
        beds: 6,
        units: 6,
        size: '7'
      },
      {
        id: 9,
        image: '/prop3.jpg',
        status: 'Vacant',
        price: '2,950',
        title: 'Bungalow in Ikeja',
        address: 'No 18, Allen Avenue, Ikeja.',
        beds: 4,
        units: 4,
        size: '5'
      },
      {
        id: 10,
        image: '/prop1.jpg',
        status: 'Occupied',
        price: '4,500',
        title: 'Luxury Villa in Ikoyi',
        address: 'No 7, Kingsway Road, Ikoyi.',
        beds: 9,
        units: 9,
        size: '10'
      },
      {
        id: 11,
        image: '/prop2.jpg',
        status: 'Vacant',
        price: '3,300',
        title: 'Condo in Maryland',
        address: 'No 33, Mobolaji Bank Anthony Way.',
        beds: 5,
        units: 5,
        size: '6'
      },
      {
        id: 12,
        image: '/prop3.jpg',
        status: 'Occupied',
        price: '2,400',
        title: 'Studio in Yaba',
        address: 'No 21, Herbert Macaulay Way.',
        beds: 2,
        units: 2,
        size: '3'
      },
      {
        id: 13,
        image: '/prop1.jpg',
        status: 'Vacant',
        price: '3,800',
        title: 'Semi-Detached in Lekki',
        address: 'No 9, Admiralty Way, Lekki Phase 1.',
        beds: 6,
        units: 6,
        size: '7'
      },
      {
        id: 14,
        image: '/prop2.jpg',
        status: 'Occupied',
        price: '2,700',
        title: 'Terrace in Magodo',
        address: 'No 14, CMD Road, Magodo.',
        beds: 4,
        units: 4,
        size: '5'
      },
      {
        id: 15,
        image: '/prop3.jpg',
        status: 'Vacant',
        price: '5,200',
        title: 'Executive Mansion in VI',
        address: 'No 1, Adeola Odeku Street, VI.',
        beds: 12,
        units: 12,
        size: '15'
      }
    ]

    return NextResponse.json({
      success: true,
      data: properties
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
