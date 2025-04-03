
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page non trouvée</h2>
        <p className="text-muted-foreground">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button onClick={() => navigate(-1)}>Retour</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
