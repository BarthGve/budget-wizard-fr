
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogTitle } from "@/components/ui/dialog";
import { getAvatarColor, getInitials } from "@/utils/avatarColors";

interface ContributorDetailsHeaderProps {
  name: string;
  isOwner: boolean;
  avatarUrl?: string | null;
  isDarkTheme: boolean;
}

export function ContributorDetailsHeader({ 
  name, 
  isOwner, 
  avatarUrl, 
  isDarkTheme 
}: ContributorDetailsHeaderProps) {
  const initials = getInitials(name);
  const avatarColors = getAvatarColor(name, isDarkTheme);

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-12 w-12">
        {isOwner && avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} />
        ) : null}
        <AvatarFallback
          className="text-lg"
          style={{
            backgroundColor: avatarColors.background,
            color: avatarColors.text,
          }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <DialogTitle className="text-xl">
        Détails pour {name}
      </DialogTitle>
    </div>
  );
}
