
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseCategoriesSettings } from '@/components/settings/expense-categories/ExpenseCategoriesSettings';
import { RetailersSettings } from '@/components/settings/RetailersSettings';

const Settings = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Paramètres système</h1>
        <p className="text-muted-foreground mb-6">
          Gérez les paramètres de l'application
        </p>

        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Catégories de dépenses</TabsTrigger>
            <TabsTrigger value="retailers">Enseignes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <ExpenseCategoriesSettings />
          </TabsContent>
          
          <TabsContent value="retailers" className="space-y-4">
            <RetailersSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
