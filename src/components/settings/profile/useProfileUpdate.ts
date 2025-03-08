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
    setIsUpdating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

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

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profil mis à jour avec succès");
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setAvatarFile(null);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setIsUpdating(false);
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

      localStorage.setItem("verificationEmail", values.email);
      
      const siteUrl = window.location.origin;
      
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(2, 15);
      const securityToken = `${timestamp}_${random}`;
      
      localStorage.setItem("emailChangeToken", securityToken);
      
      const verificationLink = `${siteUrl}/email-verification?type=emailChange&token=${securityToken}`;
      
      const { error: emailError } = await supabase.functions.invoke('email-change-verification', {
        body: {
          oldEmail: user.email,
          newEmail: values.email,
          verificationLink
        }
      });
      
      if (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
        throw new Error("Erreur lors de l'envoi de l'email de vérification");
      }
      
      const { error } = await supabase.auth.updateUser({
        email: values.email,
      });
      
      if (error) throw error;

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
        const siteUrl = window.location.origin;
        const securityToken = `${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("emailChangeToken", securityToken);
        localStorage.setItem("verificationEmail", userData.user.new_email);
        
        const verificationLink = `${siteUrl}/email-verification?type=emailChange&token=${securityToken}`;
        
        const { error: emailError } = await supabase.functions.invoke('email-change-verification', {
          body: {
            oldEmail: userData.user.email || "votre adresse actuelle",
            newEmail: userData.user.new_email,
            verificationLink
          }
        });
        
        if (emailError) {
          console.error("Erreur lors du renvoi de l'email:", emailError);
          throw new Error("Erreur lors du renvoi de l'email de vérification");
        }
        
        navigate("/email-verification?type=emailChange");
        toast.success("Un nouvel email de vérification a été envoyé");
      } else {
        toast.info("Aucun changement d'email en attente");
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
