
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

export const useNotificationSettings = () => {
  const [isChangelogNotificationEnabled, setIsChangelogNotificationEnabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setIsChangelogNotificationEnabled(data.notif_changelog ?? false);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChangelogNotificationToggle = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("profiles")
        .update({ notif_changelog: checked })
        .eq("id", user.id);

      if (error) throw error;

      setIsChangelogNotificationEnabled(checked);
      toast.success("Préférences de notification mises à jour");
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast.error(error.message || "Erreur lors de la mise à jour des préférences");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isChangelogNotificationEnabled,
    isUpdating,
    handleChangelogNotificationToggle,
    profile
  };
};
