
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const MobileCategoryListSkeleton = () => {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>
      
      {[1, 2, 3, 4].map((i) => (
        <Card 
          key={i}
          className={cn(
            "overflow-hidden",
            "border shadow-sm",
            "bg-white",
            "dark:bg-gray-800/90 dark:border-gray-700/50"
          )}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
};
