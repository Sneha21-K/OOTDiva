import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { AddOutfitForm } from "@/components/AddOutfitForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Link } from "react-router-dom";
import { Outfit, outfitsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const sampleOutfits = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop",
    name: "Casual Day Out"
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop",
    name: "Evening Chic"
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1469398715555-76331a6c7fa0?w=400&h=400&fit=crop",
    name: "Work Ready"
  }
];

const Outfits = () => {
  const { toast } = useToast();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
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
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    try {
      setLoading(true);
      const outfitsData = await outfitsAPI.getOutfits();
      setOutfits(outfitsData);
    } catch (error) {
      console.error('Error loading outfits:', error);
      toast({
        title: "Error",
        description: "Failed to load outfits. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddOutfit = async (outfitData: { name: string; imageUrl: string }) => {
    try {
      const newOutfit = await outfitsAPI.createOutfit({
        name: outfitData.name,
        image_url: outfitData.imageUrl,
        items: []
      });
      
      setOutfits(prev => [newOutfit, ...prev]);
      setShowAddForm(false);
      
      toast({
        title: "Outfit added",
        description: `${outfitData.name} has been added to your outfits.`
      });
    } catch (error) {
      console.error('Error adding outfit:', error);
      toast({
        title: "Error",
        description: "Failed to add outfit. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOutfit = async (id: string) => {
    const outfit = outfits.find(outfit => outfit.id === id);
    const outfitName = outfit?.name || 'this outfit';
    
    // Show one-time warning for deletions
    if (!hasShownDeleteWarning) {
      setConfirmDialogConfig({
        title: "⚠️ Warning",
        description: `This action will permanently delete ${outfitName}. This cannot be undone.\n\nYou will see this warning only once per session.`,
        onConfirm: async () => {
          setHasShownDeleteWarning(true);
          try {
            await outfitsAPI.deleteOutfit(id);
            setOutfits(prev => prev.filter(outfit => outfit.id !== id));
            
            toast({
              title: "Outfit deleted",
              description: "The outfit has been removed."
            });
          } catch (error) {
            console.error('Error deleting outfit:', error);
            toast({
              title: "Error",
              description: "Failed to delete outfit. Please try again.",
              variant: "destructive"
            });
          }
        }
      });
      setShowConfirmDialog(true);
      return;
    }
    
    setConfirmDialogConfig({
      title: "Delete Outfit",
      description: `Are you sure you want to delete "${outfitName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await outfitsAPI.deleteOutfit(id);
          setOutfits(prev => prev.filter(outfit => outfit.id !== id));
          
          toast({
            title: "Outfit deleted",
            description: "The outfit has been removed."
          });
        } catch (error) {
          console.error('Error deleting outfit:', error);
          toast({
            title: "Error",
            description: "Failed to delete outfit. Please try again.",
            variant: "destructive"
          });
        }
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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-purple-700 tracking-tight drop-shadow-sm font-sans">Outfits</h1>
        </div>
        <Button
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full font-semibold shadow text-xs sm:text-sm"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Add Outfit
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {outfits.map(outfit => (
          <div
            key={outfit.id}
            className="bg-white border border-purple-200 rounded-2xl shadow-lg p-3 sm:p-4 flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-2xl group relative"
          >
            <div className="aspect-square w-full bg-purple-50 rounded-xl overflow-hidden mb-3 border-2 border-purple-100 group-hover:border-purple-300 transition-all">
              <img src={outfit.image_url || ''} alt={outfit.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-purple-700 font-semibold text-sm sm:text-base lg:text-lg text-center font-sans group-hover:text-purple-900 transition-colors">
              {outfit.name}
            </div>
            {/* Delete button */}
            <button
              className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 shadow-sm transition-colors"
              onClick={() => handleDeleteOutfit(outfit.id)}
              title="Delete outfit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <AddOutfitForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddOutfit}
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

export default Outfits; 