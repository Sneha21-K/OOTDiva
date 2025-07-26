import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { AddOutfitForm } from "@/components/AddOutfitForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ClothingItem } from "@/components/ClothingItem";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { CategoryItem, categoryItemsAPI, uploadAPI, categoriesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { getCategoryImage } from "@/utils/imageConstants";

// Use centralized image constants
import { DEFAULT_CATEGORY_IMAGES } from "@/utils/imageConstants";
const CATEGORY_IMAGES = DEFAULT_CATEGORY_IMAGES;

const CategoryDetail = () => {
  const { categoryName } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasShownDeleteWarning, setHasShownDeleteWarning] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    loadItems();
  }, [categoryName]);

  const loadItems = async () => {
    if (!categoryName) return;
    
    try {
      setLoading(true);
      const categoryItems = await categoryItemsAPI.getItems(categoryName.toLowerCase());
      setItems(categoryItems);
    } catch (error) {
      console.error('Error loading items:', error);
      toast({
        title: "Error",
        description: "Failed to load items. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData: { name: string; imageUrl: string }) => {
    if (!categoryName) return;
    
    try {
      const newItem = await categoryItemsAPI.createItem(categoryName.toLowerCase(), {
        name: itemData.name,
        image_url: itemData.imageUrl,
        color: "Unknown",
        size: "",
        brand: "",
        is_favorite: false
      });
      
      setItems(prev => [...prev, newItem]);
      setShowAddForm(false);
      
      toast({
        title: "Item added",
        description: `${itemData.name} has been added to ${categoryName}.`
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!categoryName) return;
    
    const item = items.find(item => item.id === id);
    const itemName = item?.name || 'this item';
    
    // Show one-time warning for deletions
    if (!hasShownDeleteWarning) {
      setConfirmDialogConfig({
        title: "⚠️ Warning",
        description: `This action will permanently delete ${itemName}. This cannot be undone.\n\nYou will see this warning only once per session.`,
        onConfirm: async () => {
          setHasShownDeleteWarning(true);
          try {
            await categoryItemsAPI.deleteItem(categoryName.toLowerCase(), id);
            setItems(prev => prev.filter(item => item.id !== id));
            
            toast({
              title: "Item deleted",
              description: "The item has been removed."
            });
          } catch (error) {
            console.error('Error deleting item:', error);
            toast({
              title: "Error",
              description: "Failed to delete item. Please try again.",
              variant: "destructive"
            });
          }
        }
      });
      setShowConfirmDialog(true);
      return;
    }
    
    setConfirmDialogConfig({
      title: "Delete Item",
      description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await categoryItemsAPI.deleteItem(categoryName.toLowerCase(), id);
          setItems(prev => prev.filter(item => item.id !== id));
          
          toast({
            title: "Item deleted",
            description: "The item has been removed."
          });
        } catch (error) {
          console.error('Error deleting item:', error);
          toast({
            title: "Error",
            description: "Failed to delete item. Please try again.",
            variant: "destructive"
          });
        }
      }
    });
    setShowConfirmDialog(true);
  };

  const handleToggleFavorite = async (id: string) => {
    if (!categoryName) return;
    
    try {
      const updatedItem = await categoryItemsAPI.toggleFavorite(categoryName.toLowerCase(), id);
      setItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = () => {
    if (!categoryName) return;
    
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
              
              // Navigate back to home page
              navigate('/');
              
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
        
        // Navigate back to home page
        navigate('/');
        
        toast({
          title: "Category deleted",
          description: `${categoryName} and all its items have been removed.`
        });
      }
    });
    setShowConfirmDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/">
            <Button
              variant="outline"
              className="bg-white border-purple-200 text-purple-700 hover:bg-purple-50 rounded-full text-xs sm:text-sm"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-purple-700 tracking-tight drop-shadow-sm font-sans">
            {categoryName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full font-semibold shadow text-xs sm:text-sm"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Add Item
          </Button>
          <Button
            variant="outline"
            className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 rounded-full font-semibold shadow text-xs sm:text-sm"
            onClick={handleDeleteCategory}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Delete Category
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {items.map(item => (
          <div
            key={item.id}
            className="bg-white border border-purple-200 rounded-2xl shadow-lg p-3 sm:p-4 flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-2xl group relative"
          >
            <div className="aspect-square w-full bg-purple-50 rounded-xl overflow-hidden mb-3 border-2 border-purple-100 group-hover:border-purple-300 transition-all">
              <ImageWithFallback 
                src={item.image_url || ''} 
                alt={item.name} 
                className="w-full h-full object-cover"
                fallbackCategory={categoryName}
              />
            </div>
            <div className="text-purple-700 font-semibold text-sm sm:text-base lg:text-lg text-center font-sans group-hover:text-purple-900 transition-colors">
              {item.name}
            </div>
            {/* Delete button */}
            <button
              className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 shadow-sm transition-colors"
              onClick={() => handleDeleteItem(item.id)}
              title="Delete item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="flex flex-col items-center">
            <ImageWithFallback 
              src={CATEGORY_IMAGES[categoryName as keyof typeof CATEGORY_IMAGES] || getCategoryImage(categoryName)} 
              alt={categoryName}
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl mb-4 opacity-60"
              fallbackCategory={categoryName}
            />
            <p className="text-purple-300 text-base sm:text-lg">No items in this category yet.</p>
            <p className="text-purple-200 text-xs sm:text-sm mt-2">Click "Add Item" to get started!</p>
          </div>
        </div>
      )}

      <AddOutfitForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddItem}
        title={`Add Item to ${categoryName}`}
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
    </div>
  );
};

export default CategoryDetail; 