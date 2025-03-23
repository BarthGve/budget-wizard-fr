
import { usePagePermissionsManagement } from "@/hooks/usePagePermissionsManagement";
import { PermissionsTable } from "./permissions/PermissionsTable";

export const PagePermissionsTable = () => {
  const {
    permissions,
    isLoading,
    handleProfileChange,
    handleFeaturePermissionChange,
    getPageDescription,
    getFeaturePermission
  } = usePagePermissionsManagement();

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
        <PermissionsTable
          permissions={permissions}
          getPageDescription={getPageDescription}
          getFeaturePermission={getFeaturePermission}
          onProfileChange={handleProfileChange}
          onFeaturePermissionChange={handleFeaturePermissionChange}
        />
      )}
    </div>
  );
};
