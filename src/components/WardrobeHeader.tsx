import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface WardrobeHeaderProps {
  onAddItem: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterToggle: () => void;
}

export const WardrobeHeader = ({ onAddItem, searchTerm, onSearchChange, onFilterToggle }: WardrobeHeaderProps) => {
  const location = useLocation();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-50 border-b border-orange-200 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 max-w-7xl mx-auto">
        {/* Left: App Name */}
        <div className="flex items-center gap-4">
          <h1
            className="text-3xl font-extrabold text-purple-700 tracking-tight font-sans drop-shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => { window.location.href = "/"; }}
          >
            OOTDiva
          </h1>
        </div>
        {/* Center: Search and Filter */}
        <div className="flex-1 flex items-center gap-4 max-w-2xl mx-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search your clothes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={onFilterToggle} className="ml-2">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={onAddItem} className="ml-2">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
        {/* Right: Outfits and Login */}
        <div className="flex items-center gap-2">
          <Link
            to="/outfits"
            className={`px-4 py-2 rounded-full font-medium transition-colors text-white bg-purple-600 hover:bg-purple-700 ${location.pathname === '/outfits' ? 'bg-purple-700' : ''}`}
          >
            Outfits
          </Link>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold px-6 shadow">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};