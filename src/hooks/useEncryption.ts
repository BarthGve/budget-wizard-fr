
import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkEncryptionStatus, enableEncryption, migrateContributorsToEncrypted } from "@/services/contributors";

export const useEncryption = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // Vérifier le statut du chiffrement au chargement
  useEffect(() => {
    const fetchEncryptionStatus = async () => {
      try {
        const status = await checkEncryptionStatus();
        setIsEnabled(status);
      } catch (error) {
        console.error("Erreur lors de la vérification du statut de chiffrement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEncryptionStatus();
  }, []);

  // Fonction pour activer le chiffrement
  const activateEncryption = useCallback(async () => {
    setIsLoading(true);
    try {
      await enableEncryption();
      setIsEnabled(true);
      
      // Invalider toutes les requêtes pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      
      toast.success("Le chiffrement des données a été activé avec succès");
    } catch (error: any) {
      console.error("Erreur lors de l'activation du chiffrement:", error);
      toast.error(error.message || "Erreur lors de l'activation du chiffrement");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  // Fonction pour migrer les données existantes
  const migrateExistingData = useCallback(async () => {
    setIsLoading(true);
    try {
      await migrateContributorsToEncrypted();
      
      // Invalider toutes les requêtes pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      
      toast.success("Les données existantes ont été migrées avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la migration des données:", error);
      toast.error(error.message || "Erreur lors de la migration des données");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  return {
    isEncryptionEnabled: isEnabled,
    isLoading,
    activateEncryption,
    migrateExistingData
  };
};
