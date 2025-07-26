import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./ImageUpload";

interface AddOutfitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (outfit: { name: string; imageUrl: string }) => void;
  title?: string;
  placeholder?: string;
}

export const AddOutfitForm = ({ open, onClose, onSubmit, title = "Add New Category", placeholder = "e.g., Activewear, Formal Wear" }: AddOutfitFormProps) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl) return;
    onSubmit({ name, imageUrl });
    setName("");
    setImageUrl("");
    onClose();
  };

  const handleDialogClose = () => {
    setName("");
    setImageUrl("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-700 font-bold text-xl">{title}</DialogTitle>
          <DialogDescription className="text-purple-500">
            Add a new item to your wardrobe collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="outfit-name">Name</Label>
            <Input
              id="outfit-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={placeholder}
              required
              className="rounded-lg border-purple-200 focus:ring-purple-300"
            />
          </div>
          
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            label="Category Image"
            placeholder="Enter image URL or upload from device"
          />
          
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleDialogClose} className="flex-1 rounded-full border-purple-200 text-purple-700">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow">
              Add Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 