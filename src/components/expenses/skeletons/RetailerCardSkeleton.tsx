
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RetailerCardSkeletonProps {
  className?: string;
}

export function RetailerCardSkeleton({ className }: RetailerCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-200 h-full relative",
          "border shadow-sm",
          "bg-white border-gray-100",
          "dark:bg-gray-800/90 dark:border-gray-700/50",
          className
        )}
      >
        <div className="p-5 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-[120px]" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          
          <div className="space-y-3">
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-7 w-32" />
            </div>
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
