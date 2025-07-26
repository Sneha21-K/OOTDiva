import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WardrobeStats as StatsType } from "@/types/wardrobe";
import { TrendingUp, Heart, Shirt, Calendar } from "lucide-react";

interface WardrobeStatsProps {
  stats: StatsType;
}

export const WardrobeStats = ({ stats }: WardrobeStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Items</CardTitle>
        <Shirt className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="text-lg sm:text-2xl font-bold">{stats.totalItems}</div>
          <p className="text-xs text-muted-foreground">items in your wardrobe</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Favorites</CardTitle>
          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="text-lg sm:text-2xl font-bold">{stats.favoriteItems}</div>
          <p className="text-xs text-muted-foreground">favorite pieces</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Most Worn</CardTitle>
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="text-lg sm:text-2xl font-bold">{stats.mostWornCategory}</div>
          <p className="text-xs text-muted-foreground">category</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Recent Additions</CardTitle>
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="text-lg sm:text-2xl font-bold">{stats.recentlyAdded.length}</div>
          <p className="text-xs text-muted-foreground">this month</p>
        </CardContent>
      </Card>
    </div>
  );
};