
import { useHousing } from "@/hooks/useHousing";
import { HousingCard } from "./HousingCard";
import { LocationWeatherCard } from "./LocationWeatherCard";
import { HousingExpensesTable } from "./HousingExpensesTable";
import StyledLoader from "@/components/ui/StyledLoader";
import { HousingHeader } from "./HousingHeader";

export const HousingContent = () => {
  const { 
    property, 
    isLoadingProperty,
    recurringExpenses,
    isLoadingExpenses,
    calculateYearlyTotal
  } = useHousing();

  if (isLoadingProperty) {
    return <StyledLoader />;
  }

  if (!property) {
    return <div>Aucun logement trouvé</div>;
  }

  return (
    <div className="space-y-8">
      <HousingHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HousingCard property={property} />
        <LocationWeatherCard 
          latitude={property.latitude} 
          longitude={property.longitude} 
          address={property.address}
        />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Charges liées au logement</h2>
        <HousingExpensesTable 
          expenses={recurringExpenses || []} 
          isLoading={isLoadingExpenses}
          yearlyTotal={calculateYearlyTotal()}
        />
      </div>
    </div>
  );
};
