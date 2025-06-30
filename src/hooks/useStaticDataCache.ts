
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook pour les données statiques avec cache long terme
 * Évite les requêtes répétitives sur les données de référence
 */
export const useStaticDataCache = () => {
  // Données de référence avec cache très long
  const { data: vehicleExpenseTypes } = useQuery({
    queryKey: ["static-vehicle-expense-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_expense_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 heures de cache
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 jours en mémoire
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const { data: fuelCompanies } = useQuery({
    queryKey: ["static-fuel-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fuel_companies")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const { data: vehicleDocumentCategories } = useQuery({
    queryKey: ["static-document-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_document_categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return {
    vehicleExpenseTypes: vehicleExpenseTypes || [],
    fuelCompanies: fuelCompanies || [],
    vehicleDocumentCategories: vehicleDocumentCategories || []
  };
};
