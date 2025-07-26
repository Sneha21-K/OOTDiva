import { useState } from "react";
import { getFallbackImage } from "@/utils/imageConstants";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackCategory?: string;
  onError?: () => void;
  onLoad?: () => void;
}

export const ImageWithFallback = ({ 
  src, 
  alt, 
  className = "", 
  fallbackCategory,
  onError,
  onLoad 
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // If there's an error or no src, use fallback image
  const imageSrc = hasError || !src ? getFallbackImage(fallbackCategory) : src;

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
}; 