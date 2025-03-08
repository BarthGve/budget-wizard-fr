
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StyledLoader from "@/components/ui/StyledLoader";

const Admin = () => {
  const navigate = useNavigate();
  
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data, error } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <StyledLoader/>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
          <p className="text-muted-foreground">Gérez les utilisateurs et consultez les statistiques</p>
        </div>

        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="p-6 bg-gray-100 rounded-lg">
              <p className="text-center text-gray-500">Statistiques administrateur</p>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="p-6 bg-gray-100 rounded-lg">
              <p className="text-center text-gray-500">Gestion des utilisateurs</p>
            </div>
          </TabsContent>

          <TabsContent value="permissions">
            <div className="p-6 bg-gray-100 rounded-lg">
              <p className="text-center text-gray-500">Gestion des permissions</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
