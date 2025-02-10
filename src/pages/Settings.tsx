
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PaymentSettings } from "@/components/settings/PaymentSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const queryClient = useQueryClient();

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

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erreur lors du chargement du profil");
        throw error;
      }

      return data;
    },
  });

  const handleColorPaletteChange = async (value: string) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      toast.error("Erreur lors de la mise à jour de la palette de couleurs");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ color_palette: value })
      .eq("id", user?.id);

    if (error) {
      toast.error("Erreur lors de la mise à jour de la palette de couleurs");
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Palette de couleurs mise à jour avec succès");
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et paramètres de compte
          </p>
        </div>

        <AppearanceSettings
          colorPalette={profile?.color_palette || "default"}
          onColorPaletteChange={handleColorPaletteChange}
        />
        <ProfileSettings />
        <SecuritySettings />
        <NotificationSettings />
        <PaymentSettings />
        <PrivacySettings />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
