
import { NotificationSettings } from "@/components/settings/notification-settings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RetailersSettings } from "@/components/settings/RetailersSettings";
import { ExpenseCategoriesSettings } from "@/components/settings/expense-categories/ExpenseCategoriesSettings";
import { DashboardPreferencesSettings } from "@/components/settings/dashboard-preferences/DashboardPreferencesSettings";
import { ColorPaletteSettings } from "@/components/settings/color-palette/ColorPaletteSettings";
import { User, Shield, Bell, Palette, Settings2 } from "lucide-react";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useLocation } from "react-router-dom"; 
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";

const UserSettings = () => {
  const { profile, isAdmin } = usePagePermissions();
  const canAccessRetailers = !!profile;
  const isMobile = useIsMobile();
  const { width } = useWindowSize();
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab');
  
  let activeTab = 'profile';
  if (defaultTab === 'security') {
    activeTab = 'security';
  } else if (defaultTab === 'notifications') {
    activeTab = 'notifications';
  } else if (defaultTab === 'appearance') {
    activeTab = 'appearance';
  } else if (defaultTab === 'preferences') {
    activeTab = 'preferences';
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="px-4 py-6 space-y-6 md:space-y-8">
        {/* En-tête */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Paramètres Du Compte
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Gérez vos paramètres de compte et préférences
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList 
            className={`w-full flex ${
              isMobile 
                ? "overflow-x-auto scrollbar-none p-1 gap-1" 
                : "justify-start gap-2"
            }`}
          >
            <TabsTrigger 
              value="profile" 
              className={`flex items-center gap-2 flex-shrink-0 ${
                isMobile 
                  ? "flex-1 min-w-[4.5rem] h-14 flex-col text-xs" 
                  : ""
              }`}
            >
              <User className={isMobile ? "h-4 w-4" : "h-4 w-4"} />
              <span className={isMobile ? "text-[11px]" : ""}>Profil</span>
            </TabsTrigger>

            <TabsTrigger 
              value="security" 
              className={`flex items-center gap-2 flex-shrink-0 ${
                isMobile 
                  ? "flex-1 min-w-[4.5rem] h-14 flex-col text-xs" 
                  : ""
              }`}
            >
              <Shield className={isMobile ? "h-4 w-4" : "h-4 w-4"} />
              <span className={isMobile ? "text-[11px]" : ""}>Sécurité</span>
            </TabsTrigger>

            <TabsTrigger 
              value="notifications" 
              className={`flex items-center gap-2 flex-shrink-0 ${
                isMobile 
                  ? "flex-1 min-w-[4.5rem] h-14 flex-col text-xs" 
                  : ""
              }`}
            >
              <Bell className={isMobile ? "h-4 w-4" : "h-4 w-4"} />
              <span className={isMobile ? "text-[11px]" : ""}>Notif.</span>
            </TabsTrigger>

            <TabsTrigger 
              value="appearance" 
              className={`flex items-center gap-2 flex-shrink-0 ${
                isMobile 
                  ? "flex-1 min-w-[4.5rem] h-14 flex-col text-xs" 
                  : ""
              }`}
            >
              <Palette className={isMobile ? "h-4 w-4" : "h-4 w-4"} />
              <span className={isMobile ? "text-[11px]" : ""}>Style</span>
            </TabsTrigger>

            <TabsTrigger 
              value="preferences" 
              className={`flex items-center gap-2 flex-shrink-0 ${
                isMobile 
                  ? "flex-1 min-w-[4.5rem] h-14 flex-col text-xs" 
                  : ""
              }`}
            >
              <Settings2 className={isMobile ? "h-4 w-4" : "h-4 w-4"} />
              <span className={isMobile ? "text-[11px]" : ""}>Préf.</span>
            </TabsTrigger>
          </TabsList>

          {/* Contenu des onglets */}
          <div className="mt-6 space-y-6">
            <TabsContent value="profile" className="space-y-6">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <ColorPaletteSettings />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <DashboardPreferencesSettings />
              {canAccessRetailers && <RetailersSettings />}
              <ExpenseCategoriesSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserSettings;
