
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { CategoryForm } from "./CategoryForm";
import { CategoryList } from "./CategoryList";
import { useCategories } from "./useCategories";

export const ExpenseCategoriesSettings = () => {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

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
          <CategoryForm />
          <CategoryList categories={categories || []} />
        </div>
      </CardContent>
    </Card>
  );
};
