import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Edit, Trash2, Star } from "lucide-react";
import { ClothingItemType } from "@/types/wardrobe";

interface ClothingItemProps {
  item: ClothingItemType;
  onEdit: (item: ClothingItemType) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const ClothingItem = ({ item, onEdit, onDelete, onToggleFavorite }: ClothingItemProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="aspect-square bg-muted rounded-lg mb-3 relative overflow-hidden">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              📷 No Image
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-background/80 hover:bg-background"
              onClick={() => onToggleFavorite(item.id)}
            >
              <Heart 
                className={`h-4 w-4 ${item.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
              />
            </Button>
            {item.rating && (
              <div className="bg-background/80 rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{item.rating}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            {item.season && (
              <Badge variant="outline" className="text-xs">
                {item.season}
              </Badge>
            )}
          </div>
          
          {item.brand && (
            <p className="text-xs text-muted-foreground">by {item.brand}</p>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Worn {item.wearCount || 0} times</span>
            {item.lastWorn && (
              <span>Last: {new Date(item.lastWorn).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};