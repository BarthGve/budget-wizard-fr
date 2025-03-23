
import { PermissionSwitch } from "./PermissionSwitch";
import { PagePermission } from "@/hooks/usePagePermissionsManagement";

interface FeaturePermissionsProps {
  permission: PagePermission;
  getFeaturePermission: (permission: PagePermission, featureKey: string) => boolean;
  onFeaturePermissionChange: (permissionId: string, featureKey: string, isPro: boolean) => void;
}

export const FeaturePermissions = ({ 
  permission, 
  getFeaturePermission, 
  onFeaturePermissionChange 
}: FeaturePermissionsProps) => {
  // Rendu conditionnel des fonctionnalités en fonction de la page
  if (permission.page_path === '/savings') {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm">Projets d'épargne:</span>
        <PermissionSwitch
          profile={getFeaturePermission(permission, 'savings_projects') ? "pro" : "basic"}
          onChange={(checked) => 
            onFeaturePermissionChange(permission.id, 'savings_projects', checked)
          }
        />
      </div>
    );
  }
  
  if (permission.page_path === '/vehicles') {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm">Suivi des dépenses:</span>
        <PermissionSwitch
          profile={getFeaturePermission(permission, 'vehicles_expenses') ? "pro" : "basic"}
          onChange={(checked) => 
            onFeaturePermissionChange(permission.id, 'vehicles_expenses', checked)
          }
        />
      </div>
    );
  }
  
  return null; // Pas de fonctionnalités spécifiques pour cette page
};
