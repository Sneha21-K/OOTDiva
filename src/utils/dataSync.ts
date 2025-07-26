import { DEFAULT_SAMPLE_ITEMS, DEFAULT_CATEGORIES, DEFAULT_CATEGORY_IMAGES } from './imageConstants';
import { ClothingItemType } from '@/types/wardrobe';

// Storage keys
const STORAGE_KEYS = {
  WARDROBE_ITEMS: 'wardrobeItems',
  CATEGORIES: 'categories',
  CATEGORY_IMAGES: 'categoryImages',
  DATA_VERSION: 'dataVersion',
  LAST_SYNC: 'lastSync'
};

// Current data version - increment this when making breaking changes
const CURRENT_DATA_VERSION = '1.0.0';

export interface SyncData {
  items: ClothingItemType[];
  categories: string[];
  categoryImages: Record<string, string>;
  version: string;
  lastSync: number;
}

/**
 * Ensures consistent data across all devices by providing default data
 * and handling data versioning
 */
export class DataSyncManager {
  /**
   * Initialize data with defaults if no data exists
   */
  static initializeData(): SyncData {
    const currentVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
    const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    
    // If no data exists or version is outdated, initialize with defaults
    if (!currentVersion || currentVersion !== CURRENT_DATA_VERSION) {
      return this.resetToDefaults();
    }
    
    // Load existing data
    const items = this.loadItems();
    const categories = this.loadCategories();
    const categoryImages = this.loadCategoryImages();
    
    return {
      items,
      categories,
      categoryImages,
      version: CURRENT_DATA_VERSION,
      lastSync: lastSync ? parseInt(lastSync) : Date.now()
    };
  }
  
  /**
   * Reset all data to defaults
   */
  static resetToDefaults(): SyncData {
    const defaultData: SyncData = {
      items: DEFAULT_SAMPLE_ITEMS,
      categories: DEFAULT_CATEGORIES,
      categoryImages: DEFAULT_CATEGORY_IMAGES,
      version: CURRENT_DATA_VERSION,
      lastSync: Date.now()
    };
    
    // Save to localStorage
    this.saveData(defaultData);
    
    return defaultData;
  }
  
  /**
   * Load items from localStorage
   */
  static loadItems(): ClothingItemType[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WARDROBE_ITEMS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load items from localStorage:', error);
    }
    return DEFAULT_SAMPLE_ITEMS;
  }
  
  /**
   * Load categories from localStorage
   */
  static loadCategories(): string[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load categories from localStorage:', error);
    }
    return DEFAULT_CATEGORIES;
  }
  
  /**
   * Load category images from localStorage
   */
  static loadCategoryImages(): Record<string, string> {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORY_IMAGES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load category images from localStorage:', error);
    }
    return DEFAULT_CATEGORY_IMAGES;
  }
  
  /**
   * Save all data to localStorage
   */
  static saveData(data: SyncData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WARDROBE_ITEMS, JSON.stringify(data.items));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
      localStorage.setItem(STORAGE_KEYS.CATEGORY_IMAGES, JSON.stringify(data.categoryImages));
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, data.version);
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, data.lastSync.toString());
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }
  
  /**
   * Save items to localStorage
   */
  static saveItems(items: ClothingItemType[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WARDROBE_ITEMS, JSON.stringify(items));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      console.error('Failed to save items to localStorage:', error);
    }
  }
  
  /**
   * Save categories to localStorage
   */
  static saveCategories(categories: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      console.error('Failed to save categories to localStorage:', error);
    }
  }
  
  /**
   * Save category images to localStorage
   */
  static saveCategoryImages(categoryImages: Record<string, string>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORY_IMAGES, JSON.stringify(categoryImages));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      console.error('Failed to save category images to localStorage:', error);
    }
  }
  
  /**
   * Export data for backup or transfer
   */
  static exportData(): string {
    const data: SyncData = {
      items: this.loadItems(),
      categories: this.loadCategories(),
      categoryImages: this.loadCategoryImages(),
      version: CURRENT_DATA_VERSION,
      lastSync: Date.now()
    };
    
    return JSON.stringify(data, null, 2);
  }
  
  /**
   * Import data from backup
   */
  static importData(jsonData: string): boolean {
    try {
      const data: SyncData = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.items || !data.categories || !data.categoryImages) {
        throw new Error('Invalid data structure');
      }
      
      // Save imported data
      this.saveData(data);
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
  
  /**
   * Clear all data
   */
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
  
  /**
   * Get data statistics
   */
  static getDataStats(): {
    itemCount: number;
    categoryCount: number;
    lastSync: string;
    version: string;
  } {
    const items = this.loadItems();
    const categories = this.loadCategories();
    const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    const version = localStorage.getItem(STORAGE_KEYS.DATA_VERSION) || 'unknown';
    
    return {
      itemCount: items.length,
      categoryCount: categories.length,
      lastSync: lastSync ? new Date(parseInt(lastSync)).toLocaleString() : 'Never',
      version
    };
  }
} 