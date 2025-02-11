
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag, Pencil, X, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

export const ExpenseCategoriesSettings = () => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["recurring-expense-categories"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("recurring_expense_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase
        .from("recurring_expense_categories")
        .insert({ name: newCategory.trim(), profile_id: user?.id });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["recurring-expense-categories"] });
      setNewCategory("");
      toast.success("Catégorie ajoutée avec succès");
    } catch (error: any) {
      console.error("Error adding category:", error);
      toast.error(error.message || "Erreur lors de l'ajout de la catégorie");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from("recurring_expense_categories")
        .update({ name: editingCategory.name })
        .eq("id", editingCategory.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["recurring-expense-categories"] });
      setEditingCategory(null);
      toast.success("Catégorie mise à jour avec succès");
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(error.message || "Erreur lors de la mise à jour de la catégorie");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("recurring_expense_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["recurring-expense-categories"] });
      toast.success("Catégorie supprimée avec succès");
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Erreur lors de la suppression de la catégorie");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Tag className="h-5 w-5" />
          <CardTitle>Catégories de dépenses</CardTitle>
        </div>
        <CardDescription>Gérez les catégories de dépenses récurrentes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Nouvelle catégorie"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
