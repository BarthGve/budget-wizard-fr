
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Contribution } from "@/hooks/useContributions";
import { Badge } from "@/components/ui/badge";

interface ContributionsKanbanProps {
  contributions: Contribution[];
  onDragEnd: (result: any) => void;
}

export const getTypeBadge = (type: string) => {
  switch (type) {
    case "suggestion":
      return { color: "bg-blue-100 text-blue-800", text: "Suggestion" };
    case "bug":
      return { color: "bg-red-100 text-red-800", text: "Bug" };
    case "feature":
      return { color: "bg-green-100 text-green-800", text: "Fonctionnalité" };
    case "improvement":
      return { color: "bg-purple-100 text-purple-800", text: "Amélioration" };
    default:
      return { color: "bg-gray-100 text-gray-800", text: "Autre" };
  }
};

export const ContributionsKanban = ({ contributions, onDragEnd }: ContributionsKanbanProps) => {
  const columns = {
    pending: {
      title: "À traiter",
      items: contributions.filter(c => c.status === "pending"),
    },
    in_progress: {
      title: "En cours",
      items: contributions.filter(c => c.status === "in_progress"),
    },
    completed: {
      title: "Traité",
      items: contributions.filter(c => c.status === "completed"),
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
                <h3 className="text-lg font-semibold mb-4">{column.title} ({column.items.length})</h3>
                <div className="space-y-3">
                  {column.items.map((contribution, index) => {
                    const { color, text } = getTypeBadge(contribution.type);
                    
                    return (
                      <Draggable
                        key={contribution.id}
                        draggableId={contribution.id}
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
                                  <AvatarImage src={contribution.profile.avatar_url || undefined} />
                                  <AvatarFallback>
                                    {contribution.profile.full_name?.[0]?.toUpperCase() || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{contribution.profile.full_name}</div>
                                  <div className="text-sm text-gray-500">
                                    {formatDistanceToNow(new Date(contribution.created_at), {
                                      addSuffix: true,
                                      locale: fr,
                                    })}
                                  </div>
                                </div>
                              </div>
                              
                              <Badge className={`${color} font-medium`}>
                                {text}
                              </Badge>
                              
                              <div>
                                <h4 className="font-medium">{contribution.title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {contribution.content}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    );
                  })}
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
