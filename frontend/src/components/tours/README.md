# Virtual Tour Components

## Overview
Reusable components for creating and displaying 360° virtual tours in your Next.js application.

---

## Components

### 1. `TourViewer`
**Location:** `src/components/tours/TourViewer.js`

A reusable component for displaying 360° virtual tours anywhere in your application.

#### Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tourHtml` | string | Yes | - | Complete HTML string of the tour |
| `onClose` | function | No | undefined | Callback when close button is clicked |
| `showCloseButton` | boolean | No | true | Whether to show the close button |
| `closeButtonText` | string | No | "← Back" | Text for the close button |

#### Basic Usage
```jsx
import TourViewer from '@/components/tours/TourViewer';

function MyPage() {
  const [showTour, setShowTour] = useState(false);
  const tourHtml = "<html>...</html>"; // Your tour HTML

  return showTour ? (
    <TourViewer 
      tourHtml={tourHtml}
      onClose={() => setShowTour(false)}
    />
  ) : (
    <button onClick={() => setShowTour(true)}>View Tour</button>
  );
}
```

#### Advanced Usage
```jsx
// Without close button (embedded view)
<TourViewer 
  tourHtml={tourHtml}
  showCloseButton={false}
/>

// Custom close button text
<TourViewer 
  tourHtml={tourHtml}
  onClose={handleClose}
  closeButtonText="← Back to Listing"
/>
```

---

### 2. `TourBuilder`
**Location:** `src/components/tours/TourBuilder.js`

Admin interface for creating virtual tours with drag-and-drop room connections.

#### Features
- ✅ Add/edit/delete rooms
- ✅ Upload 360° images
- ✅ Connect rooms visually
- ✅ Set start room
- ✅ Generate standalone HTML
- ✅ Preview and download tours

#### Usage
Already integrated in admin dashboard at:
`/dashboard/admin/tour-builder`

---

## Use Cases

### 1. Property Listing Page
Display virtual tour for a specific property:

```jsx
'use client';
import { useState } from 'react';
import TourViewer from '@/components/tours/TourViewer';

export default function PropertyPage({ propertyId }) {
  const [showTour, setShowTour] = useState(false);
  const [tourHtml, setTourHtml] = useState(null);

  const loadTour = async () => {
    const res = await fetch(`/api/properties/${propertyId}/tour`);
    const data = await res.json();
    setTourHtml(data.html);
    setShowTour(true);
  };

  return (
    <>
      {showTour && tourHtml ? (
        <TourViewer 
          tourHtml={tourHtml}
          onClose={() => setShowTour(false)}
        />
      ) : (
        <button onClick={loadTour}>View Virtual Tour</button>
      )}
    </>
  );
}
```

### 2. Embedded Tour Preview
Show tour in a smaller container:

```jsx
<div className="w-full h-96 overflow-hidden rounded-lg">
  <TourViewer 
    tourHtml={tourHtml}
    showCloseButton={false}
  />
</div>
```

### 3. Investor Dashboard
Display multiple property tours:

```jsx
function InvestorPortfolio({ properties }) {
  const [selectedTour, setSelectedTour] = useState(null);

  return (
    <>
      {selectedTour ? (
        <TourViewer 
          tourHtml={selectedTour.html}
          onClose={() => setSelectedTour(null)}
          closeButtonText="← Back to Portfolio"
        />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {properties.map(prop => (
            <div key={prop.id}>
              <h3>{prop.name}</h3>
              <button onClick={() => setSelectedTour(prop)}>
                View Tour
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
```

---

## API Integration

### Save Tour to Database
```javascript
// POST /api/tours
await fetch('/api/tours', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    propertyId: '123',
    tourHtml: generatedHtml,
    name: 'Luxury Apartment Tour'
  })
});
```

### Load Tour from Database
```javascript
// GET /api/tours/:propertyId
const response = await fetch(`/api/tours/${propertyId}`);
const { tourHtml } = await response.json();
```

---

## File Structure
```
src/components/tours/
├── TourViewer.js      # Reusable tour display component
├── TourBuilder.js     # Admin tour creation interface
├── ExampleUsage.js    # Usage examples
└── README.md          # This file
```

---

## Notes

### Image Format
- Use **equirectangular 360° images** (2:1 aspect ratio)
- Supported formats: JPG, PNG
- Images are base64-encoded in generated HTML
- Recommended resolution: 4096x2048 or higher

### Performance
- Generated tours are standalone HTML files
- No external dependencies needed (uses CDN)
- Base64 encoding increases file size
- Consider lazy loading for multiple tours

### Browser Support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires JavaScript enabled
- WebGL support required

---

## Examples

See `ExampleUsage.js` for complete working examples.
