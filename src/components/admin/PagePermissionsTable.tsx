
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ProfileType } from "@/types/profile";

interface PagePermission {
  id: string;
  page_path: string;
  page_name: string;
  required_profile: ProfileType;
}

export const PagePermissionsTable = () => {
  const { data: permissions, refetch } = useQuery<PagePermission[]>({
    queryKey: ["pagePermissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_permissions")
        .select("*")
        .order("page_name");

      if (error) throw error;
      return data;
    },
  });

  const handleProfileChange = async (permissionId: string, newProfile: ProfileType) => {
    try {
      const { error } = await supabase
        .from("page_permissions")
        .update({ required_profile: newProfile })
        .eq("id", permissionId);

      if (error) throw error;

      toast.success("Permission mise à jour avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la permission");
      console.error("Error updating permission:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Permissions des pages</h2>
        <p className="text-sm text-muted-foreground">
          Gérez les niveaux d'accès requis pour chaque page
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>Chemin</TableHead>
              <TableHead>Profil requis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions?.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className="font-medium">{permission.page_name}</TableCell>
                <TableCell>{permission.page_path}</TableCell>
                <TableCell>
                  <Select
                    value={permission.required_profile}
                    onValueChange={(value: ProfileType) =>
                      handleProfileChange(permission.id, value)
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
