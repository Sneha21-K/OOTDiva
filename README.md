# Closet Sparkle Palette - Wardrobe Management App

A modern, responsive wardrobe management application built with React, TypeScript, and Tailwind CSS. This app allows users to organize their clothing items by categories, create outfits, and manage their wardrobe digitally.

## 🚀 Features

- **Frontend-only**: No backend required - all data stored locally in the browser
- **Category Management**: Organize clothing items by categories (Jeans, Tops, Skirts, etc.)
- **Item Management**: Add, edit, delete, and favorite clothing items
- **Outfit Creation**: Create and save outfits with multiple items
- **Image Upload**: Upload images for items and outfits (stored as base64)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Data Storage**: Browser localStorage
- **Deployment**: Netlify

## 📦 Installation & Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd closet-sparkle-palette-main/Frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Netlify Deployment (Recommended)

This application is configured for easy deployment on Netlify with frontend-only functionality.

#### Option 1: Deploy via Netlify UI
1. Fork/Clone this repository
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub account
5. Select this repository
6. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click "Deploy site"

#### Option 2: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd Frontend
npm run build
netlify deploy --prod --dir=dist
```

#### Option 3: Use Deployment Scripts
```bash
# Windows
deploy.bat

# Linux/Mac
./deploy.sh
```

### Configuration Files
- `netlify.toml` - Netlify configuration with routing and headers
- `vite.config.ts` - Vite build configuration
- `package.json` - Dependencies and scripts

## 💾 Data Storage

All data is stored locally in the browser's localStorage:

- **Category Items**: `wardrobe_category_items`
- **Outfits**: `wardrobe_outfits`
- **Categories**: `wardrobe_categories`
- **Uploaded Images**: `wardrobe_uploaded_images`
- **User Data**: `wardrobe_user_data`

## 🎨 Features Overview

### Wardrobe Management
- Add clothing items with details (name, category, color, brand, size)
- Organize items with tags and seasons
- Mark items as favorites
- Track wear count and ratings
- Delete items when needed

### Category System
- Default categories: Jeans, Tops, Skirts, Shirts, Skorts, Shorts, Dress, T-shirt, Jackets, Indian wear
- Add custom categories
- Category-specific item management
- Visual category cards with item counts

### Outfit Creation
- Create outfits by combining multiple clothing items
- Add outfit images
- Save and manage outfit collections
- Delete outfits when needed

### Image Management
- Upload images for clothing items and outfits
- Images stored as base64 in localStorage
- Support for both file upload and URL input
- Camera capture support on mobile devices

## 🔧 Project Structure

```
Frontend/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── services/           # API and storage services
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── public/                 # Static assets
├── netlify.toml           # Netlify configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

## 🌟 Key Components

- **Index**: Main dashboard with category overview and stats
- **CategoryDetail**: Individual category page with item management
- **Outfits**: Outfit creation and management
- **AddItemForm**: Form for adding/editing clothing items
- **AddOutfitForm**: Form for creating outfits and categories
- **WardrobeStats**: Statistics and insights about the wardrobe

## 📱 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## ⚡ Performance Notes

- Images are stored as base64, which increases localStorage usage
- Consider image size limits for optimal performance
- Data is stored locally and persists between sessions
- No server-side processing required

## 🐛 Troubleshooting

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

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify localStorage is enabled
3. Try clearing browser data and restarting
4. Open an issue on GitHub

---

**Note**: This is a frontend-only application designed for personal wardrobe management. All data is stored locally in your browser and will persist between sessions.
