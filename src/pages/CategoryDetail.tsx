import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { AddOutfitForm } from "@/components/AddOutfitForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ClothingItem } from "@/components/ClothingItem";
import { CategoryItem, categoryItemsAPI, uploadAPI, categoriesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button
              variant="outline"
              className="bg-white border-purple-200 text-purple-700 hover:bg-purple-50 rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-extrabold text-purple-700 tracking-tight drop-shadow-sm font-sans">
            {categoryName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full font-semibold shadow"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-5 w-5 mr-2" /> Add Item
          </Button>
          <Button
            variant="outline"
            className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 rounded-full font-semibold shadow"
            onClick={handleDeleteCategory}
          >
            <Trash2 className="h-5 w-5 mr-2" /> Delete Category
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <div
            key={item.id}
            className="bg-white border border-purple-200 rounded-2xl shadow-lg p-4 flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-2xl group relative"
          >
            <div className="aspect-square w-full bg-purple-50 rounded-xl overflow-hidden mb-3 border-2 border-purple-100 group-hover:border-purple-300 transition-all">
              <img src={item.image_url || ''} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-purple-700 font-semibold text-lg text-center font-sans group-hover:text-purple-900 transition-colors">
              {item.name}
            </div>
            {/* Delete button */}
            <button
              className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 shadow-sm transition-colors"
              onClick={() => handleDeleteItem(item.id)}
              title="Delete item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="flex flex-col items-center">
            <img 
              src={CATEGORY_IMAGES[categoryName as keyof typeof CATEGORY_IMAGES] || CATEGORY_IMAGES["Jeans"]} 
              alt={categoryName}
              className="w-32 h-32 object-cover rounded-xl mb-4 opacity-60"
            />
            <p className="text-purple-300 text-lg">No items in this category yet.</p>
            <p className="text-purple-200 text-sm mt-2">Click "Add Item" to get started!</p>
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