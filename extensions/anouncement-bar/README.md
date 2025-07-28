# Announcement Bar App Block

This extension provides an app block that displays an announcement bar on your Shopify storefront using data saved from the app.

## Features

- **Dynamic Content**: Displays the announcement text and styling configured in the app
- **Responsive Design**: Adapts to different screen sizes
- **Customizable**: Colors and styling are managed through the app settings
- **Easy Integration**: Can be added as a section or app block

## How to Use

### Option 1: Add as a Section
1. Go to your theme customizer
2. Add a new section
3. Select "Announcement Bar" from the sections list
4. The announcement bar will appear with your saved settings

### Option 2: Add as an App Block
1. Go to your theme customizer
2. Add a new section
3. Click "Add block"
4. Select "Announcement Bar" from the app blocks
5. The announcement bar will appear with your saved settings

### Option 3: Manual Integration
You can also manually add the announcement bar to your theme by including this code in your theme files:

```liquid
{% render 'announcement-bar' %}
```

## Configuration

The announcement bar content and styling are managed through the app settings:

- **Title**: The text displayed in the announcement bar
- **Title Color**: Color of the announcement text
- **Button Color**: Background color of the "Shop Now" button
- **Background Color**: Background color of the announcement bar

## Files Structure

```
extensions/anouncement-bar/
├── blocks/
│   └── announcement_bar.liquid          # App block for theme editor
├── sections/
│   └── announcement-bar.liquid          # Section for theme editor
├── snippets/
│   └── announcement-bar.liquid          # Reusable snippet
└── shopify.extension.toml               # Extension configuration
```

## Styling

The announcement bar includes:
- Responsive design for mobile and desktop
- Hover effects on the button
- Clean, modern styling
- Proper spacing and typography

## Requirements

- Shopify app with metafields access
- Saved announcement bar data in metafields with namespace `announcement_bar`
- Theme that supports app blocks (Online Store 2.0+) 