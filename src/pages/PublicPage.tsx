
import React from 'react';
import { Outlet } from "react-router-dom";

// Composant pour les pages publiques (login, register, etc.)
const PublicPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicPage;
