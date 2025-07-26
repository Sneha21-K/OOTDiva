import { CategoryItem, CategoryItemCreate, Outfit, OutfitCreate } from './api';

// Local Storage Keys
const STORAGE_KEYS = {
  CATEGORY_ITEMS: 'wardrobe_category_items',
  OUTFITS: 'wardrobe_outfits',
  USER_DATA: 'wardrobe_user_data',
  CATEGORIES: 'wardrobe_categories',
  UPLOADED_IMAGES: 'wardrobe_uploaded_images'
};

// Helper functions for local storage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return defaultValue;
  }
};

const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key ${key}:`, error);
  }
};

// Category Items Local Storage Service
export const categoryItemsLocalStorage = {
  // Get all items from a category
  getItems: async (category: string): Promise<CategoryItem[]> => {
    const allItems = getFromStorage<Record<string, CategoryItem[]>>(STORAGE_KEYS.CATEGORY_ITEMS, {});
    return allItems[category] || [];
  },

  // Create a new item in a category
  createItem: async (category: string, item: CategoryItemCreate): Promise<CategoryItem> => {
    const allItems = getFromStorage<Record<string, CategoryItem[]>>(STORAGE_KEYS.CATEGORY_ITEMS, {});
    const categoryItems = allItems[category] || [];
    
    const newItem: CategoryItem = {
      id: Date.now().toString(),
      name: item.name,
      image_url: item.image_url,
      color: item.color || 'Unknown',
      size: item.size,
      brand: item.brand,
      is_favorite: item.is_favorite || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    categoryItems.push(newItem);
    allItems[category] = categoryItems;
    setToStorage(STORAGE_KEYS.CATEGORY_ITEMS, allItems);
    
    return newItem;
  },

  // Update an item in a category
  updateItem: async (category: string, itemId: string, item: Partial<CategoryItemCreate>): Promise<CategoryItem> => {
    const allItems = getFromStorage<Record<string, CategoryItem[]>>(STORAGE_KEYS.CATEGORY_ITEMS, {});
    const categoryItems = allItems[category] || [];
    
    const itemIndex = categoryItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    const updatedItem: CategoryItem = {
      ...categoryItems[itemIndex],
      ...item,
      updated_at: new Date().toISOString()
    };

    categoryItems[itemIndex] = updatedItem;
    allItems[category] = categoryItems;
    setToStorage(STORAGE_KEYS.CATEGORY_ITEMS, allItems);
    
    return updatedItem;
  },

  // Delete an item from a category
  deleteItem: async (category: string, itemId: string): Promise<void> => {
    const allItems = getFromStorage<Record<string, CategoryItem[]>>(STORAGE_KEYS.CATEGORY_ITEMS, {});
    const categoryItems = allItems[category] || [];
    
    const filteredItems = categoryItems.filter(item => item.id !== itemId);
    allItems[category] = filteredItems;
    setToStorage(STORAGE_KEYS.CATEGORY_ITEMS, allItems);
  },

  // Toggle favorite status
  toggleFavorite: async (category: string, itemId: string): Promise<CategoryItem> => {
    const allItems = getFromStorage<Record<string, CategoryItem[]>>(STORAGE_KEYS.CATEGORY_ITEMS, {});
    const categoryItems = allItems[category] || [];
    
    const itemIndex = categoryItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    const updatedItem: CategoryItem = {
      ...categoryItems[itemIndex],
      is_favorite: !categoryItems[itemIndex].is_favorite,
      updated_at: new Date().toISOString()
    };

    categoryItems[itemIndex] = updatedItem;
    allItems[category] = categoryItems;
    setToStorage(STORAGE_KEYS.CATEGORY_ITEMS, allItems);
    
    return updatedItem;
  }
};

// Outfits Local Storage Service
export const outfitsLocalStorage = {
  // Get all outfits
  getOutfits: async (): Promise<Outfit[]> => {
    return getFromStorage<Outfit[]>(STORAGE_KEYS.OUTFITS, []);
  },

  // Create a new outfit
  createOutfit: async (outfit: OutfitCreate): Promise<Outfit> => {
    const outfits = getFromStorage<Outfit[]>(STORAGE_KEYS.OUTFITS, []);
    
    const newOutfit: Outfit = {
      id: Date.now().toString(),
      name: outfit.name,
      items: outfit.items || [],
      image_url: outfit.image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    outfits.push(newOutfit);
    setToStorage(STORAGE_KEYS.OUTFITS, outfits);
    
    return newOutfit;
  },

  // Update an outfit
  updateOutfit: async (outfitId: string, outfit: Partial<OutfitCreate>): Promise<Outfit> => {
    const outfits = getFromStorage<Outfit[]>(STORAGE_KEYS.OUTFITS, []);
    
    const outfitIndex = outfits.findIndex(o => o.id === outfitId);
    if (outfitIndex === -1) {
      throw new Error('Outfit not found');
    }

    const updatedOutfit: Outfit = {
      ...outfits[outfitIndex],
      ...outfit,
      updated_at: new Date().toISOString()
    };

    outfits[outfitIndex] = updatedOutfit;
    setToStorage(STORAGE_KEYS.OUTFITS, outfits);
    
    return updatedOutfit;
  },

  // Delete an outfit
  deleteOutfit: async (outfitId: string): Promise<void> => {
    const outfits = getFromStorage<Outfit[]>(STORAGE_KEYS.OUTFITS, []);
    const filteredOutfits = outfits.filter(outfit => outfit.id !== outfitId);
    setToStorage(STORAGE_KEYS.OUTFITS, filteredOutfits);
  }
};

// Image Upload Local Storage Service
export const imageUploadLocalStorage = {
  // Upload image (convert to base64 and store)
  uploadImage: async (file: File): Promise<{ filename: string; url: string; size: number; message: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const base64Data = reader.result as string;
          const uploadedImages = getFromStorage<Record<string, string>>(STORAGE_KEYS.UPLOADED_IMAGES, {});
          
          const filename = `image_${Date.now()}_${file.name}`;
          uploadedImages[filename] = base64Data;
          setToStorage(STORAGE_KEYS.UPLOADED_IMAGES, uploadedImages);
          
          resolve({
            filename,
            url: base64Data,
            size: file.size,
            message: 'Image uploaded successfully'
          });
        } catch (error) {
          reject(new Error('Failed to process image'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  // Get uploaded image
  getImage: (filename: string): string | null => {
    const uploadedImages = getFromStorage<Record<string, string>>(STORAGE_KEYS.UPLOADED_IMAGES, {});
    return uploadedImages[filename] || null;
  }
};

// Categories Local Storage Service
export const categoriesLocalStorage = {
  // Get all categories
  getCategories: (): string[] => {
    return getFromStorage<string[]>(STORAGE_KEYS.CATEGORIES, []);
  },

  // Add a new category
  addCategory: (category: string): void => {
    const categories = getFromStorage<string[]>(STORAGE_KEYS.CATEGORIES, []);
    if (!categories.includes(category)) {
      categories.push(category);
      setToStorage(STORAGE_KEYS.CATEGORIES, categories);
    }
  },

  // Remove a category
  removeCategory: (category: string): void => {
    const categories = getFromStorage<string[]>(STORAGE_KEYS.CATEGORIES, []);
    const filteredCategories = categories.filter(c => c !== category);
    setToStorage(STORAGE_KEYS.CATEGORIES, filteredCategories);
  }
};

// User Data Local Storage Service
export const userDataLocalStorage = {
  // Get user data
  getUserData: () => {
    return getFromStorage<any>(STORAGE_KEYS.USER_DATA, null);
  },

  // Set user data
  setUserData: (userData: any): void => {
    setToStorage(STORAGE_KEYS.USER_DATA, userData);
  },

  // Clear user data
  clearUserData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

// Export all storage keys for reference
export { STORAGE_KEYS }; 