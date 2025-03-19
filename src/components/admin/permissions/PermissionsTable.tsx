
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionTableRow } from "./PermissionTableRow";
import { PagePermission } from "@/hooks/usePagePermissionsManagement";

interface PermissionsTableProps {
  permissions: PagePermission[];
  getPageDescription: (pagePath: string) => string;
  getFeaturePermission: (permission: PagePermission, featureKey: string) => boolean;
  onProfileChange: (permissionId: string, isPro: boolean) => void;
  onFeaturePermissionChange: (permissionId: string, featureKey: string, isPro: boolean) => void;
}

export const PermissionsTable = ({
  permissions,
  getPageDescription,
  getFeaturePermission,
  onProfileChange,
  onFeaturePermissionChange
}: PermissionsTableProps) => {
  return (
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
          {permissions.map((permission) => (
            <PermissionTableRow
              key={permission.id}
              permission={permission}
              getPageDescription={getPageDescription}
              getFeaturePermission={getFeaturePermission}
              onProfileChange={onProfileChange}
              onFeaturePermissionChange={onFeaturePermissionChange}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
