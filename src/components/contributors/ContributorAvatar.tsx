
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/utils/avatarColors";

interface ContributorAvatarProps {
  name: string;
  avatarUrl?: string | null;
  isOwner: boolean;
  isDarkTheme: boolean;
}

export const ContributorAvatar = ({ 
  name, 
  avatarUrl, 
  isOwner, 
  isDarkTheme 
}: ContributorAvatarProps) => {
  const initials = getInitials(name);
  const avatarColors = getAvatarColor(name, isDarkTheme);

  return (
    <Avatar>
      {isOwner && avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={name} />
      ) : null}
      <AvatarFallback 
        style={{
          backgroundColor: avatarColors.background,
          color: avatarColors.text,
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
