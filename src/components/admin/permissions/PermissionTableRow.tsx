
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PermissionSwitch } from "./PermissionSwitch";
import { FeaturePermissions } from "./FeaturePermissions";
import { PagePermission } from "@/hooks/usePagePermissionsManagement";

interface PermissionTableRowProps {
  permission: PagePermission;
  getPageDescription: (pagePath: string) => string;
  getFeaturePermission: (permission: PagePermission, featureKey: string) => boolean;
  onProfileChange: (permissionId: string, isPro: boolean) => void;
  onFeaturePermissionChange: (permissionId: string, featureKey: string, isPro: boolean) => void;
}

export const PermissionTableRow = ({ 
  permission, 
  getPageDescription, 
  getFeaturePermission, 
  onProfileChange, 
  onFeaturePermissionChange 
}: PermissionTableRowProps) => {
  return (
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
        <PermissionSwitch
          profile={permission.required_profile}
          onChange={(checked) => onProfileChange(permission.id, checked)}
          disabled={permission.page_path === '/dashboard'}
        />
      </TableCell>
      <TableCell>
        <FeaturePermissions
          permission={permission}
          getFeaturePermission={getFeaturePermission}
          onFeaturePermissionChange={onFeaturePermissionChange}
        />
      </TableCell>
    </TableRow>
  );
};
