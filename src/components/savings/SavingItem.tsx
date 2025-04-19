
import React from "react";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreVertical } from "lucide-react";

interface SavingItemProps {
  saving: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    is_project_saving?: boolean;
    projet_id?: string;
  };
  onEdit: (saving: any) => void;
  onDelete: (saving: any) => void;
  className?: string;
}

export const SavingItem = ({ saving, onEdit, onDelete, className }: SavingItemProps) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-3 ${className || ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {saving.logo_url ? (
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              <img 
                src={saving.logo_url} 
                alt={saving.name} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-lg font-medium">
                {saving.name.substring(0, 1).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium">{saving.name}</h3>
            <p className="text-tertiary-600 dark:text-tertiary-400 font-semibold">
              {saving.amount.toLocaleString('fr-FR')} €/mois
            </p>
          </div>
           {saving.is_project_saving && (
              <p className="text-sm text-quaternary-600 dark:text-quaternary-400 mt-1">
                Lié à un projet d'épargne
              </p>
            )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(saving)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(saving)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};
