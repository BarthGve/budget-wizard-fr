
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const FeedbackAvatar = () => {
  const { data: profileData } = useProfileAvatar();
  const { currentUser } = useCurrentUser();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Forcer la récupération de l'avatar directement depuis Supabase
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!currentUser) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", currentUser.id)
          .single();
          
        if (error) {
          console.error("Erreur de récupération d'avatar:", error);
          return;
        }
        
        if (data) {
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'avatar:", error);
      }
    };
    
    fetchAvatar();
  }, [currentUser]);
  
  const getInitials = () => {
    if (!currentUser?.email) return "FB";
    
    const email = currentUser.email;
    const nameParts = email.split('@')[0].split(/[._-]/);
    
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  return (
    <Avatar className="h-12 w-12 border-2 border-primary/20">
      {avatarUrl || profileData?.avatar_url ? (
        <AvatarImage src={avatarUrl || profileData?.avatar_url} alt="Avatar utilisateur" />
      ) : (
        <AvatarFallback className="bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
      )}
    </Avatar>
  );
};
