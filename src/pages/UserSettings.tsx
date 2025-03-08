
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationSettings } from '@/components/settings/notification-settings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { PaymentSettings } from '@/components/settings/PaymentSettings';

const UserSettings = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Paramètres</h1>
        <p className="text-muted-foreground mb-6">
          Gérez vos paramètres de compte et préférences
        </p>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="w-full max-w-[600px] overflow-x-auto">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <PrivacySettings />
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-4">
            <PaymentSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserSettings;
