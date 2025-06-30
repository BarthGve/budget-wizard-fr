
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook optimisé pour les données statiques avec cache très long terme
 * Évite les requêtes répétitives sur les données de référence
 */
export const useStaticOptimized = () => {
  // Types de dépenses véhicule avec cache 24h
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
    staleTime: 1000 * 60 * 60 * 24, // 24 heures
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 jours
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  // Compagnies de carburant avec cache 24h
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

  // Catégories de documents véhicule avec cache 24h
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
    vehicleDocumentCategories: vehicleDocumentCategories || [],
    isLoading: !vehicleExpenseTypes || !fuelCompanies || !vehicleDocumentCategories
  };
};
