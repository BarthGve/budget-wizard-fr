
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MiniRetailerCardSkeletonProps {
  delay?: number;
}

export function MiniRetailerCardSkeleton({ delay = 0 }: MiniRetailerCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 + (delay * 0.05) }}
    >
      <Card 
        className={cn(
          "overflow-hidden h-20 transition-all duration-200",
          "border shadow-sm",
          "bg-white dark:bg-gray-800/90"
        )}
      >
        <div className="h-full flex items-center p-3">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0 mr-3" />
          
          <div className="flex-grow min-w-0">
            <Skeleton className="h-4 w-24 mb-1.5" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
          </div>
          
          <Skeleton className="h-7 w-7 rounded-full flex-shrink-0 ml-2" />
        </div>
      </Card>
    </motion.div>
  );
}
