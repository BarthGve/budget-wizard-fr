import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SavingForm } from "./SavingForm";
import { useLogoPreview } from "./hooks/useLogoPreview";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface NewSavingDialogProps {
  onSavingAdded: () => void;
  trigger?: React.ReactNode;
  saving?: {
    id: string;
    name: string;
    amount: number;
    logo_url?: string;
    description?: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NewSavingDialog = ({ 
  onSavingAdded, 
  trigger, 
  saving, 
  open: controlledOpen, 
  onOpenChange 
}: NewSavingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newSavingName, setNewSavingName] = useState("");
  const [newSavingAmount, setNewSavingAmount] = useState(0);
  const [newSavingDescription, setNewSavingDescription] = useState("");
  const [domain, setDomain] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { previewLogoUrl, isLogoValid } = useLogoPreview(domain);
  const contentRef = useRef<HTMLDivElement>(null);
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  // Déterminer si nous devons activer le défilement
  const [needsScrolling, setNeedsScrolling] = useState(false);
  
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const checkOverflow = () => {
        const element = contentRef.current;
        if (element) {
          setNeedsScrolling(element.scrollHeight > window.innerHeight * 0.8);
        }
      };
      
      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      
      return () => {
        window.removeEventListener('resize', checkOverflow);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (saving) {
      setNewSavingName(saving.name);
      setNewSavingAmount(saving.amount);
      setNewSavingDescription(saving.description || "");
      if (saving.logo_url && saving.logo_url !== "/placeholder.svg") {
        setDomain(saving.logo_url.replace("https://logo.clearbit.com/", ""));
      }
    }
  }, [saving]);

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setOpen(newOpen);
    }
  };

  const isOpen = controlledOpen !== undefined ? controlledOpen : open;

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      return data;
    },
  });

  const resetForm = () => {
    setNewSavingName("");
    setNewSavingAmount(0);
    setNewSavingDescription("");
    setDomain("");
  };

  const addNewMonthlySaving = async () => {
    if (!newSavingName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre versement mensuel",
        variant: "destructive",
      });
      return;
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate("/login");
      return;
    }

    let logoUrl = '/placeholder.svg';
    if (domain.trim() && isLogoValid && previewLogoUrl) {
      logoUrl = previewLogoUrl;
    }

    const savingData = {
      name: newSavingName,
      amount: newSavingAmount,
      description: newSavingDescription,
      profile_id: session.session.user.id,
      logo_url: logoUrl,
    };

    if (saving) {
      const { error } = await supabase
        .from("monthly_savings")
        .update(savingData)
        .eq("id", saving.id);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier le versement mensuel",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Versement mensuel modifié",
      });
    } else {
      const { error } = await supabase
        .from("monthly_savings")
        .insert(savingData);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le versement mensuel",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Versement mensuel ajouté",
      });
    }

    resetForm();
    handleOpenChange(false);
    onSavingAdded();
  };

  // Déterminer si le défilement devrait être activé
  const shouldEnableScroll = needsScrolling || isTablet;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!controlledOpen && trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <AnimatePresence>
        {isOpen && (
          <DialogContent 
            forceMount
            className={cn(
              "p-0 border-0 shadow-2xl",
              isTablet ? "overflow-auto" : "overflow-hidden",
              isTablet ? "sm:max-w-[85%] w-[85%]" : "sm:max-w-[550px]",
              shouldEnableScroll ? "max-h-[80vh]" : "",
              // Fond subtil vert
              "bg-gradient-to-b from-white to-green-50/70 dark:from-gray-900 dark:to-green-950/20",
              "border border-green-200/50 dark:border-green-900/30"
            )}
          >
            <div 
              ref={contentRef}
              className={cn(
                "flex flex-col",
                shouldEnableScroll ? "h-full" : ""
              )}
            >
              {/* Séparateur subtil en haut */}
              <div className="h-1 w-full bg-gradient-to-r from-green-200/20 via-green-400/40 to-green-200/20 dark:from-green-900/20 dark:via-green-700/40 dark:to-green-900/20" />
              
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-semibold text-green-800 dark:text-green-400">
                    {saving ? "Modifier le versement mensuel" : "Nouveau versement mensuel"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    {saving ? "Modifiez les informations de votre versement mensuel" : "Ajoutez un nouveau versement mensuel d'épargne"}
                  </DialogDescription>
                </DialogHeader>
                
                {shouldEnableScroll ? (
                  <ScrollArea 
                    className={cn(
                      "pr-4 max-h-[50vh]",
                      "scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-transparent",
                      "dark:scrollbar-thumb-green-700"
                    )}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SavingForm
                        name={newSavingName}
                        onNameChange={setNewSavingName}
                        domain={domain}
                        onDomainChange={setDomain}
                        amount={newSavingAmount}
                        onAmountChange={setNewSavingAmount}
                        description={newSavingDescription}
                        onDescriptionChange={setNewSavingDescription}
                      />
                    </motion.div>
                  </ScrollArea>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SavingForm
                      name={newSavingName}
                      onNameChange={setNewSavingName}
                      domain={domain}
                      onDomainChange={setDomain}
                      amount={newSavingAmount}
                      onAmountChange={setNewSavingAmount}
                      description={newSavingDescription}
                      onDescriptionChange={setNewSavingDescription}
                    />
                  </motion.div>
                )}
              </div>
              
              <DialogFooter className="px-6 py-4 bg-green-50/50 dark:bg-green-950/10 border-t border-green-100 dark:border-green-900/30">
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenChange(false)}
                  className="border-green-200 hover:bg-green-100/50 hover:text-green-900 dark:border-green-800 dark:hover:bg-green-900/30 dark:hover:text-green-300"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={addNewMonthlySaving}
                  className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600"
                >
                  {saving ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
