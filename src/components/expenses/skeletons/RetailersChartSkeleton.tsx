
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function RetailersChartSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="w-full"
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-5 w-72" />
            </div>
          </div>
          
          <div className="h-[250px] flex items-center justify-center">
            <div className="w-full">
              <div className="flex items-end justify-between h-40 gap-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton 
                    key={i} 
                    className="w-full" 
                    style={{ 
                      height: `${Math.floor(40 + Math.random() * 120)}px`,
                      opacity: 0.7 + (i * 0.05)
                    }} 
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-12" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
