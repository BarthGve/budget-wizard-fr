
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export const ContributorsSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 border rounded-md">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              </div>
              <div className="space-y-1">
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-3 w-[60px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
