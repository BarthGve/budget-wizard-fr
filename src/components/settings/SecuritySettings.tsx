
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TriangleAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/context/AuthProvider";

export const SecuritySettings = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { updatePassword } = useAuthContext();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);

    try {
      const success = await updatePassword(newPassword);
      
      if (success) {
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase.rpc('delete_own_account');
      
      if (error) {
        if (error.message?.includes('last admin')) {
          toast({
            title: "Erreur",
            description: "Impossible de supprimer le compte : vous êtes le dernier administrateur. Veuillez d'abord nommer un autre administrateur.",
            variant: "destructive"
          });
          setIsDialogOpen(false);
        } else {
          toast({
            title: "Erreur",
            description: "Erreur lors de la suppression du compte",
            variant: "destructive"
          });
        }
        return;
      }

      toast({
        title: "Succès",
        description: "Compte supprimé avec succès"
      });
      navigate('/');
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression du compte",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Sécurité</CardTitle>
          </div>
          <CardDescription>Gérez vos paramètres de sécurité et mot de passe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Entrez votre nouveau mot de passe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre nouveau mot de passe"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 border-destructive">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TriangleAlert className="h-5 w-5 text-destructive" /> 
            <CardTitle className="text-destructive">Zone de danger</CardTitle>
          </div>
          <CardDescription>Actions irréversibles pour votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Supprimer mon compte
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                  {isDeleting ? "Suppression..." : "Oui, supprimer mon compte"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
};
