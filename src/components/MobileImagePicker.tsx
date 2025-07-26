import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Image, Upload, X } from "lucide-react";

interface MobileImagePickerProps {
  onImageSelect: (imageData: string) => void;
  onClose?: () => void;
  title?: string;
}

export const MobileImagePicker = ({ 
  onImageSelect, 
  onClose,
  title = "Select Image"
}: MobileImagePickerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = undefined;
      fileInputRef.current.click();
    }
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = "environment";
      fileInputRef.current.click();
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {!selectedImage ? (
          <div className="space-y-4">
            <div className="text-center text-gray-600 mb-4">
              Choose how you'd like to add an image
            </div>
            
            <Button
              onClick={openGallery}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl flex items-center justify-center gap-3"
            >
              <Image className="w-5 h-5" />
              Choose from Gallery
            </Button>
            
            <Button
              onClick={openCamera}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl flex items-center justify-center gap-3"
            >
              <Camera className="w-5 h-5" />
              Take Photo
            </Button>
            
            <div className="text-xs text-gray-500 text-center">
              Your photos will be stored locally on your device
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-48 h-48 object-cover rounded-xl mx-auto border border-gray-200"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={clearImage}
                variant="outline"
                className="flex-1"
              >
                Choose Different
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Use This Image
              </Button>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}; 