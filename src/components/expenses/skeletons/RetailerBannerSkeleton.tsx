
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function RetailerBannerSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn(
        "w-full p-4 rounded-lg shadow-sm",
        "bg-gradient-to-r from-gray-50 to-gray-100",
        "dark:bg-gradient-to-r dark:from-gray-800/40 dark:to-gray-900/40 dark:border-gray-700/50"
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md md:self-start" />
      </div>
    </motion.div>
  );
}
