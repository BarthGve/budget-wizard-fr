
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est admin
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
    return <div>Chargement...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs et les paramètres de l'application
          </p>
        </div>
        {/* Le contenu de l'administration sera ajouté ici */}
      </div>
    </DashboardLayout>
  );
};

export default Admin;
