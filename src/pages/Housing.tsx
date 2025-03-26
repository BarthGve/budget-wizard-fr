
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHousing } from "@/hooks/useHousing";
import { HousingForm } from "@/components/housing/HousingForm";
import { HousingContent } from "@/components/housing/HousingContent";
import StyledLoader from "@/components/ui/StyledLoader";

const Housing = () => {
  const { 
    hasProperty, 
    isLoadingProperty
  } = useHousing();

  if (isLoadingProperty) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4">
          <StyledLoader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {hasProperty ? (
          <HousingContent />
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Configuration de votre logement</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Pour commencer, veuillez renseigner les informations de votre logement principal.
              </p>
              <HousingForm />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Housing;
