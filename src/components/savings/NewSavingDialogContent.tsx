
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
  colorScheme: "green" | "blue" | "purple";
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
  colorScheme = "green",
}: NewSavingDialogContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Couleurs dynamiques selon le colorScheme
  const colors = {
    green: {
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-400",
      darkGradientFrom: "dark:from-green-600",
      darkGradientTo: "dark:to-emerald-500",
      iconBg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      headingText: "text-green-900 dark:text-green-200",
      descriptionText: "text-green-700/80 dark:text-green-300/80",
      buttonBg: "bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600",
      lightBg: "from-white via-green-50/40 to-green-100/70",
      darkBg: "dark:from-gray-900 dark:via-green-950/20 dark:to-green-900/30",
      borderLight: "border-green-100/70",
      borderDark: "dark:border-green-800/20",
    },
    blue: {
      gradientFrom: "from-blue-500",
      gradientTo: "to-sky-400",
      darkGradientFrom: "dark:from-blue-600",
      darkGradientTo: "dark:to-sky-500",
      iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      headingText: "text-blue-900 dark:text-blue-200",
      descriptionText: "text-blue-700/80 dark:text-blue-300/80",
      buttonBg: "bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600",
      lightBg: "from-white via-blue-50/40 to-blue-100/70",
      darkBg: "dark:from-gray-900 dark:via-blue-950/20 dark:to-blue-900/30",
      borderLight: "border-blue-100/70",
      borderDark: "dark:border-blue-800/20",
    },
    purple: {
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-400",
      darkGradientFrom: "dark:from-purple-600",
      darkGradientTo: "dark:to-violet-500",
      iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      headingText: "text-purple-900 dark:text-purple-200",
      descriptionText: "text-purple-700/80 dark:text-purple-300/80",
      buttonBg: "bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600",
      lightBg: "from-white via-purple-50/40 to-purple-100/70",
      darkBg: "dark:from-gray-900 dark:via-purple-950/20 dark:to-purple-900/30",
      borderLight: "border-purple-100/70", 
      borderDark: "dark:border-purple-800/20",
    },
  };
  const currentColors = colors[colorScheme];

  return (
    <div 
      ref={contentRef}
      className={cn(
        "relative flex flex-col pb-6 p-6 rounded-lg",
        "bg-gradient-to-br",
        currentColors.lightBg,
        currentColors.darkBg
      )}
    >
      <div className={cn(
        "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
        currentColors.gradientFrom,
        currentColors.gradientTo,
        currentColors.darkGradientFrom,
        currentColors.darkGradientTo
      )} />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
      
      <DialogHeader className="relative z-10 mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-lg", currentColors.iconBg)}>
            {saving ? <EditIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
          </div>
          <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
            {saving ? "Modifier un versement" : "Ajouter un versement"}
          </DialogTitle>
        </div>
        <div className="ml-[52px] mt-2">
          <DialogDescription className={cn("text-base", currentColors.descriptionText)}>
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
            className={cn(
              "text-white px-6 py-2 rounded-lg",
              currentColors.buttonBg
            )}
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
