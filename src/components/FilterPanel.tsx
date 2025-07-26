import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface FilterPanelProps {
  categories: string[];
  selectedCategories: string[];
  seasons: string[];
  selectedSeasons: string[];
  showFavoritesOnly: boolean;
  onCategoryChange: (category: string, checked: boolean) => void;
  onSeasonChange: (season: string, checked: boolean) => void;
  onFavoritesToggle: (checked: boolean) => void;
  onClearFilters: () => void;
  onClose: () => void;
}

export const FilterPanel = ({
  categories,
  selectedCategories,
  seasons,
  selectedSeasons,
  showFavoritesOnly,
  onCategoryChange,
  onSeasonChange,
  onFavoritesToggle,
  onClearFilters,
  onClose
}: FilterPanelProps) => {
  const hasActiveFilters = selectedCategories.length > 0 || selectedSeasons.length > 0 || showFavoritesOnly;

  return (
    <Card className="w-full lg:w-80 order-first lg:order-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base sm:text-lg">Filters</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {hasActiveFilters && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedCategories.length + selectedSeasons.length + (showFavoritesOnly ? 1 : 0)} filters active
            </span>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear all
            </Button>
          </div>
        )}

        <div className="space-y-2 sm:space-y-3">
          <h4 className="font-medium text-sm sm:text-base">Categories</h4>
          <div className="space-y-1 sm:space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => onCategoryChange(category, checked as boolean)}
                />
                <label htmlFor={`category-${category}`} className="text-xs sm:text-sm">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h4 className="font-medium text-sm sm:text-base">Seasons</h4>
          <div className="space-y-1 sm:space-y-2">
            {seasons.map(season => (
              <div key={season} className="flex items-center space-x-2">
                <Checkbox
                  id={`season-${season}`}
                  checked={selectedSeasons.includes(season)}
                  onCheckedChange={(checked) => onSeasonChange(season, checked as boolean)}
                />
                <label htmlFor={`season-${season}`} className="text-xs sm:text-sm">
                  {season}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h4 className="font-medium text-sm sm:text-base">Preferences</h4>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorites-only"
              checked={showFavoritesOnly}
              onCheckedChange={onFavoritesToggle}
            />
            <label htmlFor="favorites-only" className="text-xs sm:text-sm">
              Show favorites only
            </label>
          </div>
        </div>

        {selectedCategories.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Selected Categories:</h5>
            <div className="flex flex-wrap gap-1">
              {selectedCategories.map(category => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-3 w-3 ml-1 p-0"
                    onClick={() => onCategoryChange(category, false)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};