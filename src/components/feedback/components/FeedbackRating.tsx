
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeedbackRatingProps {
  rating: number | null;
  setRating: (rating: number) => void;
  hoverRating: number;
  setHoverRating: (rating: number) => void;
}

export const ratingTexts = [
  "Très insatisfait",
  "Insatisfait",
  "Neutre",
  "Satisfait",
  "Très satisfait"
];

export const ratingEmojis = ["😠", "😕", "😐", "🙂", "😄"];

export const FeedbackRating = ({ rating, setRating, hoverRating, setHoverRating }: FeedbackRatingProps) => {
  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  return (
    <motion.div 
      key="step1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="px-6 py-6"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => handleRatingChange(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className={cn(
                "group p-2 h-16 w-16 rounded-xl transition-all duration-200 hover:scale-105",
                value <= (hoverRating || rating || 0) ? "bg-primary/10" : "bg-transparent"
              )}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">{ratingEmojis[value-1]}</span>
                <Star
                  className={cn(
                    "h-6 w-6 transition-all duration-200",
                    value <= (hoverRating || rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 group-hover:text-gray-400"
                  )}
                />
              </div>
            </Button>
          ))}
        </div>
        {(hoverRating || rating) && (hoverRating || rating) > 0 && (
          <span className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
            {ratingTexts[(hoverRating || rating || 1) - 1]}
          </span>
        )}
      </div>
    </motion.div>
  );
};
