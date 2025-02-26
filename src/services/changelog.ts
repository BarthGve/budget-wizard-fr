
import { supabase } from "@/integrations/supabase/client";
import { ChangelogEntry, FormData } from "@/components/changelog/types";

export async function fetchChangelogEntries() {
  const { data, error } = await supabase
    .from("changelog_entries")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data as ChangelogEntry[];
}

export async function createChangelogEntry(values: FormData) {
  const { error } = await supabase
    .from("changelog_entries")
    .insert({
      title: values.title,
      version: values.version,
      description: values.description,
      type: values.type,
      date: values.date.toISOString(),
    });

  if (error) throw error;
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
