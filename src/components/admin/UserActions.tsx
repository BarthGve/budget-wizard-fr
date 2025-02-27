
import { Button } from "@/components/ui/button";
import { Trash2, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileType } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserActionsProps {
  userId: string;
  userEmail: string;
  currentRole: "user" | "admin";
  currentProfile: ProfileType;
  isVerified: boolean;
  onRoleChange: (userId: string, newRole: "user" | "admin") => void;
  onProfileChange: (userId: string, newProfile: ProfileType) => void;
  onDelete: (userId: string) => void;
}

export const UserActions = ({
  userId,
  userEmail,
  currentRole,
  currentProfile,
  isVerified,
  onRoleChange,
  onProfileChange,
  onDelete,
}: UserActionsProps) => {
  const handleVerifyUser = async () => {
    try {
      const { error } = await supabase.rpc('force_verify_user', {
        target_user_id: userId
      });

      if (error) throw error;

      toast.success("Utilisateur vérifié avec succès");
      window.location.reload();
    } catch (error: any) {
      toast.error("Erreur lors de la vérification de l'utilisateur");
      console.error("Error verifying user:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
       {!isVerified && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleVerifyUser}
            className="text-gray-500 hover:text-green-600 hover:bg-green-50"
          >
            <ShieldCheck className="h-4 w-4" />
          </Button>
        )}
      <Select
        value={currentRole}
        onValueChange={(value: "user" | "admin") => onRoleChange(userId, value)}
      >
        <SelectTrigger className="w-[150px] border-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">Membre</SelectItem>
          <SelectItem value="admin">Administrateur</SelectItem>
        </SelectContent>
      </Select>
      {currentRole === "user" && (
        <div className="flex items-center gap-2 shrink-0">
          <Switch
            checked={currentProfile === "pro"}
            onCheckedChange={(checked) => onProfileChange(userId, checked ? "pro" : "basic")}
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {currentProfile === "pro" ? "Pro" : "Basic"}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 shrink-0">
       
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer l'utilisateur {userEmail} ? Cette action ne peut pas être annulée
                et supprimera toutes les données associées à cet utilisateur.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(userId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
