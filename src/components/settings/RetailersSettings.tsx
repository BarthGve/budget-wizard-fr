
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import { RetailerDialog } from "./retailers/RetailerDialog";
import { useRetailers } from "./retailers/useRetailers";
import { RetailersList } from "./retailers/RetailersList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const RetailersSettings = () => {
  const [open, setOpen] = useState(false);
  const { retailers, isLoading } = useRetailers();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Tag className="h-5 w-5" />
          <CardTitle>Enseignes</CardTitle>
        </div>
        <CardDescription>
          Gérez vos enseignes pour le suivi des dépenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <RetailerDialog 
              open={open}
              onOpenChange={setOpen}
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une enseigne
                </Button>
              }
              onRetailerSaved={() => setOpen(false)}
            />
          </div>
          <RetailersList />
        </div>
      </CardContent>
    </Card>
  );
};
