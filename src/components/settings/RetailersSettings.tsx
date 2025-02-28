
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Store } from "lucide-react";
import { RetailerDialog } from "./retailers/RetailerDialog";
import { RetailersList } from "./retailers/RetailersList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export const RetailersSettings = () => {
  const [open, setOpen] = useState(false);
  const { profile } = usePagePermissions();

  // Make retailers visible for all authenticated users
  const canAccessRetailers = !!profile; // If profile exists, user is authenticated

  if (!canAccessRetailers) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="space-y-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <CardTitle>Enseignes</CardTitle>
          </div>
          <RetailerDialog
            open={open}
            onOpenChange={setOpen}
            trigger={
              <Button
                className="text-primary-foreground h-8 w-8 p-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md"
              >
                <Plus className="h-4 w-4" />
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
