import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ExpenseSkeleton = () => {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
};

export default ExpenseSkeleton;