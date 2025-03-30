
/**
 * Fonction utilitaire pour télécharger un fichier en créant dynamiquement un élément DOM.
 * Ceci évite les erreurs liées à l'utilisation incorrecte de document.createElement sur l'objet VehicleDocument.
 */
export const downloadFile = (data: Blob, filename: string): void => {
  // Créer un URL pour le blob
  const url = URL.createObjectURL(data);
  
  // Créer un élément d'ancrage pour le téléchargement
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Ajouter l'élément au DOM, cliquer dessus, puis le retirer
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Libérer l'URL créée
  URL.revokeObjectURL(url);
};
