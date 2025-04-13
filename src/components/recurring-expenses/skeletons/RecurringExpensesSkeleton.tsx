
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const RecurringExpensesSkeleton = () => {
  return (
    <motion.div 
      className="w-full max-w-full space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-11 w-11 rounded-lg mt-0.5" />
          <div>
            <Skeleton className="h-9 w-60 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Banner Skeleton */}
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

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card 
            key={i}
            className={cn(
              "overflow-hidden transition-all duration-200",
              "border shadow-sm",
              "bg-white border-gray-100",
              "dark:bg-gray-800/90 dark:border-gray-700/50"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart or Category List Skeleton */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="pt-2">
          <Skeleton className="h-[180px] w-full rounded-md" />
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-b dark:border-gray-700">
            <div className="py-3 px-4 bg-gray-50 dark:bg-gray-800/60">
              <div className="grid grid-cols-5 gap-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-4 px-4 border-t dark:border-gray-700">
                <div className="grid grid-cols-5 gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
