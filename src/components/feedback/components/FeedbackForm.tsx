
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeedbackFormProps {
  rating: number | null;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
}

export const FeedbackForm = ({ rating, title, setTitle, content, setContent }: FeedbackFormProps) => {
  return (
    <motion.div 
      key="step2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="px-6 py-6"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="title" className="text-sm font-medium">Titre</Label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < (rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Résumez votre expérience en quelques mots"
            className="w-full border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200"
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium">Détails</Label>
          <Textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Partagez vos suggestions, commentaires ou idées d'amélioration..."
            className="min-h-[120px] border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200"
          />
        </div>
      </div>
    </motion.div>
  );
};
