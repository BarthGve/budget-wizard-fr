
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Contribution } from "@/hooks/useContributions";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ContributionStatusBadge } from "./contribution-table/ContributionStatusBadge";
import { getTypeBadge } from "./ContributionsKanban";

interface ContributionDetailsDialogProps {
  contribution: Contribution | null;
  onOpenChange: (open: boolean) => void;
}

export const ContributionDetailsDialog = ({
  contribution,
  onOpenChange,
}: ContributionDetailsDialogProps) => {
  if (!contribution) return null;

  const { color, text } = getTypeBadge(contribution.type);

  return (
    <Dialog open={!!contribution} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">{contribution.title}</DialogTitle>
            <div className="flex space-x-2">
              <Badge className={`${color} font-medium`}>
                {text}
              </Badge>
              <ContributionStatusBadge status={contribution.status} />
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center space-x-3 my-4">
          <Avatar>
            <AvatarImage src={contribution.profile.avatar_url || undefined} />
            <AvatarFallback>
              {(contribution.profile.full_name || "?")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{contribution.profile.full_name}</div>
            <div className="text-sm text-muted-foreground">
              Il y a {formatDistanceToNow(new Date(contribution.created_at), { locale: fr })}
              {" • "}
              {format(new Date(contribution.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}
            </div>
          </div>
        </div>

        <Separator />

        <div className="whitespace-pre-wrap text-sm mt-4">{contribution.content}</div>
      </DialogContent>
    </Dialog>
  );
};
