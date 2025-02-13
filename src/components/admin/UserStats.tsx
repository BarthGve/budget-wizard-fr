
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const UserStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_stats');
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="animate-pulse">
          <CardContent className="h-24" />
        </Card>
        <Card className="animate-pulse">
          <CardContent className="h-24" />
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nouveaux Utilisateurs (30j)</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.new_users || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};
