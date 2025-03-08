
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook personnalisé pour gérer la logique de vérification d'email
 */
export const useEmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isEmailChange, setIsEmailChange] = useState(false);

  // Initialisation et configuration
  useEffect(() => {
    // Vérifier si c'est une vérification de changement d'email
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    setIsEmailChange(type === "emailChange");
    
    // Récupérer l'email depuis localStorage
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Si pas d'email stocké, essayer de récupérer le nouvel email depuis l'utilisateur actuel
      const checkUserEmail = async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user?.new_email) {
          setEmail(data.user.new_email);
          localStorage.setItem("verificationEmail", data.user.new_email);
        }
      };
      checkUserEmail();
    }

    // Configurer le compteur de temps
    const getOrCreateEndTime = () => {
      const storedEndTime = localStorage.getItem("verificationEndTime");
      if (storedEndTime) {
        return parseInt(storedEndTime, 10);
      }
      
      const newEndTime = Date.now() + 120 * 1000;
      localStorage.setItem("verificationEndTime", newEndTime.toString());
      return newEndTime;
    };

    const endTime = getOrCreateEndTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
      
      setRemainingTime(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    // Écouteur d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Event detected in EmailVerification:", event, session);
      
      if (event === "SIGNED_IN") {
        // Nettoyer et rediriger après connexion
        localStorage.removeItem("verificationEmail");
        localStorage.removeItem("verificationEndTime");
        localStorage.setItem("justVerified", "true");
        navigate("/login");
      } else if (event === "USER_UPDATED") {
        // Gérer la mise à jour d'email
        if (isEmailChange && session) {
          console.log("Email change confirmed:", session.user.email);
          
          localStorage.removeItem("verificationEmail");
          localStorage.removeItem("verificationEndTime");
          
          toast.success("Votre adresse email a été mise à jour avec succès");
          navigate("/user-settings");
        }
      }
    });

    return () => {
      clearInterval(timer);
      subscription.unsubscribe();
    };
  }, [navigate, location.search, isEmailChange]);

  // Fonction pour renvoyer l'email de vérification
  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Adresse email non trouvée");
      return;
    }

    setIsResending(true);
    try {
      const type = isEmailChange ? 'email_change' : 'signup';
      console.log(`Renvoi d'email de type ${type} à ${email}`);
      
      const redirectTo = `${window.location.origin}/email-verification?type=${isEmailChange ? 'emailChange' : 'signup'}`;
      
      const { error } = await supabase.auth.resend({
        type: type,
        email: email,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      if (error) throw error;

      // Réinitialiser le compteur
      const newEndTime = Date.now() + 120 * 1000;
      localStorage.setItem("verificationEndTime", newEndTime.toString());
      setRemainingTime(120);
      
      toast.success("Email de vérification envoyé");
    } catch (error: any) {
      console.error("Erreur lors du renvoi de l'email:", error);
      toast.error(error.message || "Erreur lors de l'envoi de l'email");
    } finally {
      setIsResending(false);
    }
  };

  // Formater le temps restant
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    email,
    isResending,
    remainingTime,
    isEmailChange,
    handleResendEmail,
    formatTime
  };
};
