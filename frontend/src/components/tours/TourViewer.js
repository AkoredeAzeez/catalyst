'use client';

import React from 'react';

/**
 * TourViewer - Reusable component for displaying 360° virtual tours
 * @param {string} tourHtml - The complete HTML string of the tour
 * @param {function} onClose - Optional callback when close button is clicked
 * @param {boolean} showCloseButton - Whether to show the close button (default: true)
 * @param {string} closeButtonText - Text for the close button (default: "← Back")
 */
export default function TourViewer({ 
  tourHtml, 
  onClose, 
  showCloseButton = true,
  closeButtonText = '← Back'
}) {
  if (!tourHtml) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-xl mb-2">No tour available</p>
          <p className="text-sm">Tour HTML is required to display the viewer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black relative">
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white shadow-lg transition"
        >
          {closeButtonText}
        </button>
      )}
      <iframe
        srcDoc={tourHtml}
        className="w-full h-full border-none"
        title="Virtual Tour"
        allowFullScreen
      />
    </div>
  );
}
