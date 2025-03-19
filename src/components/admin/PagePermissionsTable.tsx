
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ProfileType } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Database } from "@/integrations/supabase/types";
import { useEffect } from "react";

type PagePermissionFeatures = {
  [key: string]: {
    required_profile: ProfileType;
  };
};

interface PagePermission {
  id: string;
  page_path: string;
  page_name: string;
  required_profile: ProfileType;
  feature_permissions: PagePermissionFeatures;
}

type SupabasePagePermission = Database['public']['Tables']['page_permissions']['Row'];

export const PagePermissionsTable = () => {
  const { data: permissions = [], refetch, isLoading } = useQuery<PagePermission[]>({
    queryKey: ["pagePermissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_permissions")
        .select("*")
        .order("page_name");

      if (error) throw error;

      // Transform the data to ensure feature_permissions has the correct type
      return data.map((permission: SupabasePagePermission): PagePermission => ({
        ...permission,
        feature_permissions: (permission.feature_permissions as PagePermissionFeatures) || {},
        required_profile: permission.required_profile as ProfileType,
      }));
    },
  });

  // Vérifie si l'entrée des véhicules existe, sinon la crée
  useEffect(() => {
    const checkVehiclesPermission = async () => {
      if (!isLoading && permissions.length > 0) {
        const vehiclesPermission = permissions.find(p => p.page_path === '/vehicles');
        
        if (!vehiclesPermission) {
          try {
            const { error } = await supabase
              .from("page_permissions")
              .insert({
                page_path: '/vehicles',
                page_name: 'Véhicules',
                required_profile: 'basic',
                feature_permissions: {}
              });
              
            if (error) throw error;
            
            toast.success("Permission pour la page véhicules ajoutée avec succès");
            refetch();
          } catch (error) {
            toast.error("Erreur lors de l'ajout de la permission pour la page véhicules");
            console.error("Error adding vehicles permission:", error);
          }
        }
      }
    };
    
    checkVehiclesPermission();
  }, [isLoading, permissions, refetch]);

  const handleProfileChange = async (permissionId: string, isPro: boolean) => {
    // Ne pas permettre le changement si c'est le tableau de bord
    if (permissions?.find(p => p.id === permissionId)?.page_path === '/dashboard') {
      toast.error("Le tableau de bord doit rester accessible à tous les utilisateurs");
      return;
    }

    try {
      const { error } = await supabase
        .from("page_permissions")
        .update({ required_profile: isPro ? "pro" : "basic" })
        .eq("id", permissionId);

      if (error) throw error;

      toast.success("Permission mise à jour avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la permission");
      console.error("Error updating permission:", error);
    }
  };

  const handleFeaturePermissionChange = async (permissionId: string, featureKey: string, isPro: boolean) => {
    const permission = permissions?.find(p => p.id === permissionId);
    if (!permission) return;

    const updatedFeaturePermissions = {
      ...permission.feature_permissions,
      [featureKey]: {
        required_profile: isPro ? "pro" : "basic"
      }
    };

    try {
      const { error } = await supabase
        .from("page_permissions")
        .update({ feature_permissions: updatedFeaturePermissions })
        .eq("id", permissionId);

      if (error) throw error;

      toast.success("Permission de fonctionnalité mise à jour avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la permission");
      console.error("Error updating feature permission:", error);
    }
  };

  const getPageDescription = (pagePath: string) => {
    const descriptions: { [key: string]: string } = {
      '/savings': "Permet aux utilisateurs de gérer leurs projets d'épargne et leurs versements mensuels.",
      '/dashboard': "Page d'accueil avec le résumé des finances.",
      '/vehicles': "Permet aux utilisateurs de gérer leurs véhicules et suivre les dépenses associées.",
      '/properties': "Gestion du patrimoine immobilier et des dépenses associées.",
      '/expenses': "Suivi des dépenses courantes et des enseignes.",
      '/contributors': "Gestion des revenus et des contributeurs au budget.",
      '/recurring-expenses': "Gestion des charges et dépenses récurrentes.",
      '/credits': "Suivi des crédits en cours et remboursés.",
      '/stocks': "Suivi des investissements boursiers."
      // Ajoutez d'autres descriptions au besoin
    };
    return descriptions[pagePath] || "Page de l'application";
  };

  const getFeaturePermission = (permission: PagePermission, featureKey: string) => {
    return permission.feature_permissions?.[featureKey]?.required_profile === 'pro';
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Permissions des pages</h2>
        <p className="text-sm text-muted-foreground">
          Gérez les niveaux d'accès requis pour chaque page. Le tableau de bord est accessible à tous les utilisateurs.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Chemin</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Version Pro requise</TableHead>
                <TableHead>Fonctionnalités</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions?.map((permission) => (
                <TableRow key={permission.id} className="group">
                  <TableCell className="font-medium">
                    {permission.page_name}
                    {permission.required_profile === "pro" && (
                      <Badge variant="secondary" className="ml-2">
                        Premium
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{permission.page_path}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {getPageDescription(permission.page_path)}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Modifiez les permissions pour contrôler l'accès à cette page</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={permission.required_profile === "pro"}
                        onCheckedChange={(checked) => handleProfileChange(permission.id, checked)}
                        disabled={permission.page_path === '/dashboard'}
                      />
                      <span className="text-sm text-muted-foreground">
                        {permission.required_profile === "pro" ? "Pro" : "Basic"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {permission.page_path === '/savings' && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Projets d'épargne:</span>
                        <Switch
                          checked={getFeaturePermission(permission, 'savings_projects')}
                          onCheckedChange={(checked) => 
                            handleFeaturePermissionChange(permission.id, 'savings_projects', checked)
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {getFeaturePermission(permission, 'savings_projects') ? "Pro" : "Basic"}
                        </span>
                      </div>
                    )}
                    {permission.page_path === '/vehicles' && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Suivi des dépenses:</span>
                        <Switch
                          checked={getFeaturePermission(permission, 'vehicles_expenses')}
                          onCheckedChange={(checked) => 
                            handleFeaturePermissionChange(permission.id, 'vehicles_expenses', checked)
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {getFeaturePermission(permission, 'vehicles_expenses') ? "Pro" : "Basic"}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
