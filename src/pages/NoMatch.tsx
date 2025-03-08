
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const NoMatch = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild>
          <Link to="/dashboard">Retour au tableau de bord</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default NoMatch;
