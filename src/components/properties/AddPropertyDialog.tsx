
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AddPropertyDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    area: "",
    purchase_value: "",
    monthly_rent: "",
    loan_payment: "",
    latitude: "",
    longitude: "",
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      return data;
    },
  });

  const colorPalette = profile?.color_palette || "default";
  const paletteToBackground: Record<string, string> = {
    default: "bg-blue-500 hover:bg-blue-600",
    ocean: "bg-sky-500 hover:bg-sky-600",
    forest: "bg-green-500 hover:bg-green-600",
    sunset: "bg-orange-500 hover:bg-orange-600",
    candy: "bg-pink-400 hover:bg-pink-500",
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour ajouter un bien");
        return;
      }

      // Validate required fields
      if (!newProperty.name || !newProperty.address || !newProperty.area || !newProperty.purchase_value || !newProperty.latitude || !newProperty.longitude) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const { error } = await supabase.from("properties").insert({
        name: newProperty.name,
        address: newProperty.address,
        area: Number(newProperty.area),
        purchase_value: Number(newProperty.purchase_value),
        monthly_rent: newProperty.monthly_rent ? Number(newProperty.monthly_rent) : null,
        loan_payment: newProperty.loan_payment ? Number(newProperty.loan_payment) : null,
        latitude: Number(newProperty.latitude),
        longitude: Number(newProperty.longitude),
        profile_id: user.id,
      });

      if (error) throw error;

      toast.success("Bien ajouté avec succès");
      setOpen(false);
      setNewProperty({
        name: "",
        address: "",
        area: "",
        purchase_value: "",
        monthly_rent: "",
        loan_payment: "",
        latitude: "",
        longitude: "",
      });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Erreur lors de l'ajout du bien");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`text-white ${paletteToBackground[colorPalette]}`}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un bien
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un bien</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau bien à votre patrimoine immobilier
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du bien*</Label>
            <Input
              id="name"
              value={newProperty.name}
              onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
              placeholder="Ex: Appartement Paris"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Adresse*</Label>
            <Input
              id="address"
              value={newProperty.address}
              onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
              placeholder="15 rue de la Paix, 75002 Paris"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="area">Surface (m²)*</Label>
            <Input
              id="area"
              type="number"
              value={newProperty.area}
              onChange={(e) => setNewProperty({ ...newProperty, area: e.target.value })}
              placeholder="Ex: 75"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="purchase_value">Valeur d'achat (€)*</Label>
            <Input
              id="purchase_value"
              type="number"
              value={newProperty.purchase_value}
              onChange={(e) => setNewProperty({ ...newProperty, purchase_value: e.target.value })}
              placeholder="Ex: 350000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="monthly_rent">Loyer mensuel (€)</Label>
            <Input
              id="monthly_rent"
              type="number"
              value={newProperty.monthly_rent}
              onChange={(e) => setNewProperty({ ...newProperty, monthly_rent: e.target.value })}
              placeholder="Ex: 1200"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="loan_payment">Mensualité du prêt (€)</Label>
            <Input
              id="loan_payment"
              type="number"
              value={newProperty.loan_payment}
              onChange={(e) => setNewProperty({ ...newProperty, loan_payment: e.target.value })}
              placeholder="Ex: 1500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="latitude">Latitude*</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={newProperty.latitude}
                onChange={(e) => setNewProperty({ ...newProperty, latitude: e.target.value })}
                placeholder="Ex: 48.8566"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="longitude">Longitude*</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={newProperty.longitude}
                onChange={(e) => setNewProperty({ ...newProperty, longitude: e.target.value })}
                placeholder="Ex: 2.3522"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button className={`text-white ${paletteToBackground[colorPalette]}`} onClick={handleSubmit}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
