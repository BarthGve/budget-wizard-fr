import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types/profile";
import { EmailFormValues } from "./EmailChangeDialog";

export const useProfileUpdate = (profile: Profile | undefined) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleProfileUpdate = async (e: React.FormEvent, fullName: string) => {
    e.preventDefault();
    console.log("Début de mise à jour du profil avec le nom:", fullName);
    setIsUpdating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      console.log("Utilisateur authentifié:", user.id);

      let avatarUrl = profile?.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        if (profile?.avatar_url) {
          const oldFilePath = profile.avatar_url.split('/').slice(-2).join('/');
          await supabase.storage
            .from('avatars')
            .remove([oldFilePath]);
        }

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error("Erreur lors de l'upload de l'avatar");
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      console.log("Mise à jour du profil avec les données:", {
        full_name: fullName,
        avatar_url: avatarUrl
      });

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      console.log("Invalidation du cache React Query pour les clés liées au profil");
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      
      await queryClient.refetchQueries({ 
        queryKey: ["profile"],
        exact: true
      });
      
      toast.success("Profil mis à jour avec succès", {
        duration: 3000
      });
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setAvatarFile(null);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du profil", {
        duration: 3000
      });
    } finally {
      setIsUpdating(false);
      console.log("Fin de la mise à jour du profil");
    }
  };

  const handleUpdateEmail = async (values: EmailFormValues) => {
    setIsUpdatingEmail(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || "",
        password: values.password,
      });

      if (signInError) {
        throw new Error("Mot de passe incorrect");
      }

      console.log("Demande de changement d'email de", user.email, "vers", values.email);
      
      localStorage.setItem("verificationEmail", values.email);
      
      const redirectTo = `${window.location.origin}/email-verification?type=emailChange`;
      
      const { data, error } = await supabase.auth.updateUser(
        { email: values.email },
        { emailRedirectTo: redirectTo }
      );
      
      if (error) throw error;
      
      console.log("Réponse de updateUser:", data);

      setShowEmailDialog(false);
      
      navigate("/email-verification?type=emailChange");
      
      toast.success(
        "Un email de vérification a été envoyé à votre nouvelle adresse. Veuillez vérifier votre boîte mail pour confirmer le changement."
      );
      
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.message || "Erreur lors de la mise à jour de l'email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user?.new_email) {
        console.log("Nouvel email en attente de vérification:", userData.user.new_email);
        
        const redirectTo = `${window.location.origin}/email-verification?type=emailChange`;
        
        const { error } = await supabase.auth.resend({
          type: 'email_change',
          email: userData.user.new_email,
          options: {
            emailRedirectTo: redirectTo
          }
        });
        
        if (error) throw error;
        
        localStorage.setItem("verificationEmail", userData.user.new_email);
        navigate("/email-verification?type=emailChange");
        toast.success("Email de vérification renvoyé avec succès");
      } else {
        toast.error("Aucun changement d'email en attente");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de l'utilisateur:", error);
      toast.error("Impossible de renvoyer l'email de vérification");
    }
  };

  return {
    isUpdating,
    isUpdatingEmail,
    showEmailDialog,
    setShowEmailDialog,
    avatarFile,
    setAvatarFile,
    previewUrl,
    setPreviewUrl,
    handleProfileUpdate,
    handleUpdateEmail,
    handleResendVerification
  };
};
