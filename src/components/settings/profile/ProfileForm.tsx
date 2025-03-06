
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
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onEmailChangeClick: () => void;
  onResendVerification: () => void;
}

export const ProfileForm = ({
  profile,
  userData,
  avatarFile,
  setAvatarFile,
  previewUrl,
  setPreviewUrl,
  isUpdating,
  onSubmit,
  onEmailChangeClick,
  onResendVerification,
}: ProfileFormProps) => {
  const [fullName, setFullName] = useState(profile?.full_name || "");

  // Mettre à jour fullName quand profile change
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProfileAvatarUpload 
        profile={profile} 
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        setAvatarFile={setAvatarFile}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
          <div className="flex flex-col gap-2">
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
            
            <EmailChangeAlert 
              userData={userData} 
              onResendClick={onResendVerification} 
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
          disabled={isUpdating}
        >
          {isUpdating ? "Mise à jour..." : "Mettre à jour le profil"}
        </Button>
      </div>
    </form>
  );
};
