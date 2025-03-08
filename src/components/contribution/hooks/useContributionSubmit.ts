
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useContributionSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useCurrentUser();

  const notifyAdmins = async (contributionId: string) => {
    try {
      const { error } = await supabase.functions.invoke("notify-contribution", {
        body: { contributionId }
      });
      
      if (error) {
        console.error("Erreur lors de l'envoi de la notification:", error);
      } else {
        console.log("Notification envoyée aux administrateurs");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel de la fonction notify-contribution:", error);
    }
  };

  const submitContribution = async (type: string, title: string, content: string) => {
    if (!type || !title.trim() || !content.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return false;
    }

    setIsSubmitting(true);
    try {
      if (!currentUser) throw new Error("Non authentifié");

      const { data: contribution, error } = await supabase.from("contributions").insert({
        type,
        title: title.trim(),
        content: content.trim(),
        profile_id: currentUser.id,
        status: "pending"
      }).select('id').single();

      if (error) throw error;

      toast.success("Merci pour votre contribution !");
      
      if (contribution) {
        await notifyAdmins(contribution.id);
      }
      
      return true;
    } catch (error) {
      console.error("Error submitting contribution:", error);
      toast.error("Une erreur est survenue lors de l'envoi de la contribution");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitContribution
  };
};
