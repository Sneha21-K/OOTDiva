import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Image, Upload, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onFileChange?: (file: File) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const ImageUpload = ({ 
  value, 
  onChange, 
  onFileChange,
  label = "Image",
  placeholder = "Enter image URL or upload from device",
  className = ""
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onChange(result);
        onFileChange?.(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setPreview(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (urlInputRef.current) urlInputRef.current.value = "";
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

  const currentImage = preview || value;

  return (
    <div className={`space-y-3 ${className}`}>
      <Label>{label}</Label>
      
      {/* Upload Options */}
      <div className="space-y-3">
        {/* Mobile-specific buttons */}
        {isMobile && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={openGallery}
              className="flex-1 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            >
              <Image className="w-4 h-4 mr-2" />
              Gallery
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={openCamera}
              className="flex-1 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            >
              <Camera className="w-4 h-4 mr-2" />
              Camera
            </Button>
          </div>
        )}

        {/* Desktop upload area */}
        {!isMobile && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-purple-400 bg-purple-50' 
                : 'border-purple-200 hover:border-purple-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-sm text-purple-600 mb-2">
              Drag and drop an image here, or click to select
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            >
              Choose File
            </Button>
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

        {/* URL Input */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {isMobile ? "Or enter image URL:" : "Or enter image URL:"}
          </div>
          <Input
            ref={urlInputRef}
            type="url"
            placeholder={placeholder}
            value={value}
            onChange={handleUrlChange}
            className="rounded-lg border-purple-200 focus:ring-purple-300"
          />
        </div>
      </div>

      {/* Preview */}
      {currentImage && (
        <div className="relative">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={currentImage}
                alt="Preview"
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl border border-purple-100 shadow"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-6 h-6"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <span className="text-xs text-purple-400">Preview</span>
          </div>
        </div>
      )}
    </div>
  );
}; 