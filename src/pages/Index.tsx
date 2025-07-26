
import { useState, useEffect, useMemo } from "react";
import { WardrobeHeader } from "@/components/WardrobeHeader";
import { ClothingItem } from "@/components/ClothingItem";
import { AddItemForm } from "@/components/AddItemForm";
import { FilterPanel } from "@/components/FilterPanel";
import { WardrobeStats } from "@/components/WardrobeStats";
import { ClothingItemType, WardrobeStats as StatsType } from "@/types/wardrobe";
import { CategoryItem, categoryItemsAPI, categoriesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";
import { AddOutfitForm } from "@/components/AddOutfitForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MobileImagePicker } from "@/components/MobileImagePicker";
import { Link } from "react-router-dom";
import WelcomeScreen from "@/components/WelcomeScreen";

const CATEGORY_LIST = [
  "Jeans", "Tops", "Skirts", "Shirts", "Skorts", "Shorts", "Dress", "T-shirt", "Jackets", "Indian wear"
];

const CATEGORY_IMAGES = {
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

const Index = () => {
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(false);
  const [items, setItems] = useState<ClothingItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItemType | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [categoryImages, setCategoryImages] = useState(CATEGORY_IMAGES);
  const [showAddItemToCategory, setShowAddItemToCategory] = useState(false);
  const [selectedCategoryForItem, setSelectedCategoryForItem] = useState("");
  const [hasShownDeleteWarning, setHasShownDeleteWarning] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);
  const [showMobileImagePicker, setShowMobileImagePicker] = useState(false);

  // Check if this is a page refresh and show welcome screen only on refresh
  useEffect(() => {
    // More robust way to detect page refresh
    const isPageRefresh = () => {
      // Method 1: Check navigation type
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation?.type === 'reload') return true;
      
      // Method 2: Check if page was loaded from cache
      if (navigation?.type === 'back_forward') return false;
      
      // Method 3: Check if this is the first load of the session
      const hasShownWelcome = sessionStorage.getItem('hasShownWelcome');
      const isFirstLoad = !hasShownWelcome && document.referrer === '';
      
      return isFirstLoad;
    };
    
    const shouldShowWelcome = isPageRefresh();
    
    if (shouldShowWelcome) {
      setShowWelcome(true);
    }
  }, []);

  // Load categories and sample data on first visit
  useEffect(() => {
    // Load categories from local storage or use default
    const savedCategories = categoriesAPI.getCategories();
    if (savedCategories.length > 0) {
      setCategoryList(savedCategories);
    } else {
      // Initialize with default categories
      CATEGORY_LIST.forEach(category => categoriesAPI.addCategory(category));
      setCategoryList(CATEGORY_LIST);
    }

    // Load sample data on first visit
    const sampleItems: ClothingItemType[] = [
      {
        id: "1",
        name: "Classic White Button Shirt",
        category: "Tops",
        color: "White",
        brand: "Zara",
        season: "All",
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
        season: "Fall",
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
        season: "All",
        isFavorite: false,
        rating: 4,
        wearCount: 25,
        tags: ["casual", "everyday"],
        imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop"
      }
    ];
    
    const savedItems = localStorage.getItem('wardrobeItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(sampleItems);
      localStorage.setItem('wardrobeItems', JSON.stringify(sampleItems));
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('wardrobeItems', JSON.stringify(items));
  }, [items]);

  const categories = useMemo(() => {
    return [...new Set(items.map(item => item.category))];
  }, [items]);

  const seasons = useMemo(() => {
    return ['Spring', 'Summer', 'Fall', 'Winter', 'All'];
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const matchesSeason = selectedSeasons.length === 0 || selectedSeasons.includes(item.season || 'All');
      const matchesFavorites = !showFavoritesOnly || item.isFavorite;

      return matchesSearch && matchesCategory && matchesSeason && matchesFavorites;
    });
  }, [items, searchTerm, selectedCategories, selectedSeasons, showFavoritesOnly]);

  const stats = useMemo((): StatsType => {
    const totalItems = items.length;
    const favoriteItems = items.filter(item => item.isFavorite).length;
    
    // Find most worn category
    const categoryWearCount = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + (item.wearCount || 0);
      return acc;
    }, {} as Record<string, number>);
    
    const mostWornCategory = Object.entries(categoryWearCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentlyAdded = items.filter(item => 
      item.purchaseDate && new Date(item.purchaseDate) > thirtyDaysAgo
    );

    const leastWornItems = items
      .sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0))
      .slice(0, 3);

    return {
      totalItems,
      favoriteItems,
      mostWornCategory,
      leastWornItems,
      recentlyAdded
    };
  }, [items]);

  const handleAddItem = (newItem: Omit<ClothingItemType, 'id'>) => {
    const item: ClothingItemType = {
      ...newItem,
      id: Date.now().toString()
    };
    setItems(prev => [...prev, item]);
  };

  const handleEditItem = (item: ClothingItemType) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleUpdateItem = (updatedItem: Omit<ClothingItemType, 'id'>) => {
    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...updatedItem, id: editingItem.id }
          : item
      ));
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = items.find(item => item.id === id);
    const itemName = item?.name || 'this item';
    
    // Show one-time warning for deletions
    if (!hasShownDeleteWarning) {
      setConfirmDialogConfig({
        title: "⚠️ Warning",
        description: `This action will permanently delete ${itemName}. This cannot be undone.\n\nYou will see this warning only once per session.`,
        onConfirm: () => {
          setHasShownDeleteWarning(true);
          setItems(prev => prev.filter(item => item.id !== id));
          toast({
            title: "Item deleted",
            description: "The item has been removed from your wardrobe."
          });
        }
      });
      setShowConfirmDialog(true);
      return;
    }
    
    setConfirmDialogConfig({
      title: "Delete Item",
      description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      onConfirm: () => {
        setItems(prev => prev.filter(item => item.id !== id));
        toast({
          title: "Item deleted",
          description: "The item has been removed from your wardrobe."
        });
      }
    });
    setShowConfirmDialog(true);
  };

  const handleToggleFavorite = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, category]
        : prev.filter(c => c !== category)
    );
  };

  const handleSeasonChange = (season: string, checked: boolean) => {
    setSelectedSeasons(prev => 
      checked 
        ? [...prev, season]
        : prev.filter(s => s !== season)
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSeasons([]);
    setShowFavoritesOnly(false);
  };

  const displayedCategories = showAllCategories ? categoryList : categoryList.slice(0, 4);

  // Filter categories based on selected categories
  const filteredCategories = selectedCategories.length > 0 
    ? displayedCategories.filter(category => selectedCategories.includes(category))
    : displayedCategories;

  const handleAddCategory = (newCategory: { name: string; imageUrl: string }) => {
    const categoryName = newCategory.name.trim();
    if (categoryName && !categoryList.includes(categoryName)) {
      categoriesAPI.addCategory(categoryName);
      setCategoryList(prev => [...prev, categoryName]);
      setCategoryImages(prev => ({
        ...prev,
        [categoryName]: newCategory.imageUrl || "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop"
      }));
      toast({
        title: "Category added",
        description: `${categoryName} has been added to your categories.`
      });
    } else if (categoryList.includes(categoryName)) {
      toast({
        title: "Category exists",
        description: "This category already exists.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    // Show one-time warning for deletions
    if (!hasShownDeleteWarning) {
      setConfirmDialogConfig({
        title: "⚠️ Warning",
        description: `This action will permanently delete the category "${categoryName}" and ALL items in it. This cannot be undone.\n\nYou will see this warning only once per session.`,
        onConfirm: () => {
          setHasShownDeleteWarning(true);
          // Show category-specific confirmation
          setConfirmDialogConfig({
            title: "Delete Category",
            description: `Are you sure you want to delete "${categoryName}"? This will also remove all items in this category.`,
            onConfirm: () => {
              // Remove category from local storage
              categoriesAPI.removeCategory(categoryName);
              
              // Remove category from state
              setCategoryList(prev => prev.filter(cat => cat !== categoryName));
              
              // Remove category image
              setCategoryImages(prev => {
                const newImages = { ...prev };
                delete newImages[categoryName];
                return newImages;
              });
              
              // Remove all items in this category
              setItems(prev => prev.filter(item => item.category !== categoryName));
              
              toast({
                title: "Category deleted",
                description: `${categoryName} and all its items have been removed.`
              });
            }
          });
          setShowConfirmDialog(true);
        }
      });
      setShowConfirmDialog(true);
      return;
    }
    
    // Show category-specific confirmation
    setConfirmDialogConfig({
      title: "Delete Category",
      description: `Are you sure you want to delete "${categoryName}"? This will also remove all items in this category.`,
      onConfirm: () => {
        // Remove category from local storage
        categoriesAPI.removeCategory(categoryName);
        
        // Remove category from state
        setCategoryList(prev => prev.filter(cat => cat !== categoryName));
        
        // Remove category image
        setCategoryImages(prev => {
          const newImages = { ...prev };
          delete newImages[categoryName];
          return newImages;
        });
        
        // Remove all items in this category
        setItems(prev => prev.filter(item => item.category !== categoryName));
        
        toast({
          title: "Category deleted",
          description: `${categoryName} and all its items have been removed.`
        });
      }
    });
    setShowConfirmDialog(true);
  };

  const handleAddItemToCategory = (itemData: { name: string; imageUrl: string }) => {
    const newItem: ClothingItemType = {
      id: Date.now().toString(),
      name: itemData.name,
      category: selectedCategoryForItem,
      color: "Unknown",
      isFavorite: false,
      tags: [],
      imageUrl: itemData.imageUrl,
      wearCount: 0
    };
    
    setItems(prev => [...prev, newItem]);
    setShowAddItemToCategory(false);
    setSelectedCategoryForItem("");
    
    toast({
      title: "Item added",
      description: `${itemData.name} has been added to ${selectedCategoryForItem}.`
    });
  };

  const handleMobileImageSelect = (imageData: string) => {
    // Open the add item form with the selected image
    setShowMobileImagePicker(false);
    setShowAddForm(true);
    // You could also pre-fill the image URL in the form
    toast({
      title: "Image selected",
      description: "Please fill in the item details."
    });
  };

  return (
    <>
      {showWelcome && (
        <WelcomeScreen onComplete={() => {
          setShowWelcome(false);
          // Mark that we've shown the welcome screen in this session
          sessionStorage.setItem('hasShownWelcome', 'true');
        }} />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 pt-20 sm:pt-24 px-3 sm:px-4 space-y-4 sm:space-y-6">
        <WardrobeHeader 
          onAddItem={() => setShowAddCategoryForm(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterToggle={() => setShowFilters(!showFilters)}
        />
      
      <WardrobeStats stats={stats} />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {showFilters && (
          <FilterPanel
            categories={categoryList}
            selectedCategories={selectedCategories}
            seasons={seasons}
            selectedSeasons={selectedSeasons}
            showFavoritesOnly={showFavoritesOnly}
            onCategoryChange={handleCategoryChange}
            onSeasonChange={handleSeasonChange}
            onFavoritesToggle={setShowFavoritesOnly}
            onClearFilters={handleClearFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredCategories.map(category => {
              const categoryItems = filteredItems.filter(item => item.category.toLowerCase() === category.toLowerCase());
              return (
                <div key={category} className="bg-white border border-purple-200 rounded-xl shadow-md p-3 sm:p-4 flex flex-col items-center aspect-square cursor-pointer hover:shadow-lg transition-all relative">
                  <div className="flex items-center justify-between w-full mb-2 sm:mb-4">
                    <Link to={`/category/${category}`} className="flex-1">
                      <h2 className="text-sm sm:text-base lg:text-lg font-bold text-purple-700 hover:text-purple-900 transition-colors">{category}</h2>
                    </Link>
                                              <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-100 rounded-full p-1 sm:p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category);
                          }}
                          title="Delete category"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                  </div>
                  <Link to={`/category/${category}`} className="flex-1 w-full flex items-center justify-center">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <img 
                        src={categoryImages[category]} 
                        alt={category}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-cover rounded-lg mb-2"
                      />
                      <div className="text-center text-purple-300 text-xs sm:text-sm">{categoryItems.length === 0 ? "No items yet" : null}</div>
                    </div>
                  </Link>
                  {/* Render items in this category with delete button */}
                  {categoryItems.length > 0 && (
                    <div className="w-full mt-2 flex flex-col gap-1 sm:gap-2">
                      {categoryItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-purple-50 rounded-lg px-2 sm:px-3 py-1 shadow-sm">
                          <span className="truncate text-purple-800 font-medium text-xs sm:text-sm">{item.name}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:bg-red-100 ml-1 sm:ml-2 p-1"
                            onClick={() => handleDeleteItem(item.id)}
                            title="Delete item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {!showAllCategories && categoryList.length > 4 && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setShowAllCategories(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold px-8 py-3 shadow-lg"
              >
                More Categories
              </Button>
            </div>
          )}
          
          {showAllCategories && categoryList.length > 4 && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setShowAllCategories(false)}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full font-semibold px-8 py-3 shadow-lg border border-purple-200"
              >
                Show Less
              </Button>
            </div>
          )}
        </div>
      </div>

      <AddItemForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddItem}
        editItem={editingItem}
      />

      <AddOutfitForm
        open={showAddCategoryForm}
        onClose={() => setShowAddCategoryForm(false)}
        onSubmit={handleAddCategory}
      />

      <AddOutfitForm
        open={showAddItemToCategory}
        onClose={() => {
          setShowAddItemToCategory(false);
          setSelectedCategoryForItem("");
        }}
        onSubmit={handleAddItemToCategory}
        title="Add Item to Category"
        placeholder="e.g., Blue Denim Jeans"
      />

      {confirmDialogConfig && (
        <ConfirmDialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={confirmDialogConfig.onConfirm}
          title={confirmDialogConfig.title}
          description={confirmDialogConfig.description}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      )}

      {/* Floating Action Button for Quick Image Upload */}
      <Button
        onClick={() => setShowMobileImagePicker(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg z-40 flex items-center justify-center"
        title="Quick Upload"
      >
        <Camera className="w-6 h-6" />
      </Button>

      {/* Mobile Image Picker */}
      {showMobileImagePicker && (
        <MobileImagePicker
          onImageSelect={handleMobileImageSelect}
          onClose={() => setShowMobileImagePicker(false)}
          title="Quick Upload"
        />
      )}
      </div>
    </>
  );
};

export default Index;
