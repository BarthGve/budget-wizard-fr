
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Budget Wizard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground mb-6">
            <p>Application de gestion de budget et finances personnelles</p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Se connecter
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/register')}
              className="w-full"
            >
              S'inscrire
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
