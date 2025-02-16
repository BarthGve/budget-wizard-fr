
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserStats {
  total_users: number;
  new_users: number;
}

export const UserStats = () => {
  // D'abord, vérifions les droits d'admin
  const { data: isAdmin, isLoading: isLoadingAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data: isAdmin } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });
      return isAdmin;
    }
  });

  // Ensuite, seulement si nous sommes admin, récupérons les stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_stats');
      if (error) throw error;
      return data as unknown as UserStats;
    },
    enabled: isAdmin === true // N'exécute la requête que si isAdmin est true
  });

  const isLoading = isLoadingAdmin || isLoadingStats;

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

  if (!isAdmin) {
    return null;
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
