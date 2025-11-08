'use client';

import React from 'react';

/**
 * TourViewer - Reusable component for displaying 360° virtual tours
 * @param {string} tourHtml - The complete HTML string of the tour
 * @param {function} onClose - Optional callback when close button is clicked
 * @param {boolean} showCloseButton - Whether to show the close button (default: true)
 * @param {string} closeButtonText - Text for the close button (default: "Back")
 */
export default function TourViewer({ 
  tourHtml, 
  onClose, 
  showCloseButton = true,
  closeButtonText = 'Back'
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
          className="fixed top-4 left-4 z-50 px-6 py-2.5 bg-[#16A34A] rounded-lg hover:bg-[#15803d] text-white shadow-lg transition-colors font-semibold flex items-center gap-2"
          style={{
            fontFamily: 'Montserrat',
            fontWeight: 600,
            fontSize: '14px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
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
