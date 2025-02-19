
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, X, Save } from "lucide-react";
import { useUpdateCategory } from "./useUpdateCategory";
import { useDeleteCategory } from "./useDeleteCategory";
import { Category } from "./types";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

interface CategoryListProps {
  categories: Category[];
}

export const CategoryList = ({ categories }: CategoryListProps) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { updateCategory } = useUpdateCategory(() => setEditingCategory(null));
  const { deleteCategory } = useDeleteCategory();

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    updateCategory(editingCategory);
  };

  return (
    <div className="space-y-2">
      {categories?.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-2 rounded-md border"
        >
          {editingCategory?.id === category.id ? (
            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, name: e.target.value })
                }
                onKeyPress={(e) => e.key === "Enter" && handleUpdateCategory()}
              />
              <Button size="sm" onClick={handleUpdateCategory}>
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingCategory(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <span>{category.name}</span>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingCategory(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DeleteCategoryDialog categoryId={category.id} onDelete={deleteCategory} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
