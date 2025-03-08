
import { LightbulbIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const ContributionAvatar = () => {
  return (
    <Avatar className="h-16 w-16 bg-primary/10 text-primary">
      <AvatarFallback className="bg-primary/10 text-primary">
        <LightbulbIcon className="h-8 w-8" />
      </AvatarFallback>
    </Avatar>
  );
};
