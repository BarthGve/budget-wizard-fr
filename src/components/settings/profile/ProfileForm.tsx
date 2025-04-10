
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";
import { EmailChangeAlert } from "./EmailChangeAlert";
import { Mail } from "lucide-react";
import { Profile } from "@/types/profile";
import { User } from "@supabase/supabase-js";

interface ProfileFormProps {
  profile: Profile | undefined;
  userData: User | undefined;
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  isUpdating: boolean;
  fullName: string; 
  setFullName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onEmailChangeClick: () => void;
  onResendVerification: () => void;
  isMobile?: boolean;
}

export const ProfileForm = ({
  profile,
  userData,
  avatarFile,
  setAvatarFile,
  previewUrl,
  setPreviewUrl,
  isUpdating,
  fullName,
  setFullName,
  onSubmit,
  onEmailChangeClick,
  onResendVerification,
  isMobile = false
}: ProfileFormProps) => {
  // Utiliser useEffect pour synchroniser le fullName avec les props uniquement au montage initial
  // ou quand le profil change significativement (pas à chaque changement de nom)
  useEffect(() => {
    console.log("ProfileForm: profile mis à jour", profile?.full_name);
    // Ne mettre à jour que si le profil existe, que fullName est vide ou undefined,
    // ou si c'est le chargement initial (premier rendu)
    if (profile?.full_name && (!fullName || fullName === "")) {
      console.log("ProfileForm: initialisation du nom à", profile.full_name);
      setFullName(profile.full_name);
    }
  }, [profile, setFullName]);

  const handleLocalSubmit = async (e: React.FormEvent) => {
    console.log("Soumission du formulaire avec le nom:", fullName);
    await onSubmit(e);
  };

  return (
    <form onSubmit={handleLocalSubmit} className="space-y-6">
      <ProfileAvatarUpload 
        profile={profile} 
        previewUrl={previewUrl} 
        setPreviewUrl={setPreviewUrl} 
        setAvatarFile={setAvatarFile}
        isMobile={isMobile}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className={isMobile ? "text-base font-medium" : ""}>
            Nom
          </Label>
          <Input 
            id="name" 
            value={fullName} 
            onChange={e => {
              console.log("Changement du nom:", e.target.value);
              setFullName(e.target.value);
            }} 
            placeholder="John Doe" 
            className={isMobile ? "h-12 text-base" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={isMobile ? "text-base font-medium" : ""}>
            Adresse email
          </Label>
          <div className="flex flex-col gap-2">
            {isMobile ? (
              <div className="flex flex-col gap-2">
                <Input 
                  id="email" 
                  value={userData?.email || ""} 
                  disabled 
                  className="bg-muted text-base h-12"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onEmailChangeClick}
                  className="h-12 text-base flex justify-center items-center gap-2"
                >
                  <Mail className="h-5 w-5" />
                  Modifier
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input 
                  id="email" 
                  value={userData?.email || ""} 
                  disabled 
                  className="flex-1 bg-muted" 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onEmailChangeClick}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            )}
            
            <EmailChangeAlert 
              userData={userData} 
              onResendClick={onResendVerification} 
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className={`w-full bg-primary text-primary-foreground hover:bg-primary-hover ${isMobile ? "h-14 text-base mt-4" : ""}`} 
          disabled={isUpdating}
        >
          {isUpdating ? "Mise à jour..." : "Mettre à jour le profil"}
        </Button>
      </div>
    </form>
  );
};
