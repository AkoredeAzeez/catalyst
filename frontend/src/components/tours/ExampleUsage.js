'use client';

import React, { useState, useEffect } from 'react';
import TourViewer from '@/components/tours/TourViewer';

/**
 * Example: Property Listing Page with Virtual Tour
 * This demonstrates how to use the TourViewer component
 */
export default function PropertyDetailPage({ params }) {
  const [tourHtml, setTourHtml] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch tour HTML from API or database
  const loadTour = async (propertyId) => {
    setLoading(true);
    try {
      // Example: Fetch from your API
      const response = await fetch(`/api/tours/${propertyId}`);
      const data = await response.json();
      setTourHtml(data.tourHtml);
    } catch (error) {
      console.error('Failed to load tour:', error);
      alert('Failed to load virtual tour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {showTour && tourHtml ? (
        // Full-screen tour viewer
        <TourViewer 
          tourHtml={tourHtml}
          onClose={() => setShowTour(false)}
          closeButtonText="← Back to Property"
        />
      ) : (
        // Property details page
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-gray-800 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Luxury Apartment - Downtown
            </h1>
            
            <div className="mb-6">
              <img 
                src="/api/placeholder/800/400" 
                alt="Property"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-gray-300">
                <p className="mb-2"><strong>Price:</strong> $500,000</p>
                <p className="mb-2"><strong>Bedrooms:</strong> 3</p>
                <p className="mb-2"><strong>Bathrooms:</strong> 2</p>
                <p className="mb-2"><strong>Area:</strong> 1,500 sq ft</p>
              </div>

              <div>
                <button
                  onClick={() => setShowTour(true)}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : '🔵 View 360° Virtual Tour'}
                </button>
                
                {!tourHtml && (
                  <button
                    onClick={() => loadTour('property-123')}
                    className="w-full mt-3 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Load Tour from Server
                  </button>
                )}
              </div>
            </div>

            <div className="text-gray-300">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="leading-relaxed">
                Beautiful 3-bedroom apartment in the heart of downtown. 
                Modern amenities, stunning views, and premium finishes throughout.
                Take a 360° virtual tour to explore every room!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
