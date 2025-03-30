
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
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100); // Un petit délai pour s'assurer que le téléchargement a bien commencé
};

/**
 * Vérifie si une chaîne est une URL valide
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
