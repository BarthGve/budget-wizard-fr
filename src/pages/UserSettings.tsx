
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { PaymentSettings } from "@/components/settings/PaymentSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RetailersSettings } from "@/components/settings/RetailersSettings";
import { ExpenseCategoriesSettings } from "@/components/settings/expense-categories/ExpenseCategoriesSettings";
import { DashboardPreferencesSettings } from "@/components/settings/dashboard-preferences/DashboardPreferencesSettings";
import { User, Settings2, Bell } from "lucide-react";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useLocation } from "react-router-dom"; 
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";

const UserSettings = () => {
  const { profile, isAdmin } = usePagePermissions();
  const canAccessRetailers = !!profile;
  const isMobile = useIsMobile();
  const { width } = useWindowSize();
  
  // Utiliser useLocation pour obtenir les paramètres de l'URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab');
  
  // Déterminer l'onglet actif en fonction du paramètre
  let activeTab = 'profile';
  if (defaultTab === 'settings') {
    activeTab = 'settings';
  } else if (defaultTab === 'notifications') {
    activeTab = 'notifications';
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        <div className={isMobile ? "px-2" : ""}>
          <h2 className={`font-bold tracking-tight ${isMobile ? "text-2xl" : "text-3xl"}`}>
            Paramètres Du Compte
          </h2>
          <p className={`text-muted-foreground ${isMobile ? "text-sm" : ""}`}>
            Gérez vos paramètres de compte et préférences
          </p>
        </div>
        <Tabs defaultValue={activeTab} className="space-y-4 md:space-y-6">
          <div className="relative w-full">
            <TabsList 
              className={`bg-background border w-full ${
                isMobile 
                  ? "flex justify-between overflow-x-auto scrollbar-none p-0.5" 
                  : ""
              }`}
              style={isMobile ? { scrollbarWidth: 'none' } : {}}
            >
              <TabsTrigger 
                value="profile" 
                className={`flex items-center gap-2 ${
                  isMobile 
                    ? "flex-1 text-xs px-2 py-1.5 min-w-[80px]" 
                    : ""
                }`}
              >
                <User className={isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
                {!isMobile ? "Profil" : ""}
                <span className={isMobile ? "text-[10px] mt-0.5" : "hidden"}>Profil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className={`flex items-center gap-2 ${
                  isMobile 
                    ? "flex-1 text-xs px-2 py-1.5 min-w-[80px]" 
                    : ""
                }`}
              >
                <Bell className={isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
                {!isMobile ? "Notifications" : ""}
                <span className={isMobile ? "text-[10px] mt-0.5" : "hidden"}>Notif.</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className={`flex items-center gap-2 ${
                  isMobile 
                    ? "flex-1 text-xs px-2 py-1.5 min-w-[80px]" 
                    : ""
                }`}
              >
                <Settings2 className={isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
                {!isMobile ? "Paramétrage" : ""}
                <span className={isMobile ? "text-[10px] mt-0.5" : "hidden"}>Param.</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="profile" className={`space-y-4 md:space-y-6 ${isMobile ? "px-0" : ""}`}>
            <ProfileSettings />
            <SecuritySettings />
           {/*<PaymentSettings /> */} 
            {/*<PrivacySettings /> */}
          </TabsContent>
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>
          <TabsContent value="settings" className="space-y-6">
            <DashboardPreferencesSettings />
            {canAccessRetailers && <RetailersSettings />}
            <ExpenseCategoriesSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserSettings;
