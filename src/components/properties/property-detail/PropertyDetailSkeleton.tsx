
import { Skeleton } from "@/components/ui/skeleton";

export const PropertyDetailSkeleton = () => {
  return (
    <div className="grid gap-6 mt-4">
      <Skeleton className="h-[200px] w-full" />
      <div className="grid gap-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};
