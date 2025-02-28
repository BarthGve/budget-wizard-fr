import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PaymentSettings } from "@/components/settings/PaymentSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RetailersSettings } from "@/components/settings/RetailersSettings";
import { ExpenseCategoriesSettings } from "@/components/settings/expense-categories/ExpenseCategoriesSettings";
import { User, Settings2 } from "lucide-react";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useLocation } from "react-router-dom"; // Assurez-vous d'importer useLocation

const UserSettings = () => {
  const { profile } = usePagePermissions();
  const canAccessRetailers = !!profile;
  
  // Utiliser useLocation pour obtenir les paramètres de l'URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') === 'settings' ? 'settings' : 'profile';

  console.log('Debug permissions:', {
    profileType: profile?.profile_type,
    finalAccess: canAccessRetailers,
    activeTab // Log de l'onglet actif
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-bold tracking-tight text-3xl">Paramètres Du Compte</h2>
          <p className="text-muted-foreground">
            Gérez vos paramètres de compte et préférences
          </p>
        </div>
        <Tabs defaultValue={activeTab} className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Paramétrage
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
            <SecuritySettings />
            <NotificationSettings />
            <PaymentSettings />
            <PrivacySettings />
          </TabsContent>
          <TabsContent value="settings" className="space-y-6">
            {canAccessRetailers && <RetailersSettings />}
            <ExpenseCategoriesSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserSettings;