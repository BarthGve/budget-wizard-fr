
import React from "react";
import { Rectangle } from "recharts";

/**
 * Composant personnalisé pour dessiner les barres avec radius uniquement en haut
 */
export const CustomBar = (props: any) => {
  const { x, y, width, height, fill, dataKey, index, payload } = props;
  
  // Déterminer si cette barre est au sommet
  const isTopBar = y === Math.min(...props.yAxis.map((item: any) => item.y));
  
  // Appliquer le radius uniquement à la barre du haut
  const radius = isTopBar ? 
    [4, 4, 0, 0] as [number, number, number, number] : // Cast explicite en tuple à 4 éléments
    0;
  
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      radius={radius}
    />
  );
};

/**
 * Fonction personnalisée pour rendre les barres empilées avec des rayons arrondis
 */
export const renderCustomizedStackBar = (topRetailers: string[]) => (props: any) => {
  const { x, y, width, height, fill, dataKey, payload } = props;
  
  // Récupérer l'index du retailer actuel dans la liste des retailers affichés
  const retailerIndex = topRetailers.findIndex(retailer => retailer === dataKey);
  
  // Dans Recharts, le premier retailer (index 0) est affiché en bas de la pile
  // Pour notre cas, nous voulons arrondir les coins de la dernière barre (celle du haut)
  const isTopBar = retailerIndex === 0;
  
  // Appliquer le radius uniquement à la barre du haut de la pile
  const radius = isTopBar ? [4, 4, 0, 0] as [number, number, number, number] : 0;
  
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      radius={radius}
    />
  );
};
