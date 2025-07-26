import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClothingItemType } from "@/types/wardrobe";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";

interface AddItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ClothingItemType, 'id'>) => void;
  editItem?: ClothingItemType | null;
}

const categories = [
  'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Underwear', 'Activewear'
];

const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'All'];

export const AddItemForm = ({ open, onClose, onSubmit, editItem }: AddItemFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<ClothingItemType, 'id'>>({
    name: editItem?.name || '',
    category: editItem?.category || '',
    subcategory: editItem?.subcategory || '',
    brand: editItem?.brand || '',
    color: editItem?.color || '',
    season: editItem?.season || 'All',
    size: editItem?.size || '',
    imageUrl: editItem?.imageUrl || '',
    purchaseDate: editItem?.purchaseDate || '',
    price: editItem?.price || undefined,
    isFavorite: editItem?.isFavorite || false,
    rating: editItem?.rating || undefined,
    wearCount: editItem?.wearCount || 0,
    lastWorn: editItem?.lastWorn || undefined,
    tags: editItem?.tags || [],
    notes: editItem?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.color) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, category, and color.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(formData);
    onClose();
    toast({
      title: editItem ? "Item updated" : "Item added",
      description: `${formData.name} has been ${editItem ? 'updated' : 'added to'} your wardrobe.`
    });
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Blue Denim Jacket"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="e.g., Navy Blue"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g., Zara"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select value={formData.season} onValueChange={(value) => setFormData(prev => ({ ...prev, season: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map(season => (
                    <SelectItem key={season} value={season}>{season}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ImageUpload
            value={formData.imageUrl}
            onChange={(value) => setFormData(prev => ({ ...prev, imageUrl: value }))}
            label="Item Image"
            placeholder="Enter image URL or upload from device"
          />

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="casual, work, summer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editItem ? 'Update' : 'Add'} Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};