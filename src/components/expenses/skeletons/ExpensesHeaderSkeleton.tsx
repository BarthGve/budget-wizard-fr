
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ExpensesHeaderSkeleton() {
  return (
    <motion.div 
      className="pb-4 mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-3">
        <Skeleton className="h-11 w-11 rounded-lg mt-0.5" />
        
        <div>
          <Skeleton className="h-9 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </motion.div>
  );
}
