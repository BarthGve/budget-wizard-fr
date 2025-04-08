
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/useToastWrapper";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useFeedbackSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useCurrentUser();

  const notifyAdmins = async (feedbackId: string) => {
    try {
      const { error } = await supabase.functions.invoke("notify-feedback", {
        body: { feedbackId }
      });
      
      if (error) {
        console.error("Erreur lors de l'envoi de la notification:", error);
      } else {
        console.log("Notification envoyée aux administrateurs");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel de la fonction notify-feedback:", error);
    }
  };

  const submitFeedback = async (title: string, content: string, rating: number | null) => {
    if (!title.trim() || !content.trim() || !rating) {
      toast.error("Veuillez remplir tous les champs");
      return false;
    }

    setIsSubmitting(true);
    try {
      if (!currentUser) throw new Error("Non authentifié");

      const { data: feedback, error } = await supabase.from("feedbacks").insert({
        title: title.trim(),
        content: content.trim(),
        rating,
        profile_id: currentUser.id,
        status: "pending"
      }).select('id').single();

      if (error) throw error;
      
      // Message de succès supprimé (ne s'affichera plus)
      
      if (feedback) {
        await notifyAdmins(feedback.id);
      }
      
      return true;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Une erreur est survenue lors de l'envoi du feedback");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitFeedback
  };
};
