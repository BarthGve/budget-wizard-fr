
import { supabase } from "@/integrations/supabase/client";
import { ChangelogEntry, FormData } from "@/components/changelog/types";
import { toast } from "@/hooks/useToastWrapper";

export async function fetchChangelogEntries(showHidden = false) {
  const query = supabase
    .from("changelog_entries")
    .select("*")
    .order("date", { ascending: false });
  
  // Si showHidden est false (par défaut), filtrer les entrées visibles uniquement
  if (!showHidden) {
    query.eq("is_visible", true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as ChangelogEntry[];
}

export async function notifyChangelogEntry(id: string) {
  try {
    console.log("🔔 Tentative de notification automatique pour l'entrée:", id);
    
    const { data, error } = await supabase.functions.invoke("notify-changelog", {
      body: { id, manual: false }
    });
    
    if (error) {
      console.error("❌ Erreur lors de la notification automatique:", error);
      // On ne lance pas d'erreur ici pour éviter d'interrompre le flux principal
    } else {
      console.log("✅ Notification automatique envoyée avec succès:", data);
    }
  } catch (err) {
    console.error("❌ Exception lors de la notification automatique:", err);
    // On ne lance pas d'erreur ici pour éviter d'interrompre le flux principal
  }
}

export async function createChangelogEntry(values: FormData, skipNotification: boolean = false) {
  const { data, error } = await supabase
    .from("changelog_entries")
    .insert({
      title: values.title,
      version: values.version,
      description: values.description,
      type: values.type,
      date: values.date.toISOString(),
      is_visible: values.isVisible !== undefined ? values.isVisible : true, // Ajout du paramètre de visibilité
    })
    .select()
    .single();

  if (error) throw error;
  
  // Notification automatique pour la nouvelle entrée seulement si skipNotification est false
  if (!skipNotification && data?.id) {
    try {
      await notifyChangelogEntry(data.id);
    } catch (notifyError) {
      console.error("Erreur lors de la notification automatique:", notifyError);
      // Ne pas bloquer la création de l'entrée si la notification échoue
    }
  }
  
  return data;
}

export async function updateChangelogEntry(id: string, values: FormData) {
  const { data, error } = await supabase
    .from("changelog_entries")
    .update({
      title: values.title,
      version: values.version,
      description: values.description,
      type: values.type,
      date: values.date.toISOString(),
      is_visible: values.isVisible !== undefined ? values.isVisible : true, // Ajout du paramètre de visibilité
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteChangelogEntry(id: string) {
  const { error } = await supabase
    .from("changelog_entries")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function toggleChangelogVisibility(id: string, isVisible: boolean) {
  const { data, error } = await supabase
    .from("changelog_entries")
    .update({ is_visible: isVisible })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
