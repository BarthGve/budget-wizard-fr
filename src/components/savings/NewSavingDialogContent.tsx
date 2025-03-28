
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { DialogTitle, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { LogoPreview } from "./LogoPreview";
import { Leaf, X, PiggyBank, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  colorScheme?: "green" | "blue" | "purple";
  isMobile?: boolean;
}

export function NewSavingDialogContent({
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
  isMobile = false
}: NewSavingDialogContentProps) {
  const isEditMode = !!saving?.id;
  
  // Couleurs dynamiques basées sur le colorScheme
  const colors = {
    green: {
      iconBg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      headingText: "text-green-900 dark:text-green-200",
      descriptionText: "text-green-700/80 dark:text-green-300/80",
      buttonBg: "bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600",
      lightBg: "from-white via-green-50/40 to-green-100/70",
      darkBg: "dark:from-gray-900 dark:via-green-950/20 dark:to-green-900/30",
      gradientFrom: "from-green-400",
      gradientTo: "to-emerald-300",
      darkGradientFrom: "dark:from-green-700",
      darkGradientTo: "dark:to-emerald-600",
      inputFocus: "focus-visible:ring-green-500/70 dark:focus-visible:ring-green-400/60"
    },
    blue: {
      iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      headingText: "text-blue-900 dark:text-blue-200",
      descriptionText: "text-blue-700/80 dark:text-blue-300/80",
      buttonBg: "bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600",
      lightBg: "from-white via-blue-50/40 to-blue-100/70",
      darkBg: "dark:from-gray-900 dark:via-blue-950/20 dark:to-blue-900/30",
      gradientFrom: "from-blue-400",
      gradientTo: "to-sky-300",
      darkGradientFrom: "dark:from-blue-700",
      darkGradientTo: "dark:to-sky-600",
      inputFocus: "focus-visible:ring-blue-500/70 dark:focus-visible:ring-blue-400/60"
    },
    purple: {
      iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      headingText: "text-purple-900 dark:text-purple-200",
      descriptionText: "text-purple-700/80 dark:text-purple-300/80",
      buttonBg: "bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600",
      lightBg: "from-white via-purple-50/40 to-purple-100/70",
      darkBg: "dark:from-gray-900 dark:via-purple-950/20 dark:to-purple-900/30",
      gradientFrom: "from-purple-400",
      gradientTo: "to-violet-300",
      darkGradientFrom: "dark:from-purple-700",
      darkGradientTo: "dark:to-violet-600",
      inputFocus: "focus-visible:ring-purple-500/70 dark:focus-visible:ring-purple-400/60"
    },
  };
  const currentColors = colors[colorScheme];
  
  return (
    <div className={cn(
      "relative flex flex-col",
      isMobile ? "min-h-[calc(100%-env(safe-area-inset-bottom,0))]" : "",
      "bg-gradient-to-br",
      currentColors.lightBg,
      currentColors.darkBg
    )}>
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br",
        currentColors.gradientFrom,
        currentColors.gradientTo,
        currentColors.darkGradientFrom,
        currentColors.darkGradientTo
      )} />
      
      {/* Radial gradient pour texture */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01]" />
      
      {/* En-tête */}
      <DialogHeader className={cn("relative z-10 p-6", isMobile ? "pt-4 pb-4" : "")}>
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-lg", currentColors.iconBg)}>
            <PiggyBank className="h-5 w-5" />
          </div>
          <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
            {isEditMode ? "Modifier le versement" : "Nouveau versement"}
          </DialogTitle>
        </div>
        <p className={cn("mt-2 ml-[52px] text-base", currentColors.descriptionText)}>
          {isEditMode ? "Modifiez les détails de votre versement mensuel" : "Ajoutez un nouveau versement mensuel à votre épargne"}
        </p>
        
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="sr-only">Fermer</span>
        </DialogClose>
      </DialogHeader>
      
      {/* Ligne séparatrice */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200/60 to-transparent dark:via-gray-700/40" />
      
      {/* Contenu du formulaire */}
      <div className={cn("relative z-10 space-y-4 p-6", isMobile ? "pb-20" : "")}>
        {/* Champ Nom */}
        <div className="space-y-2">
          <FormLabel htmlFor="name" className="text-gray-700 dark:text-gray-300">
            Nom du versement
          </FormLabel>
          <Input
            id="name"
            placeholder="ex: Livret A"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={cn(
              "bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700",
              currentColors.inputFocus
            )}
          />
        </div>
        
        {/* Champ Domaine (pour logo) */}
        <div className="space-y-2 relative">
          <FormLabel htmlFor="domain" className="text-gray-700 dark:text-gray-300">
            Domaine (pour le logo)
          </FormLabel>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                id="domain"
                placeholder="ex: credit-agricole.fr"
                value={domain}
                onChange={(e) => onDomainChange(e.target.value)}
                className={cn(
                  "bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700",
                  currentColors.inputFocus
                )}
              />
            </div>
            <LogoPreview domain={domain} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Saisissez le nom de domaine pour afficher le logo
          </p>
        </div>
        
        {/* Champ Montant */}
        <div className="space-y-2">
          <FormLabel htmlFor="amount" className="text-gray-700 dark:text-gray-300">
            Montant mensuel (€)
          </FormLabel>
          <Input
            id="amount"
            type="number"
            min="0"
            placeholder="100"
            value={amount || ""}
            onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
            className={cn(
              "bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700",
              currentColors.inputFocus
            )}
          />
        </div>
        
        {/* Champ Description */}
        <div className="space-y-2">
          <FormLabel htmlFor="description" className="text-gray-700 dark:text-gray-300">
            Description (optionnel)
          </FormLabel>
          <Input
            id="description"
            placeholder="Description du versement"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className={cn(
              "bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700",
              currentColors.inputFocus
            )}
          />
        </div>
      </div>
      
      {/* Boutons d'action - en bas fixe pour mobile, en bas normal pour desktop */}
      <div className={cn(
        "flex justify-end gap-4 p-6",
        isMobile ? "fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent pt-4" : ""
      )}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="text-gray-700 dark:text-gray-300"
        >
          Annuler
        </Button>
        <Button
          type="button"
          onClick={onSave}
          className={cn(
            "text-white",
            currentColors.buttonBg
          )}
          disabled={!name || amount <= 0}
        >
          <span className="flex items-center gap-1.5">
            {isEditMode ? (
              <>
                Mettre à jour
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Enregistrer
                <Leaf className="h-4 w-4" />
              </>
            )}
          </span>
        </Button>
      </div>
    </div>
  );
}
