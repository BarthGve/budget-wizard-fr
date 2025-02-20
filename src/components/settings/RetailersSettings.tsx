
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Store } from "lucide-react";
import { RetailerDialog } from "./retailers/RetailerDialog";
import { RetailersList } from "./retailers/RetailersList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const RetailersSettings = () => {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <CardTitle>Enseignes</CardTitle>
          </div>
          <RetailerDialog 
            open={open}
            onOpenChange={setOpen}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une enseigne
              </Button>
            }
            onRetailerSaved={() => {
              setOpen(false);
            }}
          />
        </div>
        <CardDescription>
          Gérez vos enseignes pour le suivi des dépenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RetailersList key="retailers-list" />
      </CardContent>
    </Card>
  );
};
