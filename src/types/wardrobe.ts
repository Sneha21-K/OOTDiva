export interface ClothingItemType {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  color: string;
  season?: 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'All';
  size?: string;
  imageUrl?: string;
  purchaseDate?: string;
  price?: number;
  isFavorite: boolean;
  rating?: number;
  wearCount?: number;
  lastWorn?: string;
  tags: string[];
  notes?: string;
}

export interface OutfitType {
  id: string;
  name: string;
  items: string[]; // Array of clothing item IDs
  occasion?: string;
  rating?: number;
  imageUrl?: string;
  createdDate: string;
  lastWorn?: string;
}

export interface WardrobeStats {
  totalItems: number;
  favoriteItems: number;
  mostWornCategory: string;
  leastWornItems: ClothingItemType[];
  recentlyAdded: ClothingItemType[];
}