
import { ContributorAvatar as SharedContributorAvatar } from "@/components/ui/contributor-avatar";

interface ContributorAvatarProps {
  name: string;
  avatarUrl?: string | null;
  isOwner: boolean;
  isDarkTheme: boolean;
}

export const ContributorAvatar = (props: ContributorAvatarProps) => {
  return <SharedContributorAvatar {...props} />;
};
