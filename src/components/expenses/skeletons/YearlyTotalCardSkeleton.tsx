
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function YearlyTotalCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-200 h-full relative",
          "border shadow-sm",
          "bg-white border-gray-100",
          "dark:bg-gray-800/90 dark:border-gray-700/50"
        )}
      >
        <div className="p-5 pt-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-5 w-36" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <Skeleton className="h-8 w-40 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            <div className="mt-4">
              <Skeleton className="h-5 w-full max-w-xs" />
              <div className="mt-2">
                <Skeleton className="h-2.5 w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
