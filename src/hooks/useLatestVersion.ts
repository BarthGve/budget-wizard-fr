
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { appConfig } from '@/config/app.config';

export function useLatestVersion() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchLatestVersion() {
      try {
        // Tenter de récupérer la dernière version depuis la table des paramètres
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('name', 'app_version')
          .single();

        if (error) {
          // Si une erreur se produit, utiliser la version du fichier de config
          console.warn("Impossible de récupérer la version depuis la base de données:", error);
          setLatestVersion(appConfig.version);
        } else if (data) {
          setLatestVersion(data.value);
        } else {
          // Fallback sur la version du fichier de configuration
          setLatestVersion(appConfig.version);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de la version:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        // Toujours définir une version, même en cas d'erreur
        setLatestVersion(appConfig.version);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestVersion();
  }, []);

  return { latestVersion, isLoading, error };
}
