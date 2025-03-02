
import { Star, StarHalf } from "lucide-react";

export const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, index) => {
    if (index + 1 <= rating) {
      return <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
    } else if (index + 0.5 <= rating) {
      return <StarHalf key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
    }
    return <Star key={index} className="h-4 w-4 text-gray-300" />;
  });
};
