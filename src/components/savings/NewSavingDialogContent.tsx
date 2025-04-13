import React, { useRef } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SavingForm } from "./SavingForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EditIcon, PlusCircleIcon, PiggyBank } from "lucide-react";

interface NewSavingDialogContentProps {
  saving?: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
  };
  name: string;
  onNameChange: (name: string) => void;
  domain: string;
  onDomainChange: (domain: string) => void;
  amount: number;
  onAmountChange: (amount: number) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const NewSavingDialogContent = ({
  saving,
  name,
  onNameChange,
  domain,
  onDomainChange,
  amount,
  onAmountChange,
  description,
  onDescriptionChange,
  onSave,
  onCancel,
}: NewSavingDialogContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={contentRef}
      className="relative flex flex-col pb-6 p-6 rounded-lg w-full h-full bg-gradient-to-br from-white via-green-50/40 to-green-100/70 dark:from-gray-900 dark:via-green-950/20 dark:to-green-900/30"
    >
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg from-green-500 to-emerald-400 dark:from-green-600 dark:to-emerald-500" />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
      
      <DialogHeader className="relative z-10 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            {saving ? <EditIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
          </div>
          <DialogTitle className="text-2xl font-bold text-green-900 dark:text-green-200">
            {saving ? "Modifier un versement" : "Ajouter un versement"}
          </DialogTitle>
        </div>
        <div className="ml-[52px] mt-2">
          <DialogDescription className="text-base text-green-700/80 dark:text-green-300/80">
            {saving
              ? "Modifiez les informations de votre versement d'épargne."
              : "Ajoutez un nouveau versement mensuel facilement."}
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="relative z-10 px-1">
        <SavingForm
          name={name}
          onNameChange={onNameChange}
          domain={domain}
          onDomainChange={onDomainChange}
          amount={amount}
          onAmountChange={onAmountChange}
          description={description}
          onDescriptionChange={onDescriptionChange}
        />

        <div className="flex justify-end mt-5 gap-3">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            Annuler
          </Button>
          <Button 
            onClick={onSave}
            className="text-white px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600"
          >
            {saving ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
        <PiggyBank className="w-full h-full" />
      </div>
    </div>
  );
};