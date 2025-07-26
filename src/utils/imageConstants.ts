// Centralized image constants to ensure consistency across all devices
export const DEFAULT_CATEGORY_IMAGES = {
  "Jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
  "Tops": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop",
  "Skirts": "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=300&h=300&fit=crop",
  "Shirts": "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop",
  "Skorts": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop",
  "Shorts": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
  "Dress": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop",
  "T-shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
  "Jackets": "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=300&h=300&fit=crop",
  "Indian wear": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop"
};

export const DEFAULT_SAMPLE_ITEMS = [
  {
    id: "1",
    name: "Classic White Button Shirt",
    category: "Tops",
    color: "White",
    brand: "Zara",
    season: "All" as const,
    isFavorite: true,
    rating: 5,
    wearCount: 15,
    tags: ["professional", "versatile"],
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop"
  },
  {
    id: "2", 
    name: "Black Leather Jacket",
    category: "Jackets",
    color: "Black",
    brand: "AllSaints",
    season: "Fall" as const,
    isFavorite: true,
    rating: 5,
    wearCount: 8,
    tags: ["edgy", "casual"],
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300390c465d1?w=300&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Blue Denim Jeans",
    category: "Jeans", 
    color: "Blue",
    brand: "Levi's",
    season: "All" as const,
    isFavorite: false,
    rating: 4,
    wearCount: 25,
    tags: ["casual", "everyday"],
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop"
  }
];

export const DEFAULT_CATEGORIES = [
  "Jeans", "Tops", "Skirts", "Shirts", "Skorts", "Shorts", "Dress", "T-shirt", "Jackets", "Indian wear"
];

// Placeholder images for different categories
export const PLACEHOLDER_IMAGES = {
  "Jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
  "Tops": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop",
  "Skirts": "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=300&h=300&fit=crop",
  "Shirts": "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop",
  "Skorts": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop",
  "Shorts": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
  "Dress": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop",
  "T-shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
  "Jackets": "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=300&h=300&fit=crop",
  "Indian wear": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
  "default": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop"
};

// Function to get a consistent image for any category
export const getCategoryImage = (category: string): string => {
  return PLACEHOLDER_IMAGES[category as keyof typeof PLACEHOLDER_IMAGES] || PLACEHOLDER_IMAGES.default;
};

// Function to get a fallback image if the provided image fails to load
export const getFallbackImage = (category?: string): string => {
  if (category) {
    return getCategoryImage(category);
  }
  return PLACEHOLDER_IMAGES.default;
}; 