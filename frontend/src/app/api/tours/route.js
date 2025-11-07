import { NextResponse } from 'next/server';

// TODO: Replace with actual database implementation
// For now, we'll use in-memory storage (will reset on server restart)
let toursStorage = [];

export async function POST(request) {
  try {
    const tourData = await request.json();
    const { propertyId, tourHtml, rooms, connections, startRoom } = tourData;

    // Validate required fields
    if (!tourHtml || !rooms || rooms.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: tourHtml and rooms are required' },
        { status: 400 }
      );
    }

    // Create tour object
    const tour = {
      id: Date.now().toString(),
      propertyId: propertyId || null,
      tourHtml,
      rooms,
      connections: connections || [],
      startRoom: startRoom || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TODO: Save to your database
    // Example:
    // const result = await db.tours.create(tour);

    // For now, store in memory (updates existing tour for same property)
    const existingIndex = toursStorage.findIndex(t => t.propertyId === propertyId);
    if (existingIndex >= 0 && propertyId) {
      toursStorage[existingIndex] = tour;
    } else {
      toursStorage.push(tour);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Tour saved successfully',
      tourId: tour.id,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    // TODO: Fetch tours from your database
    // const tours = await db.tours.findMany();

    if (propertyId) {
      // Get tour for specific property
      const tour = toursStorage.find(t => t.propertyId === propertyId);
      if (!tour) {
        return NextResponse.json(
          { success: false, error: 'Tour not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ 
        success: true,
        tour,
      });
    }
    
    // Return all tours (for now, return empty array)
    return NextResponse.json({ 
      success: true,
      tours: toursStorage.map(t => ({
        id: t.id,
        propertyId: t.propertyId,
        roomCount: t.rooms.length,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
