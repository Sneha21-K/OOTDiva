# Netlify Deployment Guide

This application has been configured for frontend-only deployment on Netlify. All data is stored locally in the browser using localStorage.

## Features

- ✅ **Frontend-only**: No backend required
- ✅ **Local Storage**: All data persists in the browser
- ✅ **Image Upload**: Images are stored as base64 in localStorage
- ✅ **Responsive Design**: Works on all devices
- ✅ **Modern UI**: Built with Tailwind CSS and shadcn/ui

## Deployment Steps

### Option 1: Deploy via Netlify UI

1. **Fork/Clone this repository**
2. **Go to [Netlify](https://netlify.com)**
3. **Click "New site from Git"**
4. **Connect your GitHub account**
5. **Select this repository**
6. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
7. **Click "Deploy site"**

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd Frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

## Build Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration Files

- `netlify.toml` - Netlify configuration
- `vite.config.ts` - Vite build configuration
- `package.json` - Dependencies and scripts

## Data Storage

All data is stored in the browser's localStorage:

- **Category Items**: `wardrobe_category_items`
- **Outfits**: `wardrobe_outfits`
- **Categories**: `wardrobe_categories`
- **Uploaded Images**: `wardrobe_uploaded_images`
- **User Data**: `wardrobe_user_data`

## Features

### Wardrobe Management
- Add/remove clothing items by category
- Organize items with tags, colors, and brands
- Mark items as favorites
- Track wear count and ratings

### Outfit Creation
- Create and save outfits
- Combine multiple clothing items
- Add outfit images

### Categories
- Default categories: Jeans, Tops, Skirts, Shirts, Skorts, Shorts, Dress, T-shirt, Jackets, Indian wear
- Add custom categories
- Category-specific item management

### Image Upload
- Upload images for clothing items and outfits
- Images stored as base64 in localStorage
- Automatic image optimization

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Notes

- Images are stored as base64, which increases localStorage usage
- Consider image size limits for optimal performance
- Data is stored locally and will persist between sessions

## Troubleshooting

### Build Issues
- Ensure Node.js version 18+ is installed
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Deployment Issues
- Check build logs in Netlify dashboard
- Verify build command and publish directory
- Ensure all dependencies are in package.json

### Local Storage Issues
- Clear browser data if experiencing storage issues
- Check localStorage quota (usually 5-10MB)
- Consider clearing old data if storage is full

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify localStorage is enabled
3. Try clearing browser data and restarting 