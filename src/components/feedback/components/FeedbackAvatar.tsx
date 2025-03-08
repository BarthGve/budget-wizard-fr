
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const FeedbackAvatar = () => {
  const { data: profileData } = useProfileAvatar();
  const { currentUser } = useCurrentUser();
  
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
      {profileData?.avatar_url ? (
        <AvatarImage src={profileData.avatar_url} alt="Avatar utilisateur" />
      ) : (
        <AvatarFallback className="bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
      )}
    </Avatar>
  );
};
