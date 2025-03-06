
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

interface ProfileAvatarUploadProps {
  profile: Profile | undefined;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  setAvatarFile: (file: File | null) => void;
}

export const ProfileAvatarUpload = ({
  profile,
  previewUrl,
  setPreviewUrl,
  setAvatarFile,
}: ProfileAvatarUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error("Le fichier doit être une image");
        return;
      }

      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={previewUrl || profile?.avatar_url || undefined}
          alt={profile?.full_name || "Avatar"}
        />
        <AvatarFallback>
          {(profile?.full_name || "?")[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="avatar-upload"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("avatar-upload")?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Changer l'avatar
        </Button>
      </div>
    </div>
  );
};
