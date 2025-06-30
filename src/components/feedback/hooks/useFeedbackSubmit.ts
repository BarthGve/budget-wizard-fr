
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sanitizeHtml, validateAndSanitizeInput } from "@/utils/security";

export const useFeedbackSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async (title: string, content: string, rating: number | null) => {
    if (!rating) {
      toast.error("Veuillez sélectionner une note avant d'envoyer votre feedback");
      return false;
    }

    setIsSubmitting(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour envoyer un feedback");
        return false;
      }

      // Sanitiser les entrées utilisateur
      const sanitizedTitle = validateAndSanitizeInput(title, 200);
      const sanitizedContent = sanitizeHtml(content);

      // Validation supplémentaire
      if (!sanitizedTitle.trim()) {
        toast.error("Le titre ne peut pas être vide");
        return false;
      }

      if (sanitizedContent.length > 2000) {
        toast.error("Le contenu est trop long (maximum 2000 caractères)");
        return false;
      }

      const { error } = await supabase
        .from("feedbacks")
        .insert({
          title: sanitizedTitle,
          content: sanitizedContent,
          rating,
          profile_id: user.id,
        });

      if (error) throw error;

      toast.success("Merci pour votre feedback ! 🎉");
      return true;

    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Erreur lors de l'envoi du feedback");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submitFeedback };
};
