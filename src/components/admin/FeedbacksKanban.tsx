
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Feedback } from "@/types/feedback";

interface FeedbacksKanbanProps {
  feedbacks: Feedback[];
  onDragEnd: (result: any) => void;
}

export const FeedbacksKanban = ({ feedbacks, onDragEnd }: FeedbacksKanbanProps) => {
  const columns = {
    pending: {
      title: "En attente",
      items: feedbacks.filter(f => f.status === "pending"),
    },
    in_progress: {
      title: "En cours",
      items: feedbacks.filter(f => f.status === "in_progress"),
    },
    completed: {
      title: "Terminé",
      items: feedbacks.filter(f => f.status === "completed"),
    },
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
                <div className="space-y-3">
                  {column.items.map((feedback, index) => (
                    <Draggable
                      key={feedback.id}
                      draggableId={feedback.id}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white"
                        >
                          <CardContent className="p-4 space-y-3">
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
                                  {formatDistanceToNow(new Date(feedback.created_at), {
                                    addSuffix: true,
                                    locale: fr,
                                  })}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium">{feedback.title}</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {feedback.content}
                              </p>
                            </div>
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
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
