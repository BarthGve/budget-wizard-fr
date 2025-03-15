
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_CATEGORIES } from "./types";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  uniqueCategories: string[];
}

export const TableFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  uniqueCategories,
}: TableFiltersProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto"
    >
      {/* Champ de recherche */}
      <div 
        className={cn(
          "relative w-full sm:w-[280px] group transition-all duration-200",
          "focus-within:ring-2 focus-within:ring-offset-2 rounded-md",
          // Light mode
          "focus-within:ring-gray-200 focus-within:ring-offset-white",
          // Dark mode
          "dark:focus-within:ring-gray-700 dark:focus-within:ring-offset-gray-900"
        )}
      >
        <Search 
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
            // Light mode
            "text-gray-400 group-focus-within:text-blue-500",
            // Dark mode 
            "dark:text-gray-500 dark:group-focus-within:text-blue-400"
          )} 
        />
        <Input
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "pl-9 h-10 pr-4 transition-all duration-200 border w-full",
            // Light mode styles
            "bg-white border-gray-200 placeholder:text-gray-400",
            "focus:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0",
            "hover:border-gray-300",
            // Dark mode styles
            "dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-500",
            "dark:focus:border-gray-600 dark:hover:border-gray-600"
          )}
        />
        
        {/* Indicateur de recherche active */}
        {searchTerm && (
          <div 
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full",
              // Light mode
              "bg-blue-500",
              // Dark mode
              "dark:bg-blue-400"
            )}
          />
        )}
      </div>
      
      {/* Filtre de catégorie */}
      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger 
          className={cn(
            "w-full sm:w-[250px] h-10 transition-all duration-200",
            // Light mode
            "bg-white border-gray-200 text-gray-800",
            "hover:border-gray-300 data-[state=open]:border-gray-300",
            // Dark mode
            "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200",
            "dark:hover:border-gray-600 dark:data-[state=open]:border-gray-600"
          )}
        >
          <div className="flex items-center">
            <div 
              className={cn(
                "mr-2 h-6 w-6 flex items-center justify-center rounded-md",
                // Light mode - légère teinte bleue pour le fond de l'icône
                "bg-blue-50 text-blue-600",
                // Dark mode
                "dark:bg-blue-900/30 dark:text-blue-400"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </div>
            <SelectValue placeholder="Filtrer par catégorie" />
          </div>
        </SelectTrigger>
        
        <SelectContent 
          className={cn(
            "border-0 shadow-lg min-w-[240px] overflow-hidden p-0",
            // Light mode
            "bg-white",
            // Dark mode
            "dark:bg-gray-800"
          )}
          style={{
            boxShadow: isDarkMode
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 1px 4px rgba(0, 0, 0, 0.3)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div 
            className={cn(
              "px-1.5 py-1.5 border-b",
              // Light mode
              "border-gray-100 bg-gray-50/70",
              // Dark mode
              "dark:border-gray-700 dark:bg-gray-900/50"
            )}
          >
            <SelectGroup>
              <SelectLabel 
                className={cn(
                  "px-2.5 py-1.5 text-xs font-medium",
                  // Light mode 
                  "text-gray-500",
                  // Dark mode
                  "dark:text-gray-400"
                )}
              >
                CATÉGORIES
              </SelectLabel>
            </SelectGroup>
          </div>
          
          <div className="p-1">
            <SelectItem 
              value={ALL_CATEGORIES} 
              className={cn(
                "rounded-md my-0.5 cursor-pointer",
                // Light mode hover
                "hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-50",
                "data-[state=checked]:text-blue-700 data-[state=checked]:font-medium",
                // Dark mode
                "dark:hover:bg-blue-900/20 dark:focus:bg-blue-900/20 dark:data-[state=checked]:bg-blue-900/30",
                "dark:data-[state=checked]:text-blue-300"
              )}
            >
              <div className="flex items-center">
                <span 
                  className={cn(
                    "mr-2 h-2 w-2 rounded-full",
                    // Light mode 
                    "bg-gray-300",
                    // Dark mode
                    "dark:bg-gray-600",
                    // Selected state
                    "data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                  )}
                />
                Toutes les catégories
              </div>
            </SelectItem>
            
            {uniqueCategories.map((category) => (
              <SelectItem 
                key={category} 
                value={category}
                className={cn(
                  "rounded-md my-0.5 cursor-pointer",
                  // Light mode hover
                  "hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-50",
                  "data-[state=checked]:text-blue-700 data-[state=checked]:font-medium",
                  // Dark mode
                  "dark:hover:bg-blue-900/20 dark:focus:bg-blue-900/20 dark:data-[state=checked]:bg-blue-900/30",
                  "dark:data-[state=checked]:text-blue-300"
                )}
              >
                <div className="flex items-center">
                  <span 
                    className={cn(
                      "mr-2 h-2 w-2 rounded-full",
                      // Light mode
                      "bg-gray-300",
                      // Dark mode
                      "dark:bg-gray-600",
                      // Selected state
                      "data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                    )}
                  />
                  {category}
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </motion.div>
  );
};
