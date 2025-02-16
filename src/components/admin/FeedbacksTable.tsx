
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, StarHalf, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Feedback } from "@/types/feedback";

interface FeedbacksTableProps {
  feedbacks: Feedback[];
  onViewDetails: (feedback: Feedback) => void;
}

export const FeedbacksTable = ({ feedbacks, onViewDetails }: FeedbacksTableProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => {
      if (index + 1 <= rating) {
        return <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
      } else if (index + 0.5 <= rating) {
        return <StarHalf key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
      }
      return <Star key={index} className="h-4 w-4 text-gray-300" />;
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Note & Date</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedbacks.map((feedback) => (
          <TableRow key={feedback.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={feedback.profile.avatar_url || undefined} />
                  <AvatarFallback>
                    {feedback.profile.full_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span>{feedback.profile.full_name}</span>
              </div>
            </TableCell>
            <TableCell>{feedback.title}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex space-x-1">
                  {renderStars(feedback.rating)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(feedback.created_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                {
                  "bg-yellow-100 text-yellow-800": feedback.status === "pending",
                  "bg-blue-100 text-blue-800": feedback.status === "in_progress",
                  "bg-green-100 text-green-800": feedback.status === "completed",
                }
              )}>
                {feedback.status === "pending" && "En attente"}
                {feedback.status === "in_progress" && "En cours"}
                {feedback.status === "completed" && "Terminé"}
              </div>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(feedback)}
                className="hover:bg-primary/10"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
