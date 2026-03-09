# Kiosk Mode

## Activation

To activate kiosk mode, add `?kiosk=true` to the URL:

```
http://yoursite.com/?kiosk=true
```

Or set it in localStorage:

```javascript
localStorage.setItem('kioskMode', 'true');
```

## Features

### Interactive Menu Browsing
- Station/category selection screen
- Browse items by station
- Tap items to view detailed nutrition information

### FDA-Compliant Nutrition Labels
- Complete nutrition facts panel
- Daily value percentages based on 2,000 calorie diet
- Ingredient lists
- Allergen warnings
- Dietary icons

### Inactivity Management
- 50-second inactivity timer
- 10-second countdown warning before reset
- Visual countdown indicator
- Automatic return to home screen

### Kiosk Protections
- Right-click disabled
- Text selection disabled
- Pinch-to-zoom disabled
- Context menu disabled
- Touch-optimized interface

### Draggable Nutrition Modal
- Drag modal by header to reposition
- Close via X button, clicking outside, or ESC key
- Touch and mouse support

### Demo Data
If no menu data is loaded from IndexedDB, the kiosk automatically displays demo menu items with sample nutrition information.

## Data Structure

The kiosk uses `integrationItems` from IndexedDB. Each item should have:

- `name` or `comboName` or `menuItemName` - Item name
- `category` - Station/category name
- `description` or `enticingDescription` or `menuDescription` - Item description
- `price` - Price string (e.g., "$8.99")
- `calories` - Calorie count
- `hidden` - Boolean to hide from kiosk
- Nutrition fields: `totalFat`, `saturatedFat`, `sodium`, etc.
- `ingredients` - Array of ingredient strings
- `allergens` - Array of allergen strings
- `icons` - Array of dietary icon objects

## Customization

### Timers
Edit `js/inactivity-manager.js`:
- `inactivityDuration` - Seconds before warning (default: 50)
- `warningDuration` - Countdown seconds (default: 10)

### Styling
Edit `resources/kiosk.css` to customize colors, fonts, and layout.

### Daily Values
Edit `js/nutrition-reference.js` to update FDA daily value references.
