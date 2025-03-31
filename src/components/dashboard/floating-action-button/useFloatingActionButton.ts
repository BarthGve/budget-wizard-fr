
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useVehiclesContainer } from "@/hooks/useVehiclesContainer";
import { useVehicles } from "@/hooks/useVehicles";
import { useProfileFetcher } from "@/components/dashboard/dashboard-tab/ProfileFetcher";

interface Retailer {
  id: string;
  name: string;
  logo_url?: string;
}

export const useFloatingActionButton = () => {
  // États pour la gestion du menu et des dialogues
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showVehiclesList, setShowVehiclesList] = useState(false);
  const [showRetailersList, setShowRetailersList] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [retailerExpenseDialogOpen, setRetailerExpenseDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [isLoadingRetailers, setIsLoadingRetailers] = useState(false);
  
  // Hooks et services
  const navigate = useNavigate();
  const { selectedVehicleId, setSelectedVehicleId } = useVehiclesContainer();
  const { vehicles, isLoading } = useVehicles();
  const { data: profile } = useProfileFetcher();
  
  // Vérification du type de profil utilisateur
  const isProUser = profile?.profile_type === "pro";
  
  // Filtrer les véhicules actifs
  const activeVehicles = vehicles?.filter(v => v.status !== "vendu") || [];

  // Fonction pour basculer l'état du menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if ((showVehiclesList || showRetailersList) && !isMenuOpen) {
      setShowVehiclesList(false);
      setShowRetailersList(false);
    }
  };
  
  // Récupération des détaillants quand nécessaire
  useEffect(() => {
    const fetchRetailers = async () => {
      setIsLoadingRetailers(true);
      try {
        const { data, error } = await supabase
          .from("retailers")
          .select("*")
          .order("name");

        if (error) throw error;
        setRetailers(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des enseignes:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les enseignes",
          variant: "destructive",
        });
      } finally {
        setIsLoadingRetailers(false);
      }
    };

    if (showRetailersList) {
      fetchRetailers();
    }
  }, [showRetailersList]);

  // Gestionnaires d'événements
  const handleAddFuelExpenseClick = () => {
    if (activeVehicles.length > 0) {
      setShowVehiclesList(true);
      setShowRetailersList(false);
    } else {
      navigate('/vehicles?action=addVehicle');
      setIsMenuOpen(false);
    }
  };
  
  const handleAddRetailerExpense = () => {
    setShowRetailersList(true);
    setShowVehiclesList(false);
  };
  
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setSelectedVehicle(vehicleId);
    setExpenseDialogOpen(true);
    setIsMenuOpen(false);
    setShowVehiclesList(false);
  };
  
  const handleRetailerSelect = (retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setRetailerExpenseDialogOpen(true);
    setIsMenuOpen(false);
    setShowRetailersList(false);
  };
  
  const handleExpenseSuccess = () => {
    setExpenseDialogOpen(false);
    setSelectedVehicle(null);
  };
  
  const handleExpenseCancel = () => {
    setExpenseDialogOpen(false);
    setSelectedVehicle(null);
  };

  const handleRetailerExpenseSuccess = () => {
    setRetailerExpenseDialogOpen(false);
    setSelectedRetailer(null);
  };
  
  const handleRetailerExpenseCancel = () => {
    setRetailerExpenseDialogOpen(false);
    setSelectedRetailer(null);
  };

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      setIsMenuOpen(false);
      setShowVehiclesList(false);
      setShowRetailersList(false);
      setExpenseDialogOpen(false);
      setRetailerExpenseDialogOpen(false);
      setSelectedVehicle(null);
      setSelectedRetailer(null);
    };
  }, []);

  return {
    // États
    isMenuOpen,
    showVehiclesList,
    showRetailersList,
    expenseDialogOpen,
    retailerExpenseDialogOpen,
    selectedVehicle,
    selectedRetailer,
    retailers,
    isLoadingRetailers,
    activeVehicles,
    isLoading,
    isProUser,
    
    // Gestionnaires d'événements
    toggleMenu,
    handleAddFuelExpenseClick,
    handleAddRetailerExpense,
    handleVehicleSelect,
    handleRetailerSelect,
    handleExpenseSuccess,
    handleExpenseCancel,
    handleRetailerExpenseSuccess,
    handleRetailerExpenseCancel,
    
    // Setters
    setExpenseDialogOpen,
    setRetailerExpenseDialogOpen,
    setShowVehiclesList
  };
};

export type { Retailer };
