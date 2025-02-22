
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

interface PagePermission {
  id: string;
  page_path: string;
  page_name: string;
  required_profile: ProfileType;
  feature_permissions: {
    [key: string]: {
      required_profile: ProfileType;
    };
  };
}

export const PagePermissionsTable = () => {
  const { data: permissions = [], refetch } = useQuery<PagePermission[]>({
    queryKey: ["pagePermissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_permissions")
        .select("*")
        .order("page_name");

      if (error) throw error;

      // Ensure feature_permissions is properly typed
      return data.map(permission => ({
        ...permission,
        feature_permissions: permission.feature_permissions || {}
      })) as PagePermission[];
    },
  });

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>Chemin</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Version Pro requise</TableHead>
              <TableHead>Fonctionnalités Pro</TableHead>
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
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
