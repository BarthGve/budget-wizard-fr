
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Composant d'ordre supérieur qui fournit un TooltipProvider
 * Ce composant assure que tous les tooltips de l'application sont enveloppés 
 * dans un TooltipProvider
 */
export const WithTooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};
