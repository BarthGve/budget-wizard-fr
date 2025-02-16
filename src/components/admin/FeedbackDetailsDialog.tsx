
import { Feedback } from "@/types/feedback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackDetailsDialogProps {
  feedback: Feedback | null;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackDetailsDialog = ({ feedback, onOpenChange }: FeedbackDetailsDialogProps) => {
  return (
    <Dialog open={!!feedback} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {feedback && (
            <>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={feedback.profile.avatar_url || undefined} />
                  <AvatarFallback>
                    {feedback.profile.full_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{feedback.profile.full_name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Titre</h3>
                <p>{feedback.title}</p>
              </div>
              <div>
                <h3 className="font-medium">Contenu</h3>
                <p>{feedback.content}</p>
              </div>
              <div>
                <h3 className="font-medium">Note</h3>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < feedback.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
