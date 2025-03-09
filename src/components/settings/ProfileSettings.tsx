import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { ProfileForm } from "./profile/ProfileForm";
import { EmailChangeDialog } from "./profile/EmailChangeDialog";
import { useProfileUpdate } from "./profile/useProfileUpdate";
export const ProfileSettings = () => {
  const [fullName, setFullName] = useState("");

  // Récupérer les données du profil
  const {
    data: profile,
    refetch: refetchProfile
  } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
      if (error) throw error;
      return data as Profile;
    }
  });

  // Récupérer les données de l'utilisateur
  const {
    data: userData
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const {
        data: {
          user
        },
        error
      } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  // Hook personnalisé pour la gestion du profil
  const {
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
  } = useProfileUpdate(profile);

  // Mettre à jour fullName quand profile change
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  // Handler pour le formulaire de profil
  const onSubmit = async (e: React.FormEvent) => {
    await handleProfileUpdate(e, fullName || profile?.full_name || "");
  };
  return <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <CardTitle>Informations personnelles</CardTitle>
        </div>
        
      </CardHeader>
      <CardContent>
        <ProfileForm profile={profile} userData={userData} avatarFile={avatarFile} setAvatarFile={setAvatarFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} isUpdating={isUpdating} onSubmit={onSubmit} onEmailChangeClick={() => setShowEmailDialog(true)} onResendVerification={handleResendVerification} />

        {/* Modal pour modifier l'email */}
        <EmailChangeDialog open={showEmailDialog} onOpenChange={setShowEmailDialog} onSubmit={handleUpdateEmail} isUpdating={isUpdatingEmail} />
      </CardContent>
    </Card>;
};