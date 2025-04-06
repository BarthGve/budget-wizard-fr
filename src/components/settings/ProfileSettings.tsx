
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { ProfileForm } from "./profile/ProfileForm";
import { EmailChangeDialog } from "./profile/EmailChangeDialog";
import { useProfileUpdate } from "./profile/useProfileUpdate";
import { useIsMobile } from "@/hooks/use-mobile";

export const ProfileSettings = () => {
  const [fullName, setFullName] = useState("");
  const isMobile = useIsMobile();

  // Récupérer les données du profil
  const {
    data: profile,
    refetch: refetchProfile,
    isLoading: isProfileLoading
  } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("ProfileSettings: Récupération du profil");
      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      console.log("ProfileSettings: Utilisateur trouvé:", user?.id);
      
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
      
      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        throw error;
      }
      
      console.log("ProfileSettings: Profil récupéré:", data?.full_name);
      return data as Profile;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  // Récupérer les données de l'utilisateur
  const {
    data: userData,
    isLoading: isUserLoading
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      console.log("ProfileSettings: Récupération de l'utilisateur courant");
      const {
        data: {
          user
        },
        error
      } = await supabase.auth.getUser();
      if (error) throw error;
      
      console.log("ProfileSettings: Données utilisateur récupérées");
      return user;
    },
    staleTime: 0
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
    console.log("ProfileSettings: useEffect pour fullName avec profile:", profile?.full_name);
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  // Handler pour le formulaire de profil
  const onSubmit = async (e: React.FormEvent) => {
    console.log("ProfileSettings: Soumission du formulaire de profil avec le nom:", fullName);
    await handleProfileUpdate(e, fullName);
    // Forcer une nouvelle récupération du profil après la mise à jour
    setTimeout(() => {
      console.log("ProfileSettings: Rafraîchissement des données du profil");
      refetchProfile();
    }, 500);
  };

  const isLoading = isProfileLoading || isUserLoading;

  return (
    <Card className={isMobile ? "shadow-sm border-0" : ""}>
      <CardHeader className={isMobile ? "px-3 py-4" : ""}>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <CardTitle className={isMobile ? "text-xl" : ""}>Informations personnelles</CardTitle>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 pb-5" : ""}>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p>Chargement des données du profil...</p>
          </div>
        ) : (
          <ProfileForm 
            profile={profile} 
            userData={userData} 
            avatarFile={avatarFile} 
            setAvatarFile={setAvatarFile} 
            previewUrl={previewUrl} 
            setPreviewUrl={setPreviewUrl} 
            isUpdating={isUpdating} 
            onSubmit={onSubmit} 
            onEmailChangeClick={() => setShowEmailDialog(true)} 
            onResendVerification={handleResendVerification}
            isMobile={isMobile}
          />
        )}

        {/* Modal pour modifier l'email */}
        <EmailChangeDialog 
          open={showEmailDialog} 
          onOpenChange={setShowEmailDialog} 
          onSubmit={handleUpdateEmail} 
          isUpdating={isUpdatingEmail} 
        />
      </CardContent>
    </Card>
  );
};
