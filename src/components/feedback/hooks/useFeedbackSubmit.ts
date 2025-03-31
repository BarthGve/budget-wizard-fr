
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
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
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
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

      toast({
        title: "Merci",
        description: "Merci pour votre feedback !"
      });
      
      if (feedback) {
        await notifyAdmins(feedback.id);
      }
      
      return true;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du feedback",
        variant: "destructive"
      });
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
