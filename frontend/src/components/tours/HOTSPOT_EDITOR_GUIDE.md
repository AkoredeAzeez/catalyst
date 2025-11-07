# Hotspot Editor - Usage Guide

## 🎯 New Feature: Interactive Hotspot Positioning

You can now drag and drop hotspots to position them exactly where you want in your 360° virtual tour!

---

## How to Use

### Step 1: Create Your Tour Structure
1. **Add Rooms** - Click "Add Room" button
2. **Upload 360° Images** - Select each room and upload its panoramic image
3. **Connect Rooms** - Enable "Draw Mode" and click rooms to connect them
4. **Set Start Room** - Choose which room the tour starts in

### Step 2: Position Hotspots
1. Find a room card that has:
   - ✅ An uploaded image
   - ✅ At least one connection to another room
2. Click the **"🎯 Edit Hotspots"** button on that room card
3. You'll enter **Edit Mode** with an orange banner at the top

### Step 3: Drag Hotspots
**In Edit Mode:**
- 🖱️ **Click and drag** any hotspot to reposition it
- 🔄 **Look around** by dragging empty space (when not on a hotspot)
- 🎨 **Selected hotspot** becomes brighter while dragging
- ❌ **Right-click** or **ESC** to cancel dragging
- 📱 **Touch devices** - tap and drag hotspots

### Step 4: Save Positions
- Click **"💾 Save Positions"** button (top right) when done
- Or click **"💾 Save & Close"** (top left) to save and exit
- Hotspot positions are automatically saved to the room data

---

## Visual Indicators

### Edit Mode Active
```
🎯 EDIT MODE - Drag hotspots to reposition them
```
Orange banner appears at top of screen

### Hotspot States
- **Normal** - White circular hotspot with label
- **Hovered** - Cursor changes to pointer
- **Selected** - Brighter glow while dragging
- **Dragging** - Cursor changes to move icon

---

## Tips & Best Practices

### ✅ Do's
- **Test first** - Preview the tour to see default hotspot positions
- **Strategic placement** - Put hotspots near actual doors/openings in the image
- **Eye level** - Keep hotspots at viewer eye level (pitch around -2 to 2)
- **Clear view** - Position hotspots away from objects that might obscure them
- **Save often** - Click save positions after adjusting each room

### ❌ Don'ts
- Don't place hotspots too high (pitch > 45°) or too low (pitch < -45°)
- Don't overlap multiple hotspots in same location
- Don't forget to save before closing edit mode
- Don't place hotspots behind viewer (yaw 180° from entry point)

---

## Hotspot Positioning Guide

### Yaw (Horizontal Angle)
- `0°` - Directly in front
- `90°` - To the right
- `180°` - Behind
- `270°` / `-90°` - To the left

### Pitch (Vertical Angle)
- `0°` - Eye level (horizon)
- `-30°` - Looking down (floor)
- `+30°` - Looking up (ceiling)

**Default:** Hotspots are automatically placed at 90° intervals around the viewer at -2° pitch (slightly below eye level)

---

## Workflow Example

### Creating a 3-Room Tour

1. **Add Rooms:**
   - Living Room
   - Kitchen  
   - Bedroom

2. **Upload Images:**
   - Upload 360° panorama for each room

3. **Connect Rooms:**
   - Enable Draw Mode
   - Click Living Room → Kitchen
   - Click Living Room → Bedroom
   - Click Kitchen → Bedroom

4. **Edit Hotspots:**
   - **Living Room:** Click "Edit Hotspots"
     - Drag "To Kitchen" hotspot to kitchen doorway
     - Drag "To Bedroom" hotspot to hallway entrance
     - Save positions
   - **Kitchen:** Click "Edit Hotspots"
     - Position hotspots at doorways
     - Save positions
   - **Bedroom:** Click "Edit Hotspots"
     - Position hotspot at door
     - Save positions

5. **Test Tour:**
   - Click "Preview Tour"
   - Navigate through rooms
   - Verify hotspot positions

6. **Auto-Save:**
   - Tour automatically saves 2 seconds after changes

---

## Keyboard & Mouse Controls

### Edit Mode
| Action | Control |
|--------|---------|
| Select hotspot | Left-click on hotspot |
| Drag hotspot | Click and hold, then move mouse |
| Release hotspot | Release left mouse button |
| Cancel drag | Right-click or ESC |
| Rotate view | Drag on empty space |
| Zoom | Mouse wheel / Pinch |
| Reset view | Click "Reset View" button |
| Save positions | Click "💾 Save Positions" |

### Preview Mode (Normal)
| Action | Control |
|--------|---------|
| Navigate to room | Click hotspot |
| Look around | Drag |
| Zoom | Mouse wheel / Pinch |
| Toggle labels | Click "Toggle Labels" |
| Reset view | Click "Reset View" |

---

## Troubleshooting

### "🎯 Edit Hotspots" button not showing
- ✅ Ensure room has an uploaded 360° image
- ✅ Ensure room has at least one connection to another room
- ✅ Check you're not in Draw Mode

### Hotspot won't drag
- Right-click to cancel any active drag
- Refresh the page and try again
- Make sure you're clicking directly on the hotspot circle

### Positions not saving
- Click "💾 Save Positions" button before closing
- Or click "💾 Save & Close" button
- Check browser console for errors

### Hotspot disappeared
- Click "Toggle Labels" to show/hide labels
- Check pitch angle isn't extreme (> 80° or < -80°)
- Zoom out if too close

---

## Technical Details

### Data Structure
Hotspot positions are stored in each room object:
```javascript
room: {
  id: 1,
  name: "Living Room",
  image: "data:image/jpeg;base64...",
  hotspots: [
    { targetId: 2, yaw: 45, pitch: -2 },   // To Kitchen
    { targetId: 3, yaw: -120, pitch: -1 }  // To Bedroom
  ]
}
```

### Coordinate System
- Uses spherical coordinates (yaw, pitch)
- Yaw: -180° to 180° (horizontal rotation)
- Pitch: -90° to 90° (vertical angle)
- Radius: Fixed at sphere surface

---

## Future Enhancements

Planned features:
- [ ] Custom hotspot icons/colors
- [ ] Hotspot descriptions and info panels
- [ ] Snap-to-grid positioning
- [ ] Copy/paste hotspot positions
- [ ] Undo/redo for position changes
- [ ] Bulk edit mode for multiple hotspots
- [ ] Preview hotspot view cone
- [ ] Analytics on hotspot click rates

---

## Support

For issues or questions:
1. Check this guide first
2. Test in Preview Mode
3. Verify connections exist
4. Check browser console for errors
5. Try refreshing the page

Happy tour building! 🏠✨
