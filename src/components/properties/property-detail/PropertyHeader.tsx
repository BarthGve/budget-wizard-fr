
import { Property } from "@/types/property";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AddExpenseDialog } from "@/components/properties/AddExpenseDialog";
import { PropertyWeather } from "@/components/properties/PropertyWeather";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface PropertyHeaderProps {
  property: Property;
  refetchExpenses: () => void;
  expenseToEdit: any;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (value: boolean) => void;
}

export const PropertyHeader = ({ 
  property, 
  refetchExpenses, 
  expenseToEdit,
  isEditDialogOpen,
  setIsEditDialogOpen
}: PropertyHeaderProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Suppression d'un bien
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", property.id);

      if (error) throw error;
      toast.success("Bien supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      navigate("/properties");
    } catch (error) {
      console.error("Erreur lors de la suppression du bien :", error);
      toast.error("Erreur lors de la suppression du bien");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div 
      className="flex flex-col gap-6"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
          }
        }
      }}
    >
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/properties" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit">
          <ChevronLeft className="h-4 w-4" />
          <span>Retour aux biens</span>
        </Link>
      </motion.div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-3XL text-3xl">{property.name}</h1>
          <p className="text-muted-foreground">{property.address}</p>
        </div>
        <div className="flex items-center gap-6">
          {property.latitude && property.longitude && 
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PropertyWeather latitude={property.latitude} longitude={property.longitude} />
            </motion.div>
          }
          {/* Ajout du bouton de suppression */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost"
                size="icon"
                disabled={isDeleting}
                aria-label="Supprimer le bien"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le bien</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <AddExpenseDialog 
              propertyId={property.id} 
              onExpenseAdded={() => refetchExpenses()} 
              expense={expenseToEdit} 
              open={isEditDialogOpen} 
              onOpenChange={setIsEditDialogOpen} 
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
