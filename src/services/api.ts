import { 
  categoryItemsLocalStorage, 
  outfitsLocalStorage, 
  imageUploadLocalStorage,
  categoriesLocalStorage,
  userDataLocalStorage 
} from './localStorage';

// Types
export interface CategoryItem {
  id: string;
  name: string;
  image_url?: string;
  color?: string;
  size?: string;
  brand?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryItemCreate {
  name: string;
  image_url?: string;
  color?: string;
  size?: string;
  brand?: string;
  is_favorite?: boolean;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface OutfitCreate {
  name: string;
  items?: string[];
  image_url?: string;
}

// Category Items API (using local storage)
export const categoryItemsAPI = {
  // Get all items from a category
  getItems: async (category: string): Promise<CategoryItem[]> => {
    return categoryItemsLocalStorage.getItems(category);
  },

  // Create a new item in a category
  createItem: async (category: string, item: CategoryItemCreate): Promise<CategoryItem> => {
    return categoryItemsLocalStorage.createItem(category, item);
  },

  // Update an item in a category
  updateItem: async (category: string, itemId: string, item: Partial<CategoryItemCreate>): Promise<CategoryItem> => {
    return categoryItemsLocalStorage.updateItem(category, itemId, item);
  },

  // Delete an item from a category
  deleteItem: async (category: string, itemId: string): Promise<void> => {
    return categoryItemsLocalStorage.deleteItem(category, itemId);
  },

  // Toggle favorite status
  toggleFavorite: async (category: string, itemId: string): Promise<CategoryItem> => {
    return categoryItemsLocalStorage.toggleFavorite(category, itemId);
  },
};

// Outfits API (using local storage)
export const outfitsAPI = {
  // Get all outfits
  getOutfits: async (): Promise<Outfit[]> => {
    return outfitsLocalStorage.getOutfits();
  },

  // Create a new outfit
  createOutfit: async (outfit: OutfitCreate): Promise<Outfit> => {
    return outfitsLocalStorage.createOutfit(outfit);
  },

  // Update an outfit
  updateOutfit: async (outfitId: string, outfit: Partial<OutfitCreate>): Promise<Outfit> => {
    return outfitsLocalStorage.updateOutfit(outfitId, outfit);
  },

  // Delete an outfit
  deleteOutfit: async (outfitId: string): Promise<void> => {
    return outfitsLocalStorage.deleteOutfit(outfitId);
  },
};

// Auth API (using local storage for demo purposes)
export const authAPI = {
  // Login (simulated)
  login: async (email: string, password: string): Promise<{ access_token: string; token_type: string }> => {
    // Simulate login - in a real app, you'd validate credentials
    const userData = { email, username: email.split('@')[0], isAuthenticated: true };
    userDataLocalStorage.setUserData(userData);
    
    return {
      access_token: 'demo_token_' + Date.now(),
      token_type: 'Bearer'
    };
  },

  // Register (simulated)
  register: async (email: string, username: string, password: string): Promise<any> => {
    // Simulate registration
    const userData = { email, username, isAuthenticated: true };
    userDataLocalStorage.setUserData(userData);
    
    return {
      message: 'User registered successfully',
      user: userData
    };
  },

  // Get current user
  getCurrentUser: async (): Promise<any> => {
    return userDataLocalStorage.getUserData();
  },

  // Logout
  logout: async (): Promise<void> => {
    userDataLocalStorage.clearUserData();
  }
};

// File Upload API (using local storage)
export const uploadAPI = {
  // Upload image
  uploadImage: async (file: File): Promise<{ filename: string; url: string; size: number; message: string }> => {
    return imageUploadLocalStorage.uploadImage(file);
  },
};

// Categories API (using local storage)
export const categoriesAPI = {
  // Get all categories
  getCategories: (): string[] => {
    return categoriesLocalStorage.getCategories();
  },

  // Add a new category
  addCategory: (category: string): void => {
    categoriesLocalStorage.addCategory(category);
  },

  // Remove a category
  removeCategory: (category: string): void => {
    categoriesLocalStorage.removeCategory(category);
  }
}; 