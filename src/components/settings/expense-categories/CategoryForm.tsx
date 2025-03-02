
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useAddCategory } from "./useAddCategory";

export const CategoryForm = () => {
  const [newCategory, setNewCategory] = useState("");
  const { addCategory, isAdding } = useAddCategory(() => setNewCategory(""));

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    addCategory(newCategory.trim());
  };

  return (
    <div className="flex flex-row items-center space-x-2">
  <div className="flex-grow">
    <Input
      placeholder="Nouvelle catégorie"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
    />
  </div>
  <div className="flex-shrink-0">
    <Button 
      onClick={handleAddCategory} 
      disabled={isAdding} 
      className="flex items-center justify-center text-primary-foreground h-8 w-8 p-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md"
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
</div>
  );
};
