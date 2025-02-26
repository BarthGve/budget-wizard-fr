
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { supabase } from "@/integrations/supabase/client";
import { ChangelogTimeline } from "@/components/changelog/ChangelogTimeline";

const Changelog = () => {
  const { isAdmin } = usePagePermissions();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["changelog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("changelog_entries")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Changelog</h1>
            <p className="text-muted-foreground mt-2">
              Suivez les dernières mises à jour et améliorations
            </p>
          </div>
          {isAdmin && (
            <Button className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Nouvelle entrée
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ChangelogTimeline entries={entries} />
        )}
      </div>
    </div>
  );
};

export default Changelog;
