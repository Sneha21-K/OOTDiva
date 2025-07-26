import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreview(ev.target?.result as string);
        setImageUrl("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setFilePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!filePreview && !imageUrl)) return;
    onSubmit({ name, imageUrl: filePreview || imageUrl });
    setName("");
    setImageUrl("");
    setFilePreview(null);
    onClose();
  };

  const handleDialogClose = () => {
    setName("");
    setImageUrl("");
    setFilePreview(null);
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
          <div className="space-y-2">
            <Label>Category Image</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="rounded-lg border-purple-200 bg-purple-50 file:bg-purple-100 file:text-purple-700 flex-1"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 font-medium"
              >
                📷 Camera
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">or paste an image URL below</div>
            <Input
              type="url"
              placeholder="https://example.com/category-image.jpg"
              value={imageUrl}
              onChange={handleUrlChange}
              className="rounded-lg border-purple-200"
            />
          </div>
          {(filePreview || imageUrl) && (
            <div className="flex flex-col items-center gap-2">
              <img
                src={filePreview || imageUrl}
                alt="Outfit Preview"
                className="w-40 h-40 object-cover rounded-xl border border-purple-100 shadow"
              />
              <span className="text-xs text-purple-400">Preview</span>
            </div>
          )}
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