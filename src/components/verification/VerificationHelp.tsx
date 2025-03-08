
/**
 * Affiche les conseils de dépannage pour la réception d'emails
 */
export const VerificationHelp = () => {
  return (
    <div className="text-sm text-muted-foreground">
      <p className="text-center mb-2">Vous n'avez pas reçu l'email ?</p>
      <ul className="list-disc list-inside space-y-1">
        <li>Vérifiez votre dossier spam</li>
        <li>Vérifiez que l'adresse email est correcte</li>
        <li>Patientez quelques minutes avant de réessayer</li>
      </ul>
    </div>
  );
};
