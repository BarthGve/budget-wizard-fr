
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export const CreditsSkeleton = () => {
  return (
    <motion.div 
      className="space-y-6 container px-4 py-6 mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Skeleton */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={cn(
              "p-2.5 rounded-lg shadow-sm mt-0.5",
              "bg-gradient-to-br from-primary-100 to-primary-50",
              "dark:bg-gradient-to-br dark:from-primary-900/40 dark:to-primary-800/30"
            )}
          >
            <Skeleton className="h-6 w-6 rounded" />
          </motion.div>
          
          <div>
            <Skeleton className="h-9 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Skeleton className="h-10 w-28 rounded-md" />
        </motion.div>
      </motion.div>

      {/* Summary Cards Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6"
      >
        {[1, 2, 3].map((index) => (
          <Card 
            key={index}
            className={cn(
              "overflow-hidden transition-all duration-200 h-full relative",
              "border shadow-lg",
              "bg-white border-gray-100",
              "dark:bg-gray-800/90 dark:border-primary-800/50 dark:shadow-primary-800/30"
            )}
          >
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Skeleton className="p-2 h-9 w-9 rounded-lg" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
              
              <Skeleton className="h-4 w-3/4 mt-2 mb-4" />
              
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Active Credits Section Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Skeleton className="h-7 w-40 mb-4" />
        
        <div className="grid gap-2">
          {[1, 2, 3].map((index) => (
            <Card 
              key={index}
              className={cn(
                "overflow-hidden transition-all duration-200",
                "bg-white border border-primary-100 shadow-sm",
                "dark:bg-gray-800/90 dark:border-primary-800/40 dark:shadow-primary-800/30"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Archived Credits Section Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </motion.div>
    </motion.div>
  );
};
