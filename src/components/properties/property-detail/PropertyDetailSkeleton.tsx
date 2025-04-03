
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const PropertyDetailSkeleton = () => {
  return (
    <div className="grid gap-6 mt-4 animate-pulse">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="w-full sm:w-2/3">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      {/* Carte infos principales */}
      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </Card>
      
      {/* Carte localisation */}
      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </Card>
      
      {/* Section dépenses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
        <Card className="p-6">
          <div className="grid gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </Card>
      </div>
    </div>
  );
};
